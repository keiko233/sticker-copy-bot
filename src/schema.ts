import { z } from "zod";

export const StickerSchema = z.object({
  id: z.string(),
  uid: z.number(),
  name: z.string(),
  file_id: z.string(),
  file_size: z.number(),
  binary: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
});

export type Sticker = z.infer<typeof StickerSchema>;

// not need zod schema
export interface Database {
  sticker: Sticker;
}
