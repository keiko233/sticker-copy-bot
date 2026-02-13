import { getBotToken } from "@/lib/env";
import { setWebhookInitialValue } from "@/query/kv";
import { fetchWithRetry } from "@/utils/retry";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ENDPOINT_URL = "/api/webhook/telegram";

export const setTelegramWebhook = createServerFn({
  method: "POST",
})
  .inputValidator(z.url())
  .handler(async ({ data }) => {
    const token = getBotToken();

    const res = await fetchWithRetry(
      `https://api.telegram.org/bot${token}/setWebhook?url=${data}${ENDPOINT_URL}`,
    );

    if (!res.ok) {
      throw new Error(`Failed to set webhook: ${res.statusText}`);
    }

    await setWebhookInitialValue({
      data: data.toString(),
    });
  });
