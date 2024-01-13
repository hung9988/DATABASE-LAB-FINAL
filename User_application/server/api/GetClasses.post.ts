import { db_user as db } from "../../drizzle/db";

import { sql } from "drizzle-orm";
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const session = getCookie(event, "session");
  await db.execute(sql.raw(`CALL set_user_id_and_role('${session}');`));
  body.query = "%" + body.query + "%";
  await db.execute(
    sql.raw(
      `SELECT set_config('myapp.current_semester', get_current_semester(), false);`,
    ),
  );
  const classes = await db.execute(
    sql.raw(
      `select * from classes join users
      on classes.teacher_id = users.user_id
      where
        subject_id in (select subject_id
        from
          subjects_programs
        where
          program_id = (
            select program_id from students WHERE
            student_id =current_setting('myapp.user_id')::integer LIMIT 1
          )
        )
        AND semester = current_setting('myapp.current_semester')
        AND is_open='true'
        AND (class_id::varchar ILIKE '${body.query}'
        OR subject_id ILIKE '${body.query}')
         OFFSET ${(body.page - 1) * body.pageCount}
      LIMIT
        ${body.pageCount}`,
    ),
  );
  classes.forEach((element) => {
    element.full_name = element.last_name + " " + element.first_name;
    element.enrolled = element.enrolled_count + "/" + element.capacity;
  });

  // WORK IN PROGRESS
  const totalrows = await db.execute(
    sql.raw(`select count(*) from classes join users
    on classes.teacher_id= users.user_id
    where  is_open='true' AND semester = current_setting('myapp.current_semester') AND
      subject_id in (select subject_id
      from
        subjects_programs
      where
        program_id = (
          select program_id from students WHERE
          student_id =current_setting('myapp.user_id')::integer LIMIT 1
        )
      )`),
  );
  return { classes, totalrows };
});
