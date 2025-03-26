import { z } from "zod";

export const SetupWebhookSchema = z.string().url().nonempty();
