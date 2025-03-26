import { webhookCallback } from "grammy/web";
import { NextRequest } from "next/server";
import { getBotService } from "@/lib/bot";

export const dynamic = "force-dynamic";

export const POST = async (request: NextRequest) => {
  const { bot } = await getBotService();

  return webhookCallback(bot, "cloudflare-mod")(request);
};
