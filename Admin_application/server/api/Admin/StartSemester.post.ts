import { db_admin as db } from "../../../drizzle/db";
import { sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    const res = await db.execute(sql.raw(`CALL start_semester();`));
    return { res };
  } catch (err) {
    const error = err as Error;
    return { error: error.message };
  }
});
