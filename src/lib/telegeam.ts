import type { UserFromGetMe } from "grammy/types";
import { Bot } from "grammy/web";
import { start } from "@/bot/command/start";
import { sticker } from "@/bot/event/sticker";
import { getMe } from "./bot-api";
import { getBotToken } from "./env";
import { mention } from "@/bot/event/mention";

class BotService {
  public bot: Bot;

  constructor(token: string, botInfo: UserFromGetMe) {
    this.bot = new Bot(token, {
      botInfo,
    });

    this.register();
  }

  // all commands are registered here
  private register() {
    start(this.bot);
    sticker(this.bot);
    mention(this.bot);
  }

  public getBot() {
    return this.bot;
  }
}

let cachedBotService: BotService;

export const getBotService = async () => {
  // if (!isDev && cachedBotService) {
  //   return cachedBotService;
  // }
  const token = await getBotToken();

  cachedBotService = new BotService(token, await getMe(token));

  return cachedBotService;
};
