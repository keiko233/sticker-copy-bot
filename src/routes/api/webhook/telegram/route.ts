import { createFileRoute } from "@tanstack/react-router";
import { getBotService } from "@/lib/telegeam";
import { webhookCallback } from "grammy/web";

export const Route = createFileRoute("/api/webhook/telegram")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { bot } = await getBotService();

        return webhookCallback(bot, "cloudflare-mod")(request);
      },
    },
  },
});
