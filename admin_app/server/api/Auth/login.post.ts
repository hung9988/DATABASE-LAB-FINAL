import { sql } from "drizzle-orm";

import { db_admin as db } from "../../../drizzle/db";
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const user = await db.execute(
    sql.raw(
      `select * from users where email = '${body.email}' and role ='admin'`,
    ),
  );

  if (user.length === 0) {
    return { error: "Invalid credentials" };
  }
  //if (bcrypt.compareSync(body.password, String(user[0].encrypted_password)))
  if (body.password === user[0].encrypted_password) {
    delete user[0].encrypted_password;
    let user_role = user[0].role + "s";
    let user_role_id = user[0].role + "_id";

    const result = await db.transaction(async (db) => {
      const session = await db.execute(
        sql.raw(
          `INSERT INTO sessions(user_id,role) VALUES (${user[0].user_id},'${user[0].role}') RETURNING session_id;`,
        ),
      );
      await db.execute(
        sql.raw(`CALL set_user_id_and_role('${session[0].session_id}');`),
      );

      return {
        session: session[0].session_id,
        user_info: user[0],
      };
    });

    return result;
  }
});
