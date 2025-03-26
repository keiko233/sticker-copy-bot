"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";

export const getBotToken = async () => {
  const { env } = await getCloudflareContext({ async: true });

  if (!env.BOT_TOKEN) {
    throw new Error("BOT_TOKEN is required");
  }

  return env.BOT_TOKEN;
};

export const getNextDev = async () => {
  const { env } = await getCloudflareContext({ async: true });

  if (String(env.NEXTJS_ENV).toLocaleLowerCase() === "development") {
    return true;
  } else {
    return false;
  }
};
