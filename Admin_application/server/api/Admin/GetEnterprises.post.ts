import { db_admin as db } from "../../../drizzle/db";
import { sql } from "drizzle-orm";
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  body.query = "%" + body.query + "%";

  const subjects = await db.execute(
    sql.raw(
      `select users.*,enterprise_name,contact from enterprises join users on user_id=enterprise_id where verified=false and (enterprise_id::varchar ILIKE '${
        body.query
      }' OR enterprise_name ILIKE 
      '${body.query}')  OFFSET ${(body.page - 1) * body.pageCount} LIMIT ${
        body.pageCount
      }`,
    ),
  );

  const totalrows = await db.execute(
    sql.raw(`select count(*) from enterprises where verified=false;`),
  );

  return { subjects, totalrows };
});
