import type { Bot, CommandContext, Context } from "grammy/web";
import { stickerHandler } from "../common/sticker";

export const sticker = async (bot: Bot) => {
  bot.on(":sticker", async (ctx) => {
    if (!ctx.message) {
      return;
    }

    if (ctx.chat.type !== "private") {
      return;
    }

    await stickerHandler(ctx as CommandContext<Context>);
  });
};
