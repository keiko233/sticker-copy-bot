"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useLockFn, useMount } from "ahooks";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { Sticker } from "@/schema";

const BASE_URL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core/dist/umd";

export default function AutoImage({ data }: { data: Sticker }) {
  const isVideo = data.binary.startsWith("data:video/webm;base64");

  const blob = Buffer.from(data.binary.split(",")[1], "base64");
  const blobUrl = URL.createObjectURL(
    new Blob([blob], { type: isVideo ? "video/webm" : "image/webp" }),
  );

  const ffmpegRef = useRef(new FFmpeg());

  const [isPending, startTransition] = useTransition();

  const [gifUrl, setGifUrl] = useState("");

  const handleVideoProcess = useLockFn(async () => {
    if (isPending) {
      return;
    }

    startTransition(async () => {
      try {
        ffmpegRef.current.on("log", ({ message }) => {
          console.log(message);
        });

        await ffmpegRef.current.load({
          coreURL: await toBlobURL(
            `${BASE_URL}/ffmpeg-core.js`,
            "text/javascript",
          ),
          wasmURL: await toBlobURL(
            `${BASE_URL}/ffmpeg-core.wasm`,
            "application/wasm",
          ),
        });

        await ffmpegRef.current.writeFile(
          "input.webm",
          await fetchFile(blobUrl),
        );

        await ffmpegRef.current.exec([
          "-i",
          "input.webm",
          "-c:v",
          "gif",
          "output.gif",
        ]);

        const data = await ffmpegRef.current.readFile("output.gif");

        const ouputBlob = new Blob([data], { type: "image/gif" });

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setGifUrl(base64data);
        };
        reader.readAsDataURL(ouputBlob);
      } catch (error) {
        console.error("Error processing video:", error);
      }
    });
  });

  useMount(() => {
    if (isVideo) {
      handleVideoProcess();
    }
  });

  return isVideo ? (
    isPending ? (
      <div className="grid aspect-square w-full place-content-center text-center font-mono">
        Please wait, processing...
      </div>
    ) : (
      gifUrl && <Image height={512} width={512} src={gifUrl} alt="sticker" />
    )
  ) : (
    <Image height={512} width={512} src={data.binary} alt="sticker" />
  );
}
