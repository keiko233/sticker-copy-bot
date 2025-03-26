"use server";

import { z } from "zod";
import { createServerAction } from "zsa";
import { getKysely } from "@/lib/kysely";
import { StickerSchema } from "@/schema";

export const createSticker = createServerAction()
  .input(
    StickerSchema.omit({
      id: true,
      created_at: true,
      updated_at: true,
    }),
  )
  .handler(async ({ input }) => {
    const kysely = await getKysely();

    const id = crypto.randomUUID();

    return await kysely
      .insertInto("sticker")
      .values({
        id,
        ...input,
        created_at: Date.now(),
        updated_at: Date.now(),
      })
      .returning("id")
      .executeTakeFirst();
  });

export const getSticker = createServerAction()
  .input(z.string())
  .handler(async ({ input }) => {
    const kysely = await getKysely();

    const result = await kysely
      .selectFrom("sticker")
      .where("id", "==", input)
      .selectAll()
      .executeTakeFirst();

    return result;
  });
