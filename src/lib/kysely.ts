import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import { Database } from "@/schema";
import { env } from "cloudflare:workers";

let cachedKysely: Kysely<Database> | null = null;

export const getKysely = async () => {
  const dialect = new D1Dialect({ database: env.DB });

  if (cachedKysely) {
    return cachedKysely;
  }

  cachedKysely = new Kysely<Database>({ dialect });

  return cachedKysely;
};
