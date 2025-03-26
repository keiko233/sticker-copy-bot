import type { File, UserFromGetMe } from "grammy/types";
import { Bot } from "grammy/web";
import { start } from "@/bot/command/start";
import { sticker } from "@/bot/event/sticker";
import { fetchWithRetry } from "@/utils/retry";
import { getBotToken, getNextDev } from "./env";
import pino from "./pino";

export const downloadFile = async (file: File) => {
  const token = await getBotToken();

  const res = await fetchWithRetry(
    `https://api.telegram.org/file/bot${token}/${file.file_path}`,
  );

  return Buffer.from(await res.arrayBuffer());
};

const getMe = async (token: string) => {
  const response = await fetchWithRetry(
    `https://api.telegram.org/bot${token}/getMe`,
  );

  const data: {
    ok: boolean;
    result: UserFromGetMe;
  } = await response.json();

  return data.result;
};

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
  }

  public getBot() {
    return this.bot;
  }
}

let cachedBotService: BotService;

export const getBotService = async () => {
  const isDev = await getNextDev();

  if (!isDev && cachedBotService) {
    pino.debug("use cached bot service");
    return cachedBotService;
  }

  pino.debug("create new bot service");

  const token = await getBotToken();

  cachedBotService = new BotService(token, await getMe(token));

  return cachedBotService;
};
