import { env } from "cloudflare:workers";

export const getBotToken = () => {
  if (!env.BOT_TOKEN) {
    throw new Error("BOT_TOKEN is required");
  }

  return env.BOT_TOKEN;
};
