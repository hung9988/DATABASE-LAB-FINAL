import { db_admin as db } from "../../../drizzle/db";
import { sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const res = await db.execute(
      sql.raw(
        `alter table classes alter column semester set default '${body.semester}';`,
      ),
    );
    return { message: "Success" };
  } catch (err) {
    const error = err as Error;
    return { error: error.message };
  }
});
