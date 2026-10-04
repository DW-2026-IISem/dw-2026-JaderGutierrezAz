import { RoleUser } from "./role-user.model";
import { Role } from "../roles/role.model";
import { User } from "../users/user.model";

/**
 * Seeder de asignaciones usuario ↔ rol. admin hereda los 103 recursos de
 * ADMIN; seller hereda los 9 de RECEPCIONISTA. Idempotente.
 */
export const SEED_ROLE_USERS = [
  { username: "admin", roleName: "ADMIN" },
  { username: "seller", roleName: "RECEPCIONISTA" },
] as const;

export async function seedRoleUsers(): Promise<number> {
  let created = 0;

  for (const item of SEED_ROLE_USERS) {
    const user = await User.findOne({ where: { username: item.username } });
    const role = await Role.findOne({ where: { name: item.roleName } });

    if (!user || !role) {
      console.log(`⏭️  role_users: falta ${item.username} o ${item.roleName}, se omite`);
      continue;
    }

    const [assignment, wasCreated] = await RoleUser.findOrCreate({
      where: { user_id: user.id, role_id: role.id },
      defaults: { user_id: user.id, role_id: role.id, status: "active" },
    });

    if (wasCreated) {
      created++;
      continue;
    }
    if (assignment.status !== "active") {
      await assignment.update({ status: "active" });
    }
  }

  console.log(
    `✅ role_users: asignaciones reconciliadas (${SEED_ROLE_USERS.length}, ${created} nuevas)`
  );
  return created;
}
