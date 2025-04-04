import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { CommandContext, Context } from "grammy/web";
import prettyBytes from "pretty-bytes";
import { getWebhookInitialValue } from "@/actions/kv";
import { createSticker } from "@/actions/query/sticker";
import { downloadFile } from "@/lib/bot-api";
import { array2text, formatError } from "@/utils/fmt";

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

    const base64Data = sticker.is_video
      ? `data:video/webm;base64,${binary.toString("base64")}`
      : `data:image/webp;base64,${binary.toString("base64")}`;

    const [result, error] = await createSticker({
      uid: ctx.update.message.from.id,
      name: ctx.update.message.from.first_name,
      file_id: sticker.file_id,
      file_size: sticker.file_size ?? 0,
      binary: base64Data,
    });

    if (!result) {
      throw new Error(formatError(error));
    }

    const url = await getWebhookInitialValue();

    await ctx.reply(
      array2text([
        `Sticker Size: ${prettyBytes(sticker.file_size ?? 0)}`,
        `Download Link: ${url}/sticker/${result.id}`,
      ]),
      {
        reply_to_message_id: ctx.message.message_id,
      },
    );
  };

  const { ctx: cfctx } = await getCloudflareContext({ async: true });

  cfctx.waitUntil(
    backendFn()
      .catch(async (e) => {
        console.error(e);

        await ctx.reply("Error occurred.", {
          reply_to_message_id: ctx.message.message_id,
          disable_notification: true,
        });
      })
      .finally(async () => {
        await ctx.api.deleteMessage(reply.chat.id, reply.message_id);
      }),
  );
};
