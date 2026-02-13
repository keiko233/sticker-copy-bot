import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { env } from "cloudflare:workers";

export const getStickerFile = createServerFn({
  method: "GET",
})
  .inputValidator(z.string())
  .handler(async ({ data }) => {
    const r2Object = await env.R2.get(data);

    if (!r2Object) {
      return null;
    }

    let fileUrl: string | null = null;

    const arrayBuffer = await r2Object.arrayBuffer();

    const bytes = new Uint8Array(arrayBuffer);

    const base64 = btoa(
      Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""),
    );

    const contentType = r2Object.httpMetadata?.contentType || "image/webp";

    fileUrl = `data:${contentType};base64,${base64}`;

    return fileUrl;
  });
