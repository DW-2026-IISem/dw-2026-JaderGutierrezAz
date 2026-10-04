/**
 * Utilidad de SOLO DESARROLLO: emite un access token válido para un usuario
 * existente, sin pasar por POST /api/sesion/login (que llega en ISS-14/15).
 * Uso: node -r ts-node/register scripts/issue-test-token.ts <username>
 */
import dotenv from "dotenv";
import { sequelize } from "../src/database/db";
import { User } from "../src/features/auth/users/user.model";
import { signAccessToken } from "../src/shared/auth/jwt";

dotenv.config();

async function main() {
  const username = process.argv[2];
  if (!username) {
    console.error("Uso: node -r ts-node/register scripts/issue-test-token.ts <username>");
    process.exit(1);
  }

  const user = await User.findOne({ where: { username } });
  if (!user) {
    console.error(`Usuario "${username}" no encontrado`);
    process.exit(1);
  }

  const { token } = signAccessToken({ id: user.id, username: user.username });
  console.log(token);
  await sequelize.close();
}

main();
