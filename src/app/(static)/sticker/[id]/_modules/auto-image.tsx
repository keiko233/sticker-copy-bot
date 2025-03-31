"use client";

import Image from "next/image";
import { Sticker } from "@/schema";

export default function AutoImage({ data }: { data: Sticker }) {
  const isVideo = data.binary.startsWith("data:video/webm;base64");

  const blob = Buffer.from(data.binary.split(",")[1], "base64");
  const blobUrl = URL.createObjectURL(
    new Blob([blob], { type: isVideo ? "video/webm" : "image/webp" }),
  );

  return isVideo ? (
    <video src={blobUrl} controls autoPlay loop />
  ) : (
    <Image height={512} width={512} src={data.binary} alt="sticker" />
  );
}
