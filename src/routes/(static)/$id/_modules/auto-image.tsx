import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useEffect, useRef, useState } from "react";

const BASE_URL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core/dist/umd";

export function AutoImage({ src, alt }: { src: string; alt: string }) {
  const isVideo = src.startsWith("data:video/webm;base64");

  const ffmpegRef = useRef(new FFmpeg());
  const lockRef = useRef(false);

  const [processing, setProcessing] = useState(false);
  const [gifUrl, setGifUrl] = useState("");

  useEffect(() => {
    if (!isVideo) return;
    if (lockRef.current) return;
    lockRef.current = true;

    let cancelled = false;

    const process = async () => {
      setProcessing(true);

      try {
        const ffmpeg = ffmpegRef.current;

        ffmpeg.on("log", ({ message }) => {
          console.log(message);
        });

        await ffmpeg.load({
          coreURL: await toBlobURL(
            `${BASE_URL}/ffmpeg-core.js`,
            "text/javascript",
          ),
          wasmURL: await toBlobURL(
            `${BASE_URL}/ffmpeg-core.wasm`,
            "application/wasm",
          ),
        });

        // Convert data URL to blob URL for fetchFile
        const base64 = src.split(",")[1];
        const binaryStr = atob(base64);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        const blobUrl = URL.createObjectURL(
          new Blob([bytes], { type: "video/webm" }),
        );

        await ffmpeg.writeFile("input.webm", await fetchFile(blobUrl));

        URL.revokeObjectURL(blobUrl);

        await ffmpeg.exec([
          "-i",
          "input.webm",
          "-vf",
          "scale=512:512,pad=512:512:(ow-iw)/2:(oh-ih)/2:white",
          "-c:v",
          "gif",
          "output.gif",
        ]);

        const data = await ffmpeg.readFile("output.gif");

        const outputBlob = new Blob([new Uint8Array(data as Uint8Array)], {
          type: "image/gif",
        });

        const reader = new FileReader();
        reader.onloadend = () => {
          if (!cancelled) {
            setGifUrl(reader.result as string);
            setProcessing(false);
          }
        };
        reader.readAsDataURL(outputBlob);
      } catch (error) {
        console.error("Error processing video:", error);
        if (!cancelled) {
          setProcessing(false);
        }
      }
    };

    process();

    return () => {
      cancelled = true;
    };
  }, [isVideo, src]);

  if (!isVideo) {
    return <img className="h-auto w-full" src={src} alt={alt} />;
  }

  if (processing) {
    return (
      <div className="grid aspect-square w-full place-content-center text-center font-mono">
        Please wait, processing...
      </div>
    );
  }

  if (gifUrl) {
    return <img className="h-auto w-full" src={gifUrl} alt={alt} />;
  }

  return null;
}
