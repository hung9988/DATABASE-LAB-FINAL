import { db_user as db } from "../../../drizzle/db";

import { sql } from "drizzle-orm";
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const session = getCookie(event, "session");
  await db.execute(sql.raw(`CALL set_user_id_and_role('${session}');`));

  const res = await db.transaction(async (db) => {
    await db.execute(
      sql.raw(`
    prepare create_class(integer,varchar,integer,week_days,varchar,time,time) as
    insert into classes(teacher_id,subject_id,capacity,day_of_week,location,start_time,end_time)
    values($1, $2, $3, $4, $5, $6, $7);`),
    );
    for (const element of body.data) {
      await db.execute(
        sql.raw(
          `EXECUTE create_class(current_setting('myapp.user_id')::integer,'${element.subject_id}',${element.capacity},'${element.day_of_week}','${element.location}','${element.start_time}'::time,'${element.end_time}'::time);`,
        ),
      );
    }
    await db.execute(sql.raw(`deallocate create_class;`));
    return { res: "success" };
  });
  return { res };
});
