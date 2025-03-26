"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";

export const getKV = async (key: string) => {
  const { env } = await getCloudflareContext({ async: true });

  return await env.KV.get(key);
};

export const upsertKV = async (key: string, value: string) => {
  const { env } = await getCloudflareContext({ async: true });

  return await env.KV.put(key, value);
};
