import { db_admin as db } from "../../../drizzle/db";
import { sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  body.query = "%" + body.query + "%";
  try {
    const res = await db.execute(
      sql.raw(`select * from scholarships s join enterprises e on s.enterprise_id=e.enterprise_id and status ='unverified'
    where e.enterprise_name ILIKE '${body.query}' OFFSET ${
      (body.page - 1) * body.pageCount
    } LIMIT ${body.pageCount};
    `),
    );
    const totalrows = await db.execute(
      sql.raw(`select count(*) from scholarships s join enterprises e on s.enterprise_id=e.enterprise_id and status ='unverified'
    where e.enterprise_name ILIKE '${body.query}';
    `),
    );
    return { res, totalrows };
  } catch (err) {
    const error = err as Error;
    return { error: error.message };
  }
});
