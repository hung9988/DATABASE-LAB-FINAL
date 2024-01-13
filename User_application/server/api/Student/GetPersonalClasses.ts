import { db_user as db } from "../../../drizzle/db";
import { sql } from "drizzle-orm";
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const session = getCookie(event, "session");
  await db.execute(sql.raw(`CALL set_user_id_and_role('${session}');`));
  await db.execute(
    sql.raw(
      `SELECT set_config('myapp.current_semester', get_current_semester(), false);`,
    ),
  );
  body.query = "%" + body.query + "%";

  const classes = await db.execute(
    sql.raw(
      `select * from classes where semester=current_setting('myapp.current_semester') and class_id in (select class_id from enrollments where student_id=current_setting('myapp.user_id')::integer)
      AND (class_id::varchar ILIKE '${body.query}'
        OR subject_id ILIKE '${body.query}')
        OFFSET ${(body.page - 1) * body.pageCount} LIMIT ${body.pageCount};`,
    ),
  );

  const totalrows = await db.execute(
    sql.raw(
      `select count(*) from classes where semester=current_setting('myapp.current_semester') and class_id in (select class_id from enrollments where student_id=current_setting('myapp.user_id')::integer);`,
    ),
  );
  return { classes, totalrows };
});
