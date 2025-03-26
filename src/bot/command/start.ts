import type { Bot } from "grammy/web";
import { array2text } from "@/utils/fmt";

export const start = (bot: Bot) => {
  bot.command("start", async (ctx) => {
    await ctx.reply(array2text(["Send me stickers."]), {
      reply_parameters: {
        message_id: ctx.msg.message_id,
      },
    });
  });
};
