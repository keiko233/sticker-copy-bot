"use server";

import { KV_WEBHOOK_INITIAL_KEY } from "@/consts";
import { getKV, upsertKV } from "@/lib/kv";

export const getWebhookInitialValue = async () => {
  return await getKV(KV_WEBHOOK_INITIAL_KEY);
};

export const setWebhookInitialValue = async (value: string) => {
  await upsertKV(KV_WEBHOOK_INITIAL_KEY, value);
};
