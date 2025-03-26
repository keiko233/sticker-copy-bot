"use server";

import { revalidatePath } from "next/cache";
import { createServerAction } from "zsa";
import { getBotToken } from "@/lib/env";
import { fetchWithRetry } from "@/utils/retry";
import { setWebhookInitialValue } from "../kv";
import { SetupWebhookSchema } from "./schema";

export const setupWebhook = createServerAction()
  .input(SetupWebhookSchema)
  .handler(async ({ input: url }) => {
    const token = await getBotToken();

    const res = await fetchWithRetry(
      `https://api.telegram.org/bot${token}/setWebhook?url=${url}/api/webhook/telegram`,
    );

    if (!res.ok) {
      throw new Error(`Failed to set webhook: ${res.statusText}`);
    }

    await setWebhookInitialValue(url);

    revalidatePath("/");

    return { success: true };
  });
