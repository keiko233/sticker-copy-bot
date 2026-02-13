import type { CommandContext, Context } from "grammy/web";
import prettyBytes from "pretty-bytes";
import { getWebhookInitialValue } from "@/query/kv";
import { createSticker } from "@/query/sticker";
import { downloadFile } from "@/lib/bot-api";
import { array2text, formatError } from "@/utils/fmt";
import { waitUntil } from "cloudflare:workers";
import { env } from "cloudflare:workers";

export const stickerHandler = async (ctx: CommandContext<Context>) => {
  if (!ctx.message) {
    return;
  }

  const sticker =
    ctx.message!.sticker || ctx.message?.reply_to_message?.sticker;

  if (!sticker) {
    await ctx.reply("Please send a sticker.");
    return;
  }

  if (sticker?.is_animated) {
    await ctx.reply("Animate stickers are not supported yet.");
    return;
  }

  const reply = await ctx.reply("Please wait...", {
    reply_to_message_id: ctx.message.message_id,
    disable_notification: true,
  });

  const backendFn = async () => {
    const file = await ctx.api.getFile(sticker.file_id);

    const binary = await downloadFile(file);

    const result = await createSticker({
      data: {
        uid: ctx.update.message.from.id,
        name: ctx.update.message.from.first_name,
        file_id: sticker.file_id,
        file_size: sticker.file_size ?? 0,
      },
    });

    if (!result) {
      throw new Error("Failed to create sticker record.");
    }

    const storage = await env.R2.put(result.id, binary, {
      httpMetadata: {
        contentType: sticker.is_video ? "video/webm" : "image/webp",
        contentDisposition: `inline; filename="${result.id}.${sticker.is_video ? "webm" : "webp"}";`,
      },
    });

    if (!storage) {
      throw new Error("Failed to upload sticker to storage.");
    }

    const url = await getWebhookInitialValue();

    await ctx.reply(
      array2text([
        `Sticker Size: ${prettyBytes(sticker.file_size ?? 0)}`,
        `Download Link: ${url}/${result.id}`,
      ]),
      {
        reply_to_message_id: ctx.message.message_id,
      },
    );
  };

  waitUntil(
    backendFn()
      .catch(async (e) => {
        console.error(e);

        await ctx.reply(array2text(["Error occurred.", formatError(e)]), {
          reply_to_message_id: ctx.message.message_id,
          disable_notification: true,
        });
      })
      .finally(async () => {
        await ctx.api.deleteMessage(reply.chat.id, reply.message_id);
      }),
  );
};
