import type { Bot, CommandContext, Context } from "grammy/web";
import { stickerHandler } from "../common/sticker";

export const mention = async (bot: Bot) => {
  bot.on("::mention", async (ctx) => {
    if (!ctx.message?.reply_to_message) {
      return;
    }

    if (!ctx.message.reply_to_message.sticker) {
      await ctx.reply("Please mention a sticker.", {
        reply_to_message_id: ctx.message.message_id,
      });

      return;
    }

    await stickerHandler(ctx as CommandContext<Context>);
  });
};
