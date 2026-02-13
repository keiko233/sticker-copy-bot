import { z } from "zod";
import { getKysely } from "@/lib/kysely";
import { StickerSchema } from "@/schema";
import { createServerFn } from "@tanstack/react-start";

export const createSticker = createServerFn({
  method: "POST",
})
  .inputValidator(
    StickerSchema.omit({
      id: true,
      created_at: true,
      updated_at: true,
    }),
  )
  .handler(async ({ data }) => {
    const kysely = await getKysely();

    const id = crypto.randomUUID();

    return await kysely
      .insertInto("sticker")
      .values({
        id,
        ...data,
        created_at: Date.now(),
        updated_at: Date.now(),
      })
      .returning("id")
      .executeTakeFirst();
  });

export const getSticker = createServerFn({
  method: "GET",
})
  .inputValidator(z.string())
  .handler(async ({ data }) => {
    const kysely = await getKysely();

    const result = await kysely
      .selectFrom("sticker")
      .where("id", "==", data)
      .selectAll()
      .executeTakeFirst();

    return result;
  });
