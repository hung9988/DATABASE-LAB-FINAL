import { db_admin as db } from "../../../drizzle/db";
import "../../../drizzle/schema";
import { sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    const res = await db.execute(
      sql.raw(
        `SELECT COALESCE(
            (
              SELECT is_open 
              FROM classes 
              WHERE semester = (SELECT * FROM get_current_semester() LIMIT 1) 
              LIMIT 1
            ), 
            false
          ) as is_open;`,
      ),
    );
    return { res };
  } catch (err) {
    const error = err as Error;
    return { error: error.message };
  }
});
