import { db_admin as db } from "../../../drizzle/db";

import { sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    const res = await db.execute(sql.raw(`select * from tuitions`));
    return { res };
  } catch (err) {
    const error = err as Error;
    return { error: error.message };
  }
});
