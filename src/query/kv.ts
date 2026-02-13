import { KV_WEBHOOK_INITIAL_KEY } from "@/consts";
import { env } from "cloudflare:workers";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getWebhookInitialValue = createServerFn({
  method: "GET",
}).handler(async () => {
  return await env.KV.get(KV_WEBHOOK_INITIAL_KEY);
});

export const setWebhookInitialValue = createServerFn({
  method: "POST",
})
  .inputValidator(z.string())
  .handler(async ({ data }) => {
    await env.KV.put(KV_WEBHOOK_INITIAL_KEY, data);
  });
