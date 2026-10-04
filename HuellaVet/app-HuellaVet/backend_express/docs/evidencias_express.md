# **Archivo Evidencia Manual Backend Express**

**Nombre:** Jader Gutiérrez Areiza

**Asignatura:** Desarrollo Web

**Docente:** Jaider Quintero

Programa Ingeniería en Sistemas - Octavo Semestre

Universidad de La Guajira

# 1. ISS-00 — Requisitos previos

```         
node -v
npm -v
```

### Verificación

![](images/clipboard-1797685713.png)

# 2. ISS-01 — Esqueleto express Arrancable

## 2.1 Inicializar npm y scripts

```         
mkdir backend_expres
cd backend_express
npm init -y
mkdir -p docs
```

![](images/clipboard-1018530540.png)

## 2.2 Estructura de carpetas (features)

```         
mkdir -p \
  src/config \
  src/database/seeders \
  src/routes \
  src/features/business/client
```

![](images/clipboard-1689050328.png)

## 2.3 Dependencias base (Express + TypeScript)

```         
npm install express@^5.2.1 cors@^2.8.6 dotenv@^17.4.2 morgan@^1.12.1

npm install -D typescript@~5.9.2 ts-node@^10.9.2 nodemon@^3.1.14 \
  @types/node@^22.20.3 @types/express@^5.0.6 \
  @types/cors@^2.8.19 @types/morgan@^1.9.10
```

![](images/clipboard-3704153351.png)

```         
npm ls --depth=0
```

![](images/clipboard-3925105098.png)

## 2.4 TypeScript (`tsconfig.json`)

```         
: > tsconfig.json
cat >> tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "module": "commonjs",
    "target": "ES2020",
    "lib": ["ES2020"],
    "types": ["node"],
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "sourceMap": true,
    "strict": true,
    "skipLibCheck": true,
    "moduleDetection": "force",
    "isolatedModules": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF
```

![](images/clipboard-2077984614.png)

## 2.5 Servidor y App (esqueleto HTTP)

### 2.5.1 `src/server.ts`

```         
: > src/server.ts
cat >> src/server.ts << 'EOF'
import { App } from './config/index';

async function main() {
    const app = new App();
    await app.listen();
}

main();
EOF
```

![](images/clipboard-1226400142.png)

### 2.5.2 `src/config/index.ts` (esqueleto)

```         
: > src/config/index.ts
cat >> src/config/index.ts << 'EOF'
import dotenv from "dotenv";
import express, { Application } from "express";
import morgan from "morgan";
var cors = require("cors");

dotenv.config();

export class App {
  public app: Application;

  constructor(private port?: number | string) {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
    this.dbConnection();
  }

  private settings(): void {
    this.app.set('port', this.port || process.env.PORT || 4000);
  }

  private middlewares(): void {
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private routes(): void {
    // ISS-03 §4.3
  }

  private async dbConnection(): Promise<void> {
    // ISS-02 / ISS-03
  }

  async listen() {
    await this.app.listen(this.app.get('port'));
    console.log(`🚀 Servidor ejecutándose en puerto ${this.app.get('port')}`);
  }
}
EOF
```

![](images/clipboard-2671787410.png)

### Verificación del ISS-01

```         
npx tsc --noEmit
find src -type f | sort
```

![](images/clipboard-3483115887.png)

### Cierre del ISSUE-01

``` bash
npm run dev
```

![](images/clipboard-1340656068.png)

# 3. ISS-02 — Infraestructura de base de datos

## 3.1 Drivers Sequelize y `.env`

```         
npm install sequelize@^6.37.8 mysql2@^3.24.4 pg@^8.23.0 pg-hstore@^2.3.4 \
  tedious@^20.0.0 oracledb@^7.0.1
npm install -D @types/sequelize@^6.12.0
```

![](images/clipboard-576636262.png)

```         
: > .env
cat >> .env << 'EOF'
PORT=4000

# Variable para seleccionar el motor de base de datos
DB_ENGINE=mysql

# Configuración para MySQL
MYSQL_HOST=localhost
MYSQL_USER=admin
MYSQL_PASSWORD=MiNiCo57**
MYSQL_NAME=tecnogua
MYSQL_PORT=3306

# Configuración para PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_NAME=almacen_2025_iisem_node
POSTGRES_PORT=5432

# Configuración para SQL Server
MSSQL_HOST=localhost
MSSQL_USER=sa
MSSQL_PASSWORD=password
MSSQL_NAME=almacen_2025_iisem_node
MSSQL_PORT=1433

# Configuración para Oracle
ORACLE_HOST=localhost
ORACLE_USER=ALMACENDB_ADMIN
ORACLE_PASSWORD=password
ORACLE_NAME=xe
ORACLE_PORT=1521

EOF
```

![](images/clipboard-3961495472.png)

```         
test -f .env && grep DB_ENGINE .env
npm ls sequelize mysql2 --depth=0
```

![](images/clipboard-4224675796.png)

## 3.2 Configuración Sequelize (`database/db.ts`)

```         
: > src/database/db.ts
cat >> src/database/db.ts << 'EOF'
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

interface DatabaseConfig {
  dialect: string;
  host: string;
  username: string;
  password: string;
  database: string;
  port: number;
}

const dbConfigurations: Record<string, DatabaseConfig> = {
  mysql: {
    dialect: "mysql",
    host: process.env.MYSQL_HOST || "localhost",
    username: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_NAME || "test",
    port: parseInt(process.env.MYSQL_PORT || "3306")
  },
  postgres: {
    dialect: "postgres",
    host: process.env.POSTGRES_HOST || "localhost",
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "",
    database: process.env.POSTGRES_NAME || "test",
    port: parseInt(process.env.POSTGRES_PORT || "5432")
  }
};

const selectedEngine = process.env.DB_ENGINE || "mysql";
const selectedConfig = dbConfigurations[selectedEngine];

if (!selectedConfig) {
  throw new Error(`Motor de base de datos no soportado: ${selectedEngine}`);
}

console.log(`🔌 Conectando a base de datos: ${selectedEngine.toUpperCase()}`);

export const sequelize = new Sequelize(
  selectedConfig.database,
  selectedConfig.username,
  selectedConfig.password,
  {
    host: selectedConfig.host,
    port: selectedConfig.port,
    dialect: selectedConfig.dialect as any,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export const getDatabaseInfo = () => {
  return {
    engine: selectedEngine,
    config: selectedConfig,
    connectionString: `${selectedConfig.dialect}://${selectedConfig.username}@${selectedConfig.host}:${selectedConfig.port}/${selectedConfig.database}`
  };
};

export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Conexión exitosa a ${selectedEngine.toUpperCase()}`);
    return true;
  } catch (error) {
    console.error(`❌ Error de conexión a ${selectedEngine.toUpperCase()}:`, error);
    return false;
  }
};
EOF
```

![](images/clipboard-1036046033.png)

## 3.3 Carpeta seeders (reservada)

```         
mkdir -p src/database/seeders
# opcional: touch src/database/seeders/.gitkeep
```

![](images/clipboard-1581497702.png)

### Verificación del ISS-02

```         
npx tsc --noEmit
test -f src/database/db.ts && test -f .env && test -d src/database/seeders
```

### Cierre del ISSUE-02

``` bash
npm run dev
```

![](images/clipboard-1136565286.png)

# 4. ISS-03-A — Feature Owner — (modelo, esqueleto, HTTP, cableado)

## 4.1 Modelo Owner

```         
: > src/features/business/client/client.model.ts
cat >> src/features/business/client/client.model.ts << 'EOF'
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";
import bcrypt from "bcryptjs";

export interface ClientI {
  id?: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Client extends Model {
  public id!: number;
  public name!: string;
  public address!: string;
  public phone!: string;
  public email!: string;
  public password!: string;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Client.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: { msg: "Phone cannot be empty" },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: { msg: "Email must be a valid email address" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "inactive",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Client",
    tableName: "clients",
    timestamps: true,
    hooks: {
      beforeCreate: async (client: Client) => {
        if (client.password) {
          const salt = await bcrypt.genSalt(10);
          client.password = await bcrypt.hash(client.password, salt);
        }
      },
      beforeUpdate: async (client: Client) => {
        if (client.changed("password") && client.password) {
          const salt = await bcrypt.genSalt(10);
          client.password = await bcrypt.hash(client.password, salt);
        }
      },
      beforeBulkCreate: async (clients: Client[]) => {
        for (const client of clients) {
          if (client.password) {
            const salt = await bcrypt.genSalt(10);
            client.password = await bcrypt.hash(client.password, salt);
          }
        }
      },
    },
  }
);
EOF
```

![](images/clipboard-841696338.png)

## 4.2 Esqueleto controller / routes + carpeta HTTP

```         
: > src/features/business/client/client.controller.ts
cat >> src/features/business/client/client.controller.ts << 'EOF'
import { Request, Response } from "express";
import { Client, ClientI } from "./client.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class ClientController {
  // ================== READ ==================
  // (rellenar en ISS-03-B) getAll, luego getOne

  // ================== CREATE ==================
  // (rellenar en ISS-03-C)

  // ================== UPDATE ==================
  // (rellenar en ISS-03-D)

  // ================== DELETE ==================
  // (rellenar en ISS-03-E)
}
EOF
```

![](images/clipboard-1447651348.png)

```         
: > src/features/business/client/client.routes.ts
cat >> src/features/business/client/client.routes.ts << 'EOF'
import { Application } from "express";
import { ClientController } from "./client.controller";

export class ClientRoutes {
  public clientController: ClientController = new ClientController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================
    // (rellenar en ISS-03-B…E)
  }
}
EOF
```

![](images/clipboard-826932618.png)

## 4.3 Agregador Routes + cableado en Config

```         
: > src/routes/index.ts
cat >> src/routes/index.ts << 'EOF'
import { ClientRoutes } from "../features/business/client/client.routes";

export class Routes {
  public clientRoutes: ClientRoutes = new ClientRoutes();
}
EOF
```

![](images/clipboard-1225914407.png)

**PARCHE** — `src/config/index.ts` **ya existe**.

![](images/clipboard-2548506739.png)

### Verificación ISS-03-A

``` bash
test -d src/features/business/client/http && echo HTTP_FOLDER_OK
```

![](images/clipboard-3549479573.png)

### Cierre del ISSUE-03-A

``` bash
npm run dev
```

![](images/clipboard-3339490355.png)

# 5. ISS-03-B — Feature Owner — GetAll y GetOne

### Controller — PARCHE `owner.controller.ts`

![](images/clipboard-3017911602.png)

### Rutas — PARCHE `owner.routes.ts`

![](images/clipboard-3041779782.png)

### HTTP — archivo nuevo

![](images/clipboard-513228882.png)

### Verificación

``` bash
curl -s http://localhost:4000/api/clientes curl -s http://localhost:4000/api/clientes/1
```

### Cierre del ISSUE-03-B

``` bash
npm run dev
```

![![](images/clipboard-3210174298.png)](images/clipboard-1793068076.png)

# 6.ISS-03-C — Feature Owner: Crear owner

### Controller — PARCHE `owner.controller.ts`

![](images/clipboard-1583207536.png)

### Rutas — PARCHE `owner.routes.ts`

![](images/clipboard-1773697102.png)

### HTTP — archivo nuevo

![](images/clipboard-551017914.png)

### Verificación

``` bash
curl -s -X POST http://localhost:4000/api/clientes \   -H 'Content-Type: application/json' \   -d '{"name":"Ana","phone":"3001","email":"ana@test.com","password":"Password123!","status":"active"}'
```

![](images/clipboard-637351897.png)

### Cierre del ISSUE-03-C

```         
npm run dev
```

![](images/clipboard-1596052749.png)

# 7.ISS-03-D — Feature Owner: Update (PUT) y Update (PATCH)

### Controller — PARCHE `owner.controller.ts`

![](images/clipboard-944469270.png)

### Rutas — PARCHE `owner.routes.ts`

![](images/clipboard-2849181225.png)

### HTTP — archivo nuevo

![](images/clipboard-694287840.png)

### Verificación

``` bash
curl -s -X PUT http://localhost:4000/api/clientes/1 -H 'Content-Type: application/json' \   -d '{"name":"Ana","address":"x","phone":"300","email":"ana@test.com","status":"active"}' curl -s -X PATCH http://localhost:4000/api/clientes/1 -H 'Content-Type: application/json' \   -d '{"phone":"301"}'
```

### Cierre del ISSUE-03-D

``` bash
npm run dev
```

![](images/clipboard-2140658122.png)

![](images/clipboard-496898790.png)

# 8.ISS-03-E — Feature Owner: Eliminar (físico y lógico)

### Controller — PARCHE `owner.controller.ts`

![](images/clipboard-567753139.png)

### Rutas — PARCHE `owner.routes.ts`

![](images/clipboard-315368981.png)

### HTTP — archivo nuevo

![](images/clipboard-1466507612.png)

### Verificación

### ![](images/clipboard-1012446475.png)

### Cierre del ISSUE-03-E

![](images/clipboard-2381866197.png)

# 9. ISS-04 – Owner – Seeders con Faker (feature + runner externo)

```         
npm install -D @faker-js/faker@^10.6.0
```

![](images/clipboard-3759199174.png)

```         
: > src/features/business/client/client.seeder.ts
cat >> src/features/business/client/client.seeder.ts << 'EOF'
import { faker } from "@faker-js/faker";
import { Client } from "./client.model";

/**
 * Seeder del feature Client (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedClients(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  clients: count=0, se omite");
    return 0;
  }

  const existing = await Client.count();
  if (existing > 0) {
    console.log(`⏭️  clients: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const rows = Array.from({ length: count }, (_, i) => ({
    name: faker.person.fullName(),
    address: faker.location.streetAddress(),
    phone: faker.phone.number({ style: "national" }),
    email: `client.${i}.${faker.string.alphanumeric(6)}@example.com`.toLowerCase(),
    password: "Password123!",
    status: "active" as const,
  }));

  await Client.bulkCreate(rows);
  console.log(`✅ clients: insertados ${count} registro(s) falsos`);
  return count;
}
EOF
```

![](images/clipboard-182988246.png)

## 9.2 3. Conteos (`database/seeders/counts.ts`)

```         
: > src/database/seeders/counts.ts
cat >> src/database/seeders/counts.ts << 'EOF'
/**
 * Cantidad de registros por feature/entidad.
 * Prioridad: CLI (--clients=N) > env (SEED_CLIENTS) > default de este archivo.
 *
 * Cuando agregues features, suma aquí la clave y léela en el runner.
 */
export type SeedCounts = {
  clients: number;
  // users?: number;
  // roles?: number;
  // products?: number;
};

export const DEFAULT_SEED_COUNTS: SeedCounts = {
  clients: 10,
};

export function resolveSeedCounts(argv: string[] = process.argv.slice(2)): SeedCounts {
  const counts: SeedCounts = { ...DEFAULT_SEED_COUNTS };

  const envClients = process.env.SEED_CLIENTS;
  if (envClients !== undefined && envClients !== "") {
    counts.clients = Number(envClients);
  }

  for (const arg of argv) {
    const m = arg.match(/^--([a-zA-Z_]+)=(\d+)$/);
    if (!m) continue;
    const key = m[1] as keyof SeedCounts;
    const value = Number(m[2]);
    if (key in counts) {
      counts[key] = value;
    }
  }

  return counts;
}
EOF
```

![](images/clipboard-2525926667.png)

### 9.2.2 Runner (`database/seeders/index.ts`)

```         
: > src/database/seeders/index.ts
cat >> src/database/seeders/index.ts << 'EOF'
import dotenv from "dotenv";
import { sequelize, testConnection } from "../db";
import "../../features/business/client/client.model";
import { seedClients } from "../../features/business/client/client.seeder";
import { resolveSeedCounts } from "./counts";

dotenv.config();

/**
 * SeedersRunner — ejecuta TODOS los seeders de features.
 *
 * Ubicación: `src/database/seeders/` (orquestación fuera de cada feature).
 * Cada feature exporta su seeder (ej. `features/business/client/client.seeder.ts`).
 *
 * Uso:
 *   npm run db:seed
 *   npm run db:seed -- --clients=20
 *   SEED_CLIENTS=5 npm run db:seed
 */
export async function runAllSeeders(): Promise<void> {
  const counts = resolveSeedCounts();
  console.log("🌱 Iniciando SeedersRunner...");
  console.log("📊 Conteos:", counts);

  const ok = await testConnection();
  if (!ok) {
    throw new Error("No hay conexión a la base de datos");
  }

  await sequelize.sync({ force: false, alter: true });

  // Orden: business (padres → hijos)
  await seedClients(counts.clients);

  console.log("🌱 SeedersRunner finalizado");
}

if (require.main === module) {
  runAllSeeders()
    .then(async () => {
      await sequelize.close();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("❌ Error en seeders:", err);
      await sequelize.close();
      process.exit(1);
    });
}
EOF
```

![](images/clipboard-2988760347.png)

**PARCHE** — `package.json` **ya existe**.

![](images/clipboard-1928459067.png)

### Verificación ISS-04

```         
npm run db:seed
npm run db:seed -- --clients=20
SEED_CLIENTS=5 npm run db:seed
```

![](images/clipboard-1430647271.png)

### Cierre del ISS

```         
npm run dev
```

![](images/clipboard-2342845865.png)

# 10. ISS-05 – Owner Swagger / OpenAPI (feature + registry externo)

## 10.1 OpenAPI dentro del feature Owner

```         
# Paquetes (una vez)
npm install swagger-ui-express@^5.0.1
npm install -D @types/swagger-ui-express@^4.1.8
```

![Archivo **nuevo**:](images/clipboard-3954218116.png)

```         
: > src/features/business/client/client.swagger.ts
cat >> src/features/business/client/client.swagger.ts << 'EOF'
/**
 * Documentación OpenAPI del feature Client.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const clientSwagger = {
  tags: [
    {
      name: "Clientes",
      description: "CRUD de clientes — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/clientes": {
      get: {
        tags: ["Clientes"],
        summary: "Listar clientes activos",
        description: "SIN AUTH — retorna clientes con status=active (sin password)",
        security: [],
        responses: {
          "200": {
            description: "Lista de clientes",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    clients: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Client" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Clientes"],
        summary: "Crear cliente",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ClientCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Cliente creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    client: { $ref: "#/components/schemas/Client" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/clientes/{id}": {
      get: {
        tags: ["Clientes"],
        summary: "Obtener cliente por id",
        description: "SIN AUTH",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Cliente encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    client: { $ref: "#/components/schemas/Client" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Clientes"],
        summary: "Actualizar cliente (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ClientUpdate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Clientes"],
        summary: "Actualizar cliente (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ClientPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Clientes"],
        summary: "Eliminar cliente (físico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/clientes/{id}/deactivate": {
      patch: {
        tags: ["Clientes"],
        summary: "Eliminar cliente (lógico)",
        description: "SIN AUTH — status = inactive",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Desactivado" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      Client: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Ana Pérez" },
          address: { type: "string", example: "Calle 10 #20-30" },
          phone: { type: "string", example: "3001234567" },
          email: { type: "string", format: "email", example: "ana@example.com" },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ClientCreate: {
        type: "object",
        required: ["name", "phone", "email", "password"],
        properties: {
          name: { type: "string" },
          address: { type: "string" },
          phone: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      ClientUpdate: {
        type: "object",
        required: ["name", "phone", "email"],
        properties: {
          name: { type: "string" },
          address: { type: "string" },
          phone: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      ClientPatch: {
        type: "object",
        properties: {
          name: { type: "string" },
          address: { type: "string" },
          phone: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
EOF
```

![](images/clipboard-2829511213.png)

## 10.2 Registry externo + montaje en Config

```         
: > src/swagger/index.ts
cat >> src/swagger/index.ts << 'EOF'
import { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { clientSwagger } from "../features/business/client/client.swagger";

export type FeatureSwaggerModule = {
  tags: unknown[];
  paths: Record<string, unknown>;
  components?: { schemas?: Record<string, unknown> };
};

/**
 * Registry externo: importa la documentación OpenAPI de cada feature
 * (mismo patrón que SeedersRunner).
 */
const featureSwaggerModules: FeatureSwaggerModule[] = [
  clientSwagger,
  // productSwagger,
  // userSwagger,
];

export function buildOpenApiDocument() {
  const tags: unknown[] = [];
  const paths: Record<string, unknown> = {};
  const schemas: Record<string, unknown> = {};

  for (const mod of featureSwaggerModules) {
    tags.push(...mod.tags);
    Object.assign(paths, mod.paths);
    if (mod.components?.schemas) {
      Object.assign(schemas, mod.components.schemas);
    }
  }

  return {
    openapi: "3.0.3",
    info: {
      title: "StoreLab API",
      version: "1.0.0",
      description:
        "API StoreLab (Express + Sequelize). Los endpoints de Client están documentados como **SIN AUTH** Todas las rutas business son **SIN AUTH** en este lab.",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4000}`,
        description: "Local",
      },
    ],
    tags,
    paths,
    components: { schemas },
  };
}

/** Monta Swagger UI y el JSON OpenAPI */
export function setupSwagger(app: Application): void {
  const document = buildOpenApiDocument();
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(document));
  app.get("/api/docs.json", (_req, res) => {
    res.json(document);
  });
  console.log("📘 Swagger UI: /api/docs  |  OpenAPI JSON: /api/docs.json");
}
EOF
```

![](images/clipboard-1991843900.png)

**PARCHE** — `src/config/index.ts` **ya existe**.

![](images/clipboard-3085958646.png)

### Verificación ISS-05

```         
curl -s http://localhost:4000/api/docs.json | head
```

![](images/clipboard-492134150.png)

### Cierre del ISS

``` bash
npm run dev
```

![![](images/clipboard-205691737.png)](images/clipboard-993005702.png)

# 11. ISS-06 — Feature PET (Mascotas)

## 11.1 Modelo Pet

```         
: > src/features/business/product-type/product-type.model.ts
cat >> src/features/business/product-type/product-type.model.ts << 'EOF'
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface ProductTypeI {
  id?: number;
  name: string;
  description?: string | null;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class ProductType extends Model {
  public id!: number;
  public name!: string;
  public description!: string | null;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProductType.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "inactive",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ProductType",
    tableName: "product_types",
    timestamps: true,
  }
);
EOF
```

![](images/clipboard-2074010209.png)

## 11.2 Controller + routes (CRUD completo)

```         
: > src/features/business/product-type/product-type.controller.ts
cat >> src/features/business/product-type/product-type.controller.ts << 'EOF'
import { Request, Response } from "express";
import { ProductType, ProductTypeI } from "./product-type.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class ProductTypeController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const product_types = await ProductType.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ product_types });
    } catch (error) {
      res.status(500).json({ error: "Error fetching product types", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const product_type = await ProductType.findByPk(id);
      if (!product_type) {
        res.status(404).json({ error: "Product type not found" });
        return;
      }
      res.status(200).json({ product_type });
    } catch (error) {
      res.status(500).json({ error: "Error fetching product type", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as ProductTypeI;
      const product_type = await ProductType.create({
        name: body.name,
        description: body.description ?? null,
        status: body.status ?? "active",
      });
      res.status(201).json({ product_type });
    } catch (error) {
      res.status(500).json({ error: "Error creating product type", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as ProductTypeI;
      const product_type = await ProductType.findByPk(id);
      if (!product_type) {
        res.status(404).json({ error: "Product type not found" });
        return;
      }

      await product_type.update({
        name: body.name,
        description: body.description ?? null,
        status: body.status ?? product_type.status,
      });

      res.status(200).json({ product_type });
    } catch (error) {
      res.status(500).json({ error: "Error updating product type (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<ProductTypeI>;
      const product_type = await ProductType.findByPk(id);
      if (!product_type) {
        res.status(404).json({ error: "Product type not found" });
        return;
      }

      await product_type.update(body);
      res.status(200).json({ product_type });
    } catch (error) {
      res.status(500).json({ error: "Error updating product type (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const product_type = await ProductType.findByPk(id);
      if (!product_type) {
        res.status(404).json({ error: "Product type not found" });
        return;
      }
      await product_type.destroy();
      res.status(200).json({ message: "Product type permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting product type", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const product_type = await ProductType.findByPk(id);
      if (!product_type) {
        res.status(404).json({ error: "Product type not found" });
        return;
      }
      await product_type.update({ status: "inactive" });
      res.status(200).json({
        message: "Product type deactivated (logical delete)",
        product_type,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating product type", detail: String(error) });
    }
  }
}
EOF
```

![](images/clipboard-1423733068.png)

```         
: > src/features/business/product-type/product-type.routes.ts
cat >> src/features/business/product-type/product-type.routes.ts << 'EOF'
import { Application } from "express";
import { ProductTypeController } from "./product-type.controller";

export class ProductTypeRoutes {
  public productTypeController: ProductTypeController = new ProductTypeController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/tipos-producto")
      .get(this.productTypeController.getAll.bind(this.productTypeController));

    // getOne
    app
      .route("/api/tipos-producto/:id")
      .get(this.productTypeController.getOne.bind(this.productTypeController));

    // create
    app
      .route("/api/tipos-producto")
      .post(this.productTypeController.create.bind(this.productTypeController));

    // update (PUT / PATCH)
    app
      .route("/api/tipos-producto/:id")
      .put(this.productTypeController.updatePut.bind(this.productTypeController))
      .patch(this.productTypeController.updatePatch.bind(this.productTypeController));

    // delete físico
    app
      .route("/api/tipos-producto/:id")
      .delete(this.productTypeController.deletePhysical.bind(this.productTypeController));

    // delete lógico
    app
      .route("/api/tipos-producto/:id/deactivate")
      .patch(this.productTypeController.deleteLogical.bind(this.productTypeController));
  }
}
EOF
```

![](images/clipboard-3288167326.png)

## 11.3 HTTP (REST Client)

```         
: > src/features/business/product-type/http/product-types.get.http
cat >> src/features/business/product-type/http/product-types.get.http << 'EOF'
### Feature ProductType — GET ALL / GET ONE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name getAllProductTypes
GET {{baseUrl}}/api/tipos-producto

###

# @name getOneProductType
GET {{baseUrl}}/api/tipos-producto/{{id}}
EOF
```

![](images/clipboard-391473640.png)

```         
: > src/features/business/product-type/http/product-types.create.http
cat >> src/features/business/product-type/http/product-types.create.http << 'EOF'
### Feature ProductType — CREATE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000

# @name createProductType
POST {{baseUrl}}/api/tipos-producto
Content-Type: application/json

{
  "name": "Electrónica",
  "description": "Dispositivos y accesorios",
  "status": "active"
}
EOF
```

![](images/clipboard-3622249799.png)

```         
: > src/features/business/product-type/http/product-types.update.http
cat >> src/features/business/product-type/http/product-types.update.http << 'EOF'
### Feature ProductType — UPDATE (PUT) / UPDATE (PATCH)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name updateProductTypePut
PUT {{baseUrl}}/api/tipos-producto/{{id}}
Content-Type: application/json

{
  "name": "Electrónica Actualizada",
  "description": "Categoría renovada",
  "status": "active"
}

###

# @name updateProductTypePatch
PATCH {{baseUrl}}/api/tipos-producto/{{id}}
Content-Type: application/json

{
  "description": "Descripción parcial"
}
EOF
```

![](images/clipboard-856011500.png)

```         
: > src/features/business/product-type/http/product-types.delete.http
cat >> src/features/business/product-type/http/product-types.delete.http << 'EOF'
### Feature ProductType — DELETE físico / DELETE lógico (status = inactive)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name deleteProductTypePhysical
DELETE {{baseUrl}}/api/tipos-producto/{{id}}

###

# @name deleteProductTypeLogical
PATCH {{baseUrl}}/api/tipos-producto/{{id}}/deactivate
EOF
```

![](images/clipboard-2863253607.png)

## 11.4 Cableado Routes + Config

**PARCHE** — `src/routes/index.ts` **ya existe**.

![](images/clipboard-581864163.png)

**PARCHE** — `src/config/index.ts` **ya existe**.

![](images/clipboard-3669661748.png)

### Verificación

```         
curl -s -X POST http://localhost:4000/api/tipos-producto -H 'Content-Type: application/json' \
  -d '{"name":"Bebidas","description":"Refrescos","status":"active"}'
curl -s http://localhost:4000/api/tipos-producto
```

![](images/clipboard-3064446110.png)

## 11.5 Seeder ProductType

```         
: > src/features/business/product-type/product-type.seeder.ts
cat >> src/features/business/product-type/product-type.seeder.ts << 'EOF'
import { faker } from "@faker-js/faker";
import { ProductType } from "./product-type.model";

/**
 * Seeder del feature ProductType (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedProductTypes(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  product_types: count=0, se omite");
    return 0;
  }

  const existing = await ProductType.count();
  if (existing > 0) {
    console.log(`⏭️  product_types: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const rows = Array.from({ length: count }, () => ({
    name: faker.commerce.department(),
    description: faker.commerce.productDescription(),
    status: "active" as const,
  }));

  await ProductType.bulkCreate(rows);
  console.log(`✅ product_types: insertados ${count} registro(s) falsos`);
  return count;
}
EOF
```

![](images/clipboard-1520149676.png)

**PARCHE** — `src/database/seeders/counts.ts` **ya existe**.

![](images/clipboard-1993536771.png)

**PARCHE** — `src/database/seeders/index.ts` **ya existe**.

![](images/clipboard-3235338249.png)

## 11.6 Swagger Pet

```         
: > src/features/business/product-type/product-type.swagger.ts
cat >> src/features/business/product-type/product-type.swagger.ts << 'EOF'
/**
 * Documentación OpenAPI del feature ProductType.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const productTypeSwagger = {
  tags: [
    {
      name: "TiposProducto",
      description: "CRUD de tipos de producto — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/tipos-producto": {
      get: {
        tags: ["TiposProducto"],
        summary: "Listar tipos de producto activos",
        description: "SIN AUTH — retorna tipos con status=active",
        security: [],
        responses: {
          "200": {
            description: "Lista de tipos de producto",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    product_types: {
                      type: "array",
                      items: { $ref: "#/components/schemas/ProductType" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["TiposProducto"],
        summary: "Crear tipo de producto",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductTypeCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Tipo de producto creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    product_type: { $ref: "#/components/schemas/ProductType" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/tipos-producto/{id}": {
      get: {
        tags: ["TiposProducto"],
        summary: "Obtener tipo de producto por id",
        description: "SIN AUTH",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Tipo de producto encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    product_type: { $ref: "#/components/schemas/ProductType" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["TiposProducto"],
        summary: "Actualizar tipo de producto (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductTypeUpdate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["TiposProducto"],
        summary: "Actualizar tipo de producto (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductTypePatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["TiposProducto"],
        summary: "Eliminar tipo de producto (físico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/tipos-producto/{id}/deactivate": {
      patch: {
        tags: ["TiposProducto"],
        summary: "Eliminar tipo de producto (lógico)",
        description: "SIN AUTH — status = inactive",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Desactivado" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      ProductType: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Electrónica" },
          description: { type: "string", example: "Dispositivos y accesorios", nullable: true },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ProductTypeCreate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      ProductTypeUpdate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      ProductTypePatch: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
EOF
```

![](images/clipboard-1214040465.png)

**PARCHE** — `src/swagger/index.ts` **ya existe**.

![](images/clipboard-1066656441.png)

### Cierre del ISSUE-06

```         
npm run dev
```

![![](images/clipboard-3501485980.png)](images/clipboard-2516005899.png)

# 12. ISS-07 — Feature Veterinarian (veterinarios)

## 12.1 Modelo veterinarian

```         
: > src/features/business/product/product.model.ts
cat >> src/features/business/product/product.model.ts << 'EOF'
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface ProductI {
  id?: number;
  name: string;
  brand: string;
  price: number;
  min_stock: number;
  quantity: number;
  product_type_id: number;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product extends Model {
  public id!: number;
  public name!: string;
  public brand!: string;
  public price!: number;
  public min_stock!: number;
  public quantity!: number;
  public product_type_id!: number;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    min_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    product_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "inactive",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: true,
  }
);
EOF
```

![](images/clipboard-1033887262.png)

## 12.2 Controller + routes (CRUD completo)

``` bash
: > src/features/business/product/product.controller.ts
cat >> src/features/business/product/product.controller.ts << 'EOF'
import { Request, Response } from "express";
import { Product, ProductI } from "./product.model";
import { ProductType } from "../product-type/product-type.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

async function assertActiveProductType(product_type_id: number): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const productType = await ProductType.findByPk(product_type_id);
  if (!productType) {
    return { ok: false, status: 404, error: "Product type not found" };
  }
  if (productType.status !== "active") {
    return { ok: false, status: 400, error: "Product type must be active" };
  }
  return { ok: true };
}

export class ProductController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const products = await Product.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ error: "Error fetching products", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const product = await Product.findByPk(id);
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      res.status(200).json({ product });
    } catch (error) {
      res.status(500).json({ error: "Error fetching product", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as ProductI;
      const check = await assertActiveProductType(Number(body.product_type_id));
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      const product = await Product.create({
        name: body.name,
        brand: body.brand,
        price: body.price,
        min_stock: body.min_stock,
        quantity: body.quantity,
        product_type_id: body.product_type_id,
        status: body.status ?? "active",
      });
      res.status(201).json({ product });
    } catch (error) {
      res.status(500).json({ error: "Error creating product", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as ProductI;
      const product = await Product.findByPk(id);
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      const check = await assertActiveProductType(Number(body.product_type_id));
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      await product.update({
        name: body.name,
        brand: body.brand,
        price: body.price,
        min_stock: body.min_stock,
        quantity: body.quantity,
        product_type_id: body.product_type_id,
        status: body.status ?? product.status,
      });

      res.status(200).json({ product });
    } catch (error) {
      res.status(500).json({ error: "Error updating product (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<ProductI>;
      const product = await Product.findByPk(id);
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      if (body.product_type_id !== undefined) {
        const check = await assertActiveProductType(Number(body.product_type_id));
        if (!check.ok) {
          res.status(check.status).json({ error: check.error });
          return;
        }
      }

      await product.update(body);
      res.status(200).json({ product });
    } catch (error) {
      res.status(500).json({ error: "Error updating product (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const product = await Product.findByPk(id);
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      await product.destroy();
      res.status(200).json({ message: "Product permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting product", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const product = await Product.findByPk(id);
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      await product.update({ status: "inactive" });
      res.status(200).json({
        message: "Product deactivated (logical delete)",
        product,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating product", detail: String(error) });
    }
  }
}
EOF
```

![](images/clipboard-1151915429.png)

```         
: > src/features/business/product/product.routes.ts
cat >> src/features/business/product/product.routes.ts << 'EOF'
import { Application } from "express";
import { ProductController } from "./product.controller";

export class ProductRoutes {
  public productController: ProductController = new ProductController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/productos")
      .get(this.productController.getAll.bind(this.productController));

    // getOne
    app
      .route("/api/productos/:id")
      .get(this.productController.getOne.bind(this.productController));

    // create
    app
      .route("/api/productos")
      .post(this.productController.create.bind(this.productController));

    // update (PUT / PATCH)
    app
      .route("/api/productos/:id")
      .put(this.productController.updatePut.bind(this.productController))
      .patch(this.productController.updatePatch.bind(this.productController));

    // delete físico
    app
      .route("/api/productos/:id")
      .delete(this.productController.deletePhysical.bind(this.productController));

    // delete lógico
    app
      .route("/api/productos/:id/deactivate")
      .patch(this.productController.deleteLogical.bind(this.productController));
  }
}
EOF
```

![](images/clipboard-2323658104.png)

### 12.3 HTTP (REST Client)

```         
: > src/features/business/product/http/products.get.http
cat >> src/features/business/product/http/products.get.http << 'EOF'
### Feature Product — GET ALL / GET ONE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name getAllProducts
GET {{baseUrl}}/api/productos

###

# @name getOneProduct
GET {{baseUrl}}/api/productos/{{id}}
EOF
```

![](images/clipboard-2645224474.png)

```         
: > src/features/business/product/http/products.create.http
cat >> src/features/business/product/http/products.create.http << 'EOF'
### Feature Product — CREATE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000

# @name createProduct
POST {{baseUrl}}/api/productos
Content-Type: application/json

{
  "name": "Laptop Pro",
  "brand": "TechBrand",
  "price": 1299.99,
  "min_stock": 5,
  "quantity": 50,
  "product_type_id": 1,
  "status": "active"
}
EOF
```

![](images/clipboard-589433333.png)

```         
: > src/features/business/product/http/products.update.http
cat >> src/features/business/product/http/products.update.http << 'EOF'
### Feature Product — UPDATE (PUT) / UPDATE (PATCH)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name updateProductPut
PUT {{baseUrl}}/api/productos/{{id}}
Content-Type: application/json

{
  "name": "Laptop Pro Max",
  "brand": "TechBrand",
  "price": 1499.99,
  "min_stock": 5,
  "quantity": 40,
  "product_type_id": 1,
  "status": "active"
}

###

# @name updateProductPatch
PATCH {{baseUrl}}/api/productos/{{id}}
Content-Type: application/json

{
  "price": 1399.99,
  "quantity": 45
}
EOF
```

![](images/clipboard-340364597.png)

```         
: > src/features/business/product/http/products.delete.http
cat >> src/features/business/product/http/products.delete.http << 'EOF'
### Feature Product — DELETE físico / DELETE lógico (status = inactive)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name deleteProductPhysical
DELETE {{baseUrl}}/api/productos/{{id}}

###

# @name deleteProductLogical
PATCH {{baseUrl}}/api/productos/{{id}}/deactivate
EOF
```

![](images/clipboard-2152385731.png)

## 12.4 Cableado Routes + Config

**PARCHE** — `src/routes/index.ts`:

![](images/clipboard-1526047393.png)

**PARCHE** — `src/config/index.ts`:

![](images/clipboard-4211455256.png)

### Verificación

![](images/clipboard-3756162924.png)

## 12.6 Seeder + Swagger Veterinarian

```         
: > src/features/business/product/product.seeder.ts
cat >> src/features/business/product/product.seeder.ts << 'EOF'
import { faker } from "@faker-js/faker";
import { Product } from "./product.model";
import { ProductType } from "../product-type/product-type.model";

/**
 * Seeder del feature Product (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Requiere tipos de producto activos. Idempotente: si ya hay filas, no inserta.
 */
export async function seedProducts(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  products: count=0, se omite");
    return 0;
  }

  const existing = await Product.count();
  if (existing > 0) {
    console.log(`⏭️  products: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const types = await ProductType.findAll({ where: { status: "active" } });
  if (types.length === 0) {
    console.log("⏭️  products: no hay tipos de producto activos, se omite seeder");
    return 0;
  }

  const rows = Array.from({ length: count }, () => {
    const type = types[Math.floor(Math.random() * types.length)];
    return {
      name: faker.commerce.productName(),
      brand: faker.company.name(),
      price: Number(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
      min_stock: faker.number.int({ min: 1, max: 10 }),
      quantity: faker.number.int({ min: 20, max: 100 }),
      product_type_id: type.id,
      status: "active" as const,
    };
  });

  await Product.bulkCreate(rows);
  console.log(`✅ products: insertados ${count} registro(s) falsos`);
  return count;
}
EOF
```

![](images/clipboard-2181131179.png)

**PARCHE** — `src/database/seeders/counts.ts` completo:

![](images/clipboard-295442488.png)

**PARCHE** — `src/database/seeders/index.ts` completo:

![](images/clipboard-3400970289.png)

```         
: > src/features/business/product/product.swagger.ts
cat >> src/features/business/product/product.swagger.ts << 'EOF'
/**
 * Documentación OpenAPI del feature Product.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const productSwagger = {
  tags: [
    {
      name: "Productos",
      description: "CRUD de productos — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/productos": {
      get: {
        tags: ["Productos"],
        summary: "Listar productos activos",
        description: "SIN AUTH — retorna productos con status=active",
        security: [],
        responses: {
          "200": {
            description: "Lista de productos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    products: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Product" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Productos"],
        summary: "Crear producto",
        description: "SIN AUTH — product_type_id debe existir y estar active",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Producto creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    product: { $ref: "#/components/schemas/Product" },
                  },
                },
              },
            },
          },
          "400": { description: "Tipo de producto inactivo" },
          "404": { description: "Tipo de producto no encontrado" },
        },
      },
    },
    "/api/productos/{id}": {
      get: {
        tags: ["Productos"],
        summary: "Obtener producto por id",
        description: "SIN AUTH",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Producto encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    product: { $ref: "#/components/schemas/Product" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Productos"],
        summary: "Actualizar producto (PUT — reemplazo)",
        description: "SIN AUTH — product_type_id debe existir y estar active",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductUpdate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "400": { description: "Tipo de producto inactivo" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Productos"],
        summary: "Actualizar producto (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Productos"],
        summary: "Eliminar producto (físico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/productos/{id}/deactivate": {
      patch: {
        tags: ["Productos"],
        summary: "Eliminar producto (lógico)",
        description: "SIN AUTH — status = inactive",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Desactivado" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      Product: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Laptop Pro" },
          brand: { type: "string", example: "TechBrand" },
          price: { type: "number", example: 1299.99 },
          min_stock: { type: "integer", example: 5 },
          quantity: { type: "integer", example: 50 },
          product_type_id: { type: "integer", example: 1 },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ProductCreate: {
        type: "object",
        required: ["name", "brand", "price", "min_stock", "quantity", "product_type_id"],
        properties: {
          name: { type: "string" },
          brand: { type: "string" },
          price: { type: "number" },
          min_stock: { type: "integer" },
          quantity: { type: "integer" },
          product_type_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      ProductUpdate: {
        type: "object",
        required: ["name", "brand", "price", "min_stock", "quantity", "product_type_id"],
        properties: {
          name: { type: "string" },
          brand: { type: "string" },
          price: { type: "number" },
          min_stock: { type: "integer" },
          quantity: { type: "integer" },
          product_type_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      ProductPatch: {
        type: "object",
        properties: {
          name: { type: "string" },
          brand: { type: "string" },
          price: { type: "number" },
          min_stock: { type: "integer" },
          quantity: { type: "integer" },
          product_type_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
EOF
```

![](images/clipboard-2138319307.png)

**PARCHE** — `src/swagger/index.ts` completo:

![](images/clipboard-140143796.png)

### Cierre del ISSUE-07

```         
npm run dev
```

![![](images/clipboard-3390655105.png)](images/clipboard-971816487.png)

![](images/clipboard-1529466648.png)

# 13. ISS-08 — Feature Appointment (citas)

## 13.1 Modelo Appointment

![](images/clipboard-2368540258.png)

## 13.2 Controller + routes (CRUD completo)

```         
: > src/features/business/product-sale/product-sale.controller.ts
cat >> src/features/business/product-sale/product-sale.controller.ts << 'EOF'
import { Request, Response } from "express";
import { Transaction } from "sequelize";
import { sequelize } from "../../../database/db";
import { ProductSale, ProductSaleI } from "./product-sale.model";
import { Sale } from "../sale/sale.model";
import { Product } from "../product/product.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

async function recalcSaleTotals(sale_id: number, t: Transaction): Promise<void> {
  const items = await ProductSale.findAll({
    where: { sale_id, status: "active" },
    transaction: t,
  });
  const subtotal = items.reduce((sum, row) => sum + Number(row.line_total), 0);
  const sale = await Sale.findByPk(sale_id, { transaction: t });
  if (!sale) return;
  const total = subtotal + Number(sale.tax) - Number(sale.discounts);
  await sale.update({ subtotal, total }, { transaction: t });
}

export class ProductSaleController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const product_sales = await ProductSale.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ product_sales });
    } catch (error) {
      res.status(500).json({ error: "Error fetching product sales", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const product_sale = await ProductSale.findByPk(id);
      if (!product_sale) {
        res.status(404).json({ error: "Product sale not found" });
        return;
      }
      res.status(200).json({ product_sale });
    } catch (error) {
      res.status(500).json({ error: "Error fetching product sale", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  /** Agrega una línea a una venta existente (ajusta stock y totales). */
  public async create(req: Request, res: Response) {
    const t = await sequelize.transaction();
    try {
      const body = req.body as Pick<ProductSaleI, "sale_id" | "product_id" | "quantity" | "status">;

      if (!body.sale_id || !body.product_id || !body.quantity || body.quantity < 1) {
        await t.rollback();
        res.status(400).json({ error: "sale_id, product_id and quantity (>=1) are required" });
        return;
      }

      const sale = await Sale.findByPk(body.sale_id, { transaction: t });
      if (!sale) {
        await t.rollback();
        res.status(404).json({ error: "Sale not found" });
        return;
      }
      if (sale.status !== "active") {
        await t.rollback();
        res.status(400).json({ error: "Sale must be active" });
        return;
      }

      const product = await Product.findByPk(body.product_id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!product) {
        await t.rollback();
        res.status(404).json({ error: "Product not found" });
        return;
      }
      if (product.status !== "active") {
        await t.rollback();
        res.status(400).json({ error: "Product must be active" });
        return;
      }
      if (product.quantity < body.quantity) {
        await t.rollback();
        res.status(400).json({
          error: "Insufficient stock",
          available: product.quantity,
          requested: body.quantity,
        });
        return;
      }

      const unit_price = Number(product.price);
      const line_total = unit_price * body.quantity;

      const product_sale = await ProductSale.create(
        {
          sale_id: body.sale_id,
          product_id: body.product_id,
          quantity: body.quantity,
          unit_price,
          line_total,
          status: body.status ?? "active",
        },
        { transaction: t }
      );

      await product.update(
        { quantity: product.quantity - body.quantity },
        { transaction: t }
      );
      await recalcSaleTotals(body.sale_id, t);

      await t.commit();
      res.status(201).json({ product_sale });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: "Error creating product sale", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    const t = await sequelize.transaction();
    try {
      const id = paramId(req);
      const body = req.body as Pick<ProductSaleI, "quantity" | "status">;
      const product_sale = await ProductSale.findByPk(id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!product_sale) {
        await t.rollback();
        res.status(404).json({ error: "Product sale not found" });
        return;
      }

      const newQty = Number(body.quantity);
      if (!newQty || newQty < 1) {
        await t.rollback();
        res.status(400).json({ error: "quantity (>=1) is required" });
        return;
      }

      const product = await Product.findByPk(product_sale.product_id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!product) {
        await t.rollback();
        res.status(404).json({ error: "Product not found" });
        return;
      }

      const delta = newQty - product_sale.quantity;
      if (delta > 0 && product.quantity < delta) {
        await t.rollback();
        res.status(400).json({
          error: "Insufficient stock",
          available: product.quantity,
          requested_extra: delta,
        });
        return;
      }

      const unit_price = Number(product_sale.unit_price);
      const line_total = unit_price * newQty;

      await product.update(
        { quantity: product.quantity - delta },
        { transaction: t }
      );
      await product_sale.update(
        {
          quantity: newQty,
          line_total,
          status: body.status ?? product_sale.status,
        },
        { transaction: t }
      );
      await recalcSaleTotals(product_sale.sale_id, t);

      await t.commit();
      res.status(200).json({ product_sale });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: "Error updating product sale (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    const t = await sequelize.transaction();
    try {
      const id = paramId(req);
      const body = req.body as Partial<Pick<ProductSaleI, "quantity" | "status">>;
      const product_sale = await ProductSale.findByPk(id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!product_sale) {
        await t.rollback();
        res.status(404).json({ error: "Product sale not found" });
        return;
      }

      if (body.quantity !== undefined) {
        const newQty = Number(body.quantity);
        if (!newQty || newQty < 1) {
          await t.rollback();
          res.status(400).json({ error: "quantity must be >= 1" });
          return;
        }

        const product = await Product.findByPk(product_sale.product_id, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (!product) {
          await t.rollback();
          res.status(404).json({ error: "Product not found" });
          return;
        }

        const delta = newQty - product_sale.quantity;
        if (delta > 0 && product.quantity < delta) {
          await t.rollback();
          res.status(400).json({
            error: "Insufficient stock",
            available: product.quantity,
            requested_extra: delta,
          });
          return;
        }

        await product.update(
          { quantity: product.quantity - delta },
          { transaction: t }
        );
        await product_sale.update(
          {
            quantity: newQty,
            line_total: Number(product_sale.unit_price) * newQty,
          },
          { transaction: t }
        );
      }

      if (body.status !== undefined) {
        await product_sale.update({ status: body.status }, { transaction: t });
      }

      await recalcSaleTotals(product_sale.sale_id, t);
      await t.commit();
      res.status(200).json({ product_sale });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: "Error updating product sale (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física: restaura stock y recalcula totales de la venta */
  public async deletePhysical(req: Request, res: Response) {
    const t = await sequelize.transaction();
    try {
      const id = paramId(req);
      const product_sale = await ProductSale.findByPk(id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!product_sale) {
        await t.rollback();
        res.status(404).json({ error: "Product sale not found" });
        return;
      }

      const product = await Product.findByPk(product_sale.product_id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (product && product_sale.status === "active") {
        await product.update(
          { quantity: product.quantity + product_sale.quantity },
          { transaction: t }
        );
      }

      const sale_id = product_sale.sale_id;
      await product_sale.destroy({ transaction: t });
      await recalcSaleTotals(sale_id, t);

      await t.commit();
      res.status(200).json({ message: "Product sale permanently deleted", id });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: "Error deleting product sale", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive (restaura stock y recalcula) */
  public async deleteLogical(req: Request, res: Response) {
    const t = await sequelize.transaction();
    try {
      const id = paramId(req);
      const product_sale = await ProductSale.findByPk(id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!product_sale) {
        await t.rollback();
        res.status(404).json({ error: "Product sale not found" });
        return;
      }

      if (product_sale.status === "active") {
        const product = await Product.findByPk(product_sale.product_id, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (product) {
          await product.update(
            { quantity: product.quantity + product_sale.quantity },
            { transaction: t }
          );
        }
      }

      await product_sale.update({ status: "inactive" }, { transaction: t });
      await recalcSaleTotals(product_sale.sale_id, t);

      await t.commit();
      res.status(200).json({
        message: "Product sale deactivated (logical delete)",
        product_sale,
      });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: "Error deactivating product sale", detail: String(error) });
    }
  }
}
EOF
```

![](images/clipboard-1599576384.png)

```         
: > src/features/business/product-sale/product-sale.routes.ts
cat >> src/features/business/product-sale/product-sale.routes.ts << 'EOF'
import { Application } from "express";
import { ProductSaleController } from "./product-sale.controller";

export class ProductSaleRoutes {
  public productSaleController: ProductSaleController = new ProductSaleController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/detalle-ventas")
      .get(this.productSaleController.getAll.bind(this.productSaleController));

    // getOne
    app
      .route("/api/detalle-ventas/:id")
      .get(this.productSaleController.getOne.bind(this.productSaleController));

    // create
    app
      .route("/api/detalle-ventas")
      .post(this.productSaleController.create.bind(this.productSaleController));

    // update (PUT / PATCH)
    app
      .route("/api/detalle-ventas/:id")
      .put(this.productSaleController.updatePut.bind(this.productSaleController))
      .patch(this.productSaleController.updatePatch.bind(this.productSaleController));

    // delete físico
    app
      .route("/api/detalle-ventas/:id")
      .delete(this.productSaleController.deletePhysical.bind(this.productSaleController));

    // delete lógico
    app
      .route("/api/detalle-ventas/:id/deactivate")
      .patch(this.productSaleController.deleteLogical.bind(this.productSaleController));
  }
}
EOF
```

![](images/clipboard-388284108.png)

## 13.3 HTTP (REST Client)

```         
: > src/features/business/sale/http/sales.get.http
cat >> src/features/business/sale/http/sales.get.http << 'EOF'
### Feature Sale — GET ALL / GET ONE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name getAllSales
GET {{baseUrl}}/api/ventas

###

# @name getOneSale
GET {{baseUrl}}/api/ventas/{{id}}
EOF
```

![](images/clipboard-4253789022.png)

```         
: > src/features/business/sale/http/sales.create.http
cat >> src/features/business/sale/http/sales.create.http << 'EOF'
### Feature Sale — CREATE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000

# @name createSale
POST {{baseUrl}}/api/ventas
Content-Type: application/json

{
  "client_id": 1,
  "tax": 19,
  "discounts": 5,
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 2, "quantity": 1 }
  ]
}
EOF
```

![](images/clipboard-3807698813.png)

```         
: > src/features/business/sale/http/sales.update.http
cat >> src/features/business/sale/http/sales.update.http << 'EOF'
### Feature Sale — UPDATE (PUT) / UPDATE (PATCH) — solo cabecera
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name updateSalePut
PUT {{baseUrl}}/api/ventas/{{id}}
Content-Type: application/json

{
  "client_id": 1,
  "tax": 20,
  "discounts": 10,
  "sale_date": "2026-09-16T12:00:00.000Z",
  "status": "active"
}

###

# @name updateSalePatch
PATCH {{baseUrl}}/api/ventas/{{id}}
Content-Type: application/json

{
  "tax": 15,
  "discounts": 0
}
EOF
```

![](images/clipboard-4007010606.png)

```         
: > src/features/business/sale/http/sales.delete.http
cat >> src/features/business/sale/http/sales.delete.http << 'EOF'
### Feature Sale — DELETE físico / DELETE lógico (status = inactive)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name deleteSalePhysical
DELETE {{baseUrl}}/api/ventas/{{id}}

###

# @name deleteSaleLogical
PATCH {{baseUrl}}/api/ventas/{{id}}/deactivate
EOF
```

![](images/clipboard-3192490517.png)

## 13.4 Cableado Routes + Config

![](images/clipboard-1641645133.png)

**PARCHE** — `src/config/index.ts`:

**1. Debajo de** `import "../features/business/veterinarian/veterinarian.model";`

![](images/clipboard-217621651.png)

**2. Dentro de** `routes()`, debajo de `this.routePrv.veterinarianRoutes.routes(this.app);`

![](images/clipboard-3775292350.png)

## 13.5 Relación Pet, Appointment y Veterinarian

```         
: > src/features/business/sale/sale.associations.ts
cat >> src/features/business/sale/sale.associations.ts << 'EOF'
import { Sale } from "./sale.model";
import { Client } from "../client/client.model";

Sale.belongsTo(Client, { foreignKey: "client_id", as: "client" });
Client.hasMany(Sale, { foreignKey: "client_id", as: "sales" });
EOF
```

![](images/clipboard-2889276086.png)

**PARCHE** — `src/config/index.ts` **ya existe**.

![](images/clipboard-364038656.png)

### Verificación

![](images/clipboard-3114862693.png)

## 13.6 Seeder + Swagger Appointment

```         
: > src/features/business/sale/sale.seeder.ts
cat >> src/features/business/sale/sale.seeder.ts << 'EOF'
import { faker } from "@faker-js/faker";
import { Sale } from "./sale.model";
import { Client } from "../client/client.model";

/**
 * Seeder del feature Sale (cabeceras).
 * Las líneas `product_sales` las inserta `product-sale.seeder.ts`.
 * Idempotente: si ya hay ventas, no inserta.
 */
export async function seedSales(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  sales: count=0, se omite");
    return 0;
  }

  const existing = await Sale.count();
  if (existing > 0) {
    console.log(`⏭️  sales: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const clients = await Client.findAll({ where: { status: "active" } });
  if (clients.length === 0) {
    console.log("⏭️  sales: faltan clientes activos, se omite seeder");
    return 0;
  }

  const rows = Array.from({ length: count }, () => {
    const client = clients[Math.floor(Math.random() * clients.length)];
    const tax = Number(faker.number.float({ min: 0, max: 20, fractionDigits: 2 }));
    const discounts = Number(faker.number.float({ min: 0, max: 10, fractionDigits: 2 }));
    return {
      sale_date: faker.date.recent({ days: 30 }),
      subtotal: 0,
      tax,
      discounts,
      total: tax - discounts,
      client_id: client.id,
      status: "active" as const,
    };
  });

  await Sale.bulkCreate(rows);
  console.log(`✅ sales: insertados ${count} registro(s) falsos (sin ítems)`);
  return count;
}
EOF
```

![](images/clipboard-992922585.png)

**PARCHE** — `src/database/seeders/counts.ts`

```         
: > src/database/seeders/counts.ts
cat >> src/database/seeders/counts.ts << 'EOF'
/**
 * Cantidad de registros por tabla (snake_case = nombre de tabla BD).
 * Prioridad: CLI (--clients=N) > env (SEED_CLIENTS) > default de este archivo.
 *
 * Cuando agregues features, suma aquí la clave (nombre de tabla) y léela en el runner.
 */
export type SeedCounts = {
  clients: number;
  product_types: number;
  products: number;
  sales: number;
  product_sales: number;
  // users?: number;
  // roles?: number;
};

export const DEFAULT_SEED_COUNTS: SeedCounts = {
  clients: 10,
  product_types: 25,
  products: 15,
  sales: 5,
  product_sales: 12,
};

export function resolveSeedCounts(argv: string[] = process.argv.slice(2)): SeedCounts {
  const counts: SeedCounts = { ...DEFAULT_SEED_COUNTS };

  const envMap: Array<[keyof SeedCounts, string | undefined]> = [
    ["clients", process.env.SEED_CLIENTS],
    ["product_types", process.env.SEED_PRODUCT_TYPES],
    ["products", process.env.SEED_PRODUCTS],
    ["sales", process.env.SEED_SALES],
    ["product_sales", process.env.SEED_PRODUCT_SALES],
  ];
  for (const [key, value] of envMap) {
    if (value !== undefined && value !== "") {
      counts[key] = Number(value);
    }
  }

  for (const arg of argv) {
    const m = arg.match(/^--([a-zA-Z_]+)=(\d+)$/);
    if (!m) continue;
    const key = m[1] as keyof SeedCounts;
    const value = Number(m[2]);
    if (key in counts) {
      counts[key] = value;
    }
  }

  return counts;
}
EOF
```

![](images/clipboard-1587690319.png)

**PARCHE** — `src/database/seeders/index.ts`

```         
: > src/database/seeders/index.ts
cat >> src/database/seeders/index.ts << 'EOF'
import dotenv from "dotenv";
import { sequelize, testConnection } from "../db";
import "../../features/business/client/client.model";
import "../../features/business/product-type/product-type.model";
import "../../features/business/product/product.model";
import "../../features/business/sale/sale.model";
import "../../features/business/product-sale/product-sale.model";
import "../../features/business/product/product.associations";
import "../../features/business/sale/sale.associations";
import "../../features/business/product-sale/product-sale.associations";
import { seedClients } from "../../features/business/client/client.seeder";
import { seedProductTypes } from "../../features/business/product-type/product-type.seeder";
import { seedProducts } from "../../features/business/product/product.seeder";
import { seedSales } from "../../features/business/sale/sale.seeder";
import { seedProductSales } from "../../features/business/product-sale/product-sale.seeder";
import { resolveSeedCounts } from "./counts";

dotenv.config();

/**
 * SeedersRunner — ejecuta los seeders de TODAS las tablas (features).
 *
 * Tablas actuales (orden padres → hijos):
 *   clients → product_types → products → sales → product_sales
 *
 * Ejecutar seeders de todas las tablas:
 *   npm run db:seed
 *
 * Variar cantidades (CLI o env; claves = nombre de tabla):
 *   npm run db:seed -- --clients=20 --product_types=5 --products=15 --sales=5 --product_sales=12
 *   SEED_CLIENTS=5 SEED_PRODUCT_TYPES=3 SEED_PRODUCTS=10 SEED_SALES=2 SEED_PRODUCT_SALES=6 npm run db:seed
 *
 * Defaults: ver `counts.ts`. Cada seeder es idempotente (si ya hay filas, omite).
 * Ubicación de cada seeder: `src/features/.../<entidad>.seeder.ts`
 * Este archivo solo orquesta; no define datos.
 */
export async function runAllSeeders(): Promise<void> {
  const counts = resolveSeedCounts();
  console.log("🌱 Iniciando SeedersRunner...");
  console.log("📊 Conteos:", counts);

  const ok = await testConnection();
  if (!ok) {
    throw new Error("No hay conexión a la base de datos");
  }

  const isMysql =
    sequelize.getDialect() === "mysql" || sequelize.getDialect() === "mariadb";
  if (isMysql) {
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
  }
  try {
    await sequelize.sync({ force: false, alter: true });
  } finally {
    if (isMysql) {
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    }
  }

  // Orden: business (padres → hijos)
  await seedClients(counts.clients);
  await seedProductTypes(counts.product_types);
  await seedProducts(counts.products);
  await seedSales(counts.sales);
  await seedProductSales(counts.product_sales);

  console.log("🌱 SeedersRunner finalizado");
}

if (require.main === module) {
  runAllSeeders()
    .then(async () => {
      await sequelize.close();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("❌ Error en seeders:", err);
      await sequelize.close();
      process.exit(1);
    });
}
EOF
```

![](images/clipboard-201069120.png)

![](images/clipboard-382456468.png)

**PARCHE** — `src/swagger/index.ts` completo:

```         
: > src/swagger/index.ts
cat >> src/swagger/index.ts << 'EOF'
import { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { clientSwagger } from "../features/business/client/client.swagger";
import { productTypeSwagger } from "../features/business/product-type/product-type.swagger";
import { productSwagger } from "../features/business/product/product.swagger";
import { saleSwagger } from "../features/business/sale/sale.swagger";
import { productSaleSwagger } from "../features/business/product-sale/product-sale.swagger";

export type FeatureSwaggerModule = {
  tags: unknown[];
  paths: Record<string, unknown>;
  components?: { schemas?: Record<string, unknown> };
};

/**
 * Registry externo: importa la documentación OpenAPI de cada feature
 * (mismo patrón que SeedersRunner).
 */
const featureSwaggerModules: FeatureSwaggerModule[] = [
  clientSwagger,
  productTypeSwagger,
  productSwagger,
  saleSwagger,
  productSaleSwagger,
];

export function buildOpenApiDocument() {
  const tags: unknown[] = [];
  const paths: Record<string, unknown> = {};
  const schemas: Record<string, unknown> = {};

  for (const mod of featureSwaggerModules) {
    tags.push(...mod.tags);
    Object.assign(paths, mod.paths);
    if (mod.components?.schemas) {
      Object.assign(schemas, mod.components.schemas);
    }
  }

  return {
    openapi: "3.0.3",
    info: {
      title: "StoreLab API",
      version: "1.0.0",
      description:
        "API StoreLab (Express + Sequelize). Los endpoints de business están documentados como **SIN AUTH** (este lab no implementa autenticación).",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4000}`,
        description: "Local",
      },
    ],
    tags,
    paths,
    components: { schemas },
  };
}

/** Monta Swagger UI y el JSON OpenAPI */
export function setupSwagger(app: Application): void {
  const document = buildOpenApiDocument();
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(document));
  app.get("/api/docs.json", (_req, res) => {
    res.json(document);
  });
  console.log("📘 Swagger UI: /api/docs  |  OpenAPI JSON: /api/docs.json");
}
EOF
```

![](images/clipboard-1545590031.png)

### Cierre del ISSUE-08

![![](images/clipboard-3610143904.png)](images/clipboard-2252877040.png)

![](images/clipboard-2322458990.png)

# 14. ISS-09 — Feature Consultation (Consultas)

## 13.1 Modelo Consultation

```         
: > src/features/business/product-type/product-type.model.ts
cat >> src/features/business/product-type/product-type.model.ts << 'EOF'
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface ProductTypeI {
  id?: number;
  name: string;
  description?: string | null;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class ProductType extends Model {
  public id!: number;
  public name!: string;
  public description!: string | null;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProductType.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "inactive",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ProductType",
    tableName: "product_types",
    timestamps: true,
  }
);
EOF
```

![](images/clipboard-4113198241.png)

## 14.2 Controller + routes (CRUD completo)

```         
: > src/features/business/product-type/product-type.controller.ts
cat >> src/features/business/product-type/product-type.controller.ts << 'EOF'
import { Request, Response } from "express";
import { ProductType, ProductTypeI } from "./product-type.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class ProductTypeController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const product_types = await ProductType.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ product_types });
    } catch (error) {
      res.status(500).json({ error: "Error fetching product types", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const product_type = await ProductType.findByPk(id);
      if (!product_type) {
        res.status(404).json({ error: "Product type not found" });
        return;
      }
      res.status(200).json({ product_type });
    } catch (error) {
      res.status(500).json({ error: "Error fetching product type", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as ProductTypeI;
      const product_type = await ProductType.create({
        name: body.name,
        description: body.description ?? null,
        status: body.status ?? "active",
      });
      res.status(201).json({ product_type });
    } catch (error) {
      res.status(500).json({ error: "Error creating product type", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as ProductTypeI;
      const product_type = await ProductType.findByPk(id);
      if (!product_type) {
        res.status(404).json({ error: "Product type not found" });
        return;
      }

      await product_type.update({
        name: body.name,
        description: body.description ?? null,
        status: body.status ?? product_type.status,
      });

      res.status(200).json({ product_type });
    } catch (error) {
      res.status(500).json({ error: "Error updating product type (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<ProductTypeI>;
      const product_type = await ProductType.findByPk(id);
      if (!product_type) {
        res.status(404).json({ error: "Product type not found" });
        return;
      }

      await product_type.update(body);
      res.status(200).json({ product_type });
    } catch (error) {
      res.status(500).json({ error: "Error updating product type (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const product_type = await ProductType.findByPk(id);
      if (!product_type) {
        res.status(404).json({ error: "Product type not found" });
        return;
      }
      await product_type.destroy();
      res.status(200).json({ message: "Product type permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting product type", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const product_type = await ProductType.findByPk(id);
      if (!product_type) {
        res.status(404).json({ error: "Product type not found" });
        return;
      }
      await product_type.update({ status: "inactive" });
      res.status(200).json({
        message: "Product type deactivated (logical delete)",
        product_type,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating product type", detail: String(error) });
    }
  }
}
EOF
```

![](images/clipboard-3152312757.png)

```         
: > src/features/business/product-type/product-type.routes.ts
cat >> src/features/business/product-type/product-type.routes.ts << 'EOF'
import { Application } from "express";
import { ProductTypeController } from "./product-type.controller";

export class ProductTypeRoutes {
  public productTypeController: ProductTypeController = new ProductTypeController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/tipos-producto")
      .get(this.productTypeController.getAll.bind(this.productTypeController));

    // getOne
    app
      .route("/api/tipos-producto/:id")
      .get(this.productTypeController.getOne.bind(this.productTypeController));

    // create
    app
      .route("/api/tipos-producto")
      .post(this.productTypeController.create.bind(this.productTypeController));

    // update (PUT / PATCH)
    app
      .route("/api/tipos-producto/:id")
      .put(this.productTypeController.updatePut.bind(this.productTypeController))
      .patch(this.productTypeController.updatePatch.bind(this.productTypeController));

    // delete físico
    app
      .route("/api/tipos-producto/:id")
      .delete(this.productTypeController.deletePhysical.bind(this.productTypeController));

    // delete lógico
    app
      .route("/api/tipos-producto/:id/deactivate")
      .patch(this.productTypeController.deleteLogical.bind(this.productTypeController));
  }
}
EOF
```

![](images/clipboard-2455678872.png)

## 14.3 HTTP (REST Client)

```         
: > src/features/business/product-type/http/product-types.get.http
cat >> src/features/business/product-type/http/product-types.get.http << 'EOF'
### Feature ProductType — GET ALL / GET ONE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name getAllProductTypes
GET {{baseUrl}}/api/tipos-producto

###

# @name getOneProductType
GET {{baseUrl}}/api/tipos-producto/{{id}}
EOF
```

![](images/clipboard-3678713432.png)

```         
: > src/features/business/product-type/http/product-types.create.http
cat >> src/features/business/product-type/http/product-types.create.http << 'EOF'
### Feature ProductType — CREATE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000

# @name createProductType
POST {{baseUrl}}/api/tipos-producto
Content-Type: application/json

{
  "name": "Electrónica",
  "description": "Dispositivos y accesorios",
  "status": "active"
}
EOF
```

![](images/clipboard-3304402684.png)

```         
: > src/features/business/product-type/http/product-types.update.http
cat >> src/features/business/product-type/http/product-types.update.http << 'EOF'
### Feature ProductType — UPDATE (PUT) / UPDATE (PATCH)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name updateProductTypePut
PUT {{baseUrl}}/api/tipos-producto/{{id}}
Content-Type: application/json

{
  "name": "Electrónica Actualizada",
  "description": "Categoría renovada",
  "status": "active"
}

###

# @name updateProductTypePatch
PATCH {{baseUrl}}/api/tipos-producto/{{id}}
Content-Type: application/json

{
  "description": "Descripción parcial"
}
EOF
```

![](images/clipboard-3063874546.png)

```         
: > src/features/business/product-type/http/product-types.delete.http
cat >> src/features/business/product-type/http/product-types.delete.http << 'EOF'
### Feature ProductType — DELETE físico / DELETE lógico (status = inactive)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name deleteProductTypePhysical
DELETE {{baseUrl}}/api/tipos-producto/{{id}}

###

# @name deleteProductTypeLogical
PATCH {{baseUrl}}/api/tipos-producto/{{id}}/deactivate
EOF
```

![](images/clipboard-4113461405.png)

## 14.4 Cableado Routes + Config

**PARCHE** — `src/routes/index.ts` **ya existe**.

![](images/clipboard-1772709972.png)

**PARCHE** — `src/config/index.ts` **ya existe**.

1.  **Debajo de** `import "../features/business/client/client.model";`, **añadir**

![](images/clipboard-2001026795.png)

2.  **Dentro de** `routes()`, **debajo de** `this.routePrv.clientRoutes.routes(this.app);`, **añadir**

![](images/clipboard-3344861763.png)

### Verificación

![](images/clipboard-1085429431.png)

![](images/clipboard-2467958430.png)

## 14.5 Relación Appointment ↔ Consultation

![](images/clipboard-1843647064.png)

**PARCHE** — `src/config/index.ts`: debajo de `import "../features/business/consultation/consultation.model";`, añade

![](images/clipboard-2441707764.png)

## 14.6 Seeder Consultation

```         
: > src/features/business/product-type/product-type.seeder.ts
cat >> src/features/business/product-type/product-type.seeder.ts << 'EOF'
import { faker } from "@faker-js/faker";
import { ProductType } from "./product-type.model";

/**
 * Seeder del feature ProductType (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedProductTypes(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  product_types: count=0, se omite");
    return 0;
  }

  const existing = await ProductType.count();
  if (existing > 0) {
    console.log(`⏭️  product_types: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const rows = Array.from({ length: count }, () => ({
    name: faker.commerce.department(),
    description: faker.commerce.productDescription(),
    status: "active" as const,
  }));

  await ProductType.bulkCreate(rows);
  console.log(`✅ product_types: insertados ${count} registro(s) falsos`);
  return count;
}
EOF
```

![](images/clipboard-565705780.png)

**PARCHE** — `src/database/seeders/counts.ts` **ya existe**.

![](images/clipboard-2461557040.png)

**PARCHE** — `src/database/seeders/index.ts` **ya existe**.

![](images/clipboard-747879059.png)

## 14.7 Swagger Consultation

```         
: > src/features/business/product-type/product-type.swagger.ts
cat >> src/features/business/product-type/product-type.swagger.ts << 'EOF'
/**
 * Documentación OpenAPI del feature ProductType.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const productTypeSwagger = {
  tags: [
    {
      name: "TiposProducto",
      description: "CRUD de tipos de producto — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/tipos-producto": {
      get: {
        tags: ["TiposProducto"],
        summary: "Listar tipos de producto activos",
        description: "SIN AUTH — retorna tipos con status=active",
        security: [],
        responses: {
          "200": {
            description: "Lista de tipos de producto",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    product_types: {
                      type: "array",
                      items: { $ref: "#/components/schemas/ProductType" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["TiposProducto"],
        summary: "Crear tipo de producto",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductTypeCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Tipo de producto creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    product_type: { $ref: "#/components/schemas/ProductType" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/tipos-producto/{id}": {
      get: {
        tags: ["TiposProducto"],
        summary: "Obtener tipo de producto por id",
        description: "SIN AUTH",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Tipo de producto encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    product_type: { $ref: "#/components/schemas/ProductType" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["TiposProducto"],
        summary: "Actualizar tipo de producto (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductTypeUpdate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["TiposProducto"],
        summary: "Actualizar tipo de producto (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductTypePatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["TiposProducto"],
        summary: "Eliminar tipo de producto (físico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/tipos-producto/{id}/deactivate": {
      patch: {
        tags: ["TiposProducto"],
        summary: "Eliminar tipo de producto (lógico)",
        description: "SIN AUTH — status = inactive",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Desactivado" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      ProductType: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Electrónica" },
          description: { type: "string", example: "Dispositivos y accesorios", nullable: true },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ProductTypeCreate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      ProductTypeUpdate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      ProductTypePatch: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
EOF
```

![](images/clipboard-1629779677.png)

**PARCHE** — `src/swagger/index.ts` **ya existe**.

![](images/clipboard-3863930847.png)

### Cierre del ISSUE-09

```         
npm run dev
```

![![](images/clipboard-1716395817.png)](images/clipboard-3628658065.png)

![](images/clipboard-745291202.png)

# 15. ISS-10 — Feature Vaccine (Vacunas)

## 15.1 Modelo Vaccine

```         
: > src/features/business/product/product.model.ts
cat >> src/features/business/product/product.model.ts << 'EOF'
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface ProductI {
  id?: number;
  name: string;
  brand: string;
  price: number;
  min_stock: number;
  quantity: number;
  product_type_id: number;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product extends Model {
  public id!: number;
  public name!: string;
  public brand!: string;
  public price!: number;
  public min_stock!: number;
  public quantity!: number;
  public product_type_id!: number;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    min_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    product_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "inactive",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: true,
  }
);
EOF
```

![](images/clipboard-2922208799.png)

### 15.2 Controller + routes (CRUD completo)

```         
: > src/features/business/product/product.controller.ts
cat >> src/features/business/product/product.controller.ts << 'EOF'
import { Request, Response } from "express";
import { Product, ProductI } from "./product.model";
import { ProductType } from "../product-type/product-type.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

async function assertActiveProductType(product_type_id: number): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const productType = await ProductType.findByPk(product_type_id);
  if (!productType) {
    return { ok: false, status: 404, error: "Product type not found" };
  }
  if (productType.status !== "active") {
    return { ok: false, status: 400, error: "Product type must be active" };
  }
  return { ok: true };
}

export class ProductController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const products = await Product.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ error: "Error fetching products", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const product = await Product.findByPk(id);
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      res.status(200).json({ product });
    } catch (error) {
      res.status(500).json({ error: "Error fetching product", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as ProductI;
      const check = await assertActiveProductType(Number(body.product_type_id));
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      const product = await Product.create({
        name: body.name,
        brand: body.brand,
        price: body.price,
        min_stock: body.min_stock,
        quantity: body.quantity,
        product_type_id: body.product_type_id,
        status: body.status ?? "active",
      });
      res.status(201).json({ product });
    } catch (error) {
      res.status(500).json({ error: "Error creating product", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as ProductI;
      const product = await Product.findByPk(id);
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      const check = await assertActiveProductType(Number(body.product_type_id));
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      await product.update({
        name: body.name,
        brand: body.brand,
        price: body.price,
        min_stock: body.min_stock,
        quantity: body.quantity,
        product_type_id: body.product_type_id,
        status: body.status ?? product.status,
      });

      res.status(200).json({ product });
    } catch (error) {
      res.status(500).json({ error: "Error updating product (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<ProductI>;
      const product = await Product.findByPk(id);
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      if (body.product_type_id !== undefined) {
        const check = await assertActiveProductType(Number(body.product_type_id));
        if (!check.ok) {
          res.status(check.status).json({ error: check.error });
          return;
        }
      }

      await product.update(body);
      res.status(200).json({ product });
    } catch (error) {
      res.status(500).json({ error: "Error updating product (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const product = await Product.findByPk(id);
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      await product.destroy();
      res.status(200).json({ message: "Product permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting product", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const product = await Product.findByPk(id);
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      await product.update({ status: "inactive" });
      res.status(200).json({
        message: "Product deactivated (logical delete)",
        product,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating product", detail: String(error) });
    }
  }
}
EOF
```

![](images/clipboard-3220879920.png)

```         
: > src/features/business/product/product.routes.ts
cat >> src/features/business/product/product.routes.ts << 'EOF'
import { Application } from "express";
import { ProductController } from "./product.controller";

export class ProductRoutes {
  public productController: ProductController = new ProductController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/productos")
      .get(this.productController.getAll.bind(this.productController));

    // getOne
    app
      .route("/api/productos/:id")
      .get(this.productController.getOne.bind(this.productController));

    // create
    app
      .route("/api/productos")
      .post(this.productController.create.bind(this.productController));

    // update (PUT / PATCH)
    app
      .route("/api/productos/:id")
      .put(this.productController.updatePut.bind(this.productController))
      .patch(this.productController.updatePatch.bind(this.productController));

    // delete físico
    app
      .route("/api/productos/:id")
      .delete(this.productController.deletePhysical.bind(this.productController));

    // delete lógico
    app
      .route("/api/productos/:id/deactivate")
      .patch(this.productController.deleteLogical.bind(this.productController));
  }
}
EOF
```

![](images/clipboard-2168067102.png)

## 15.3 HTTP (REST Client)

```         
: > src/features/business/product/http/products.get.http
cat >> src/features/business/product/http/products.get.http << 'EOF'
### Feature Product — GET ALL / GET ONE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name getAllProducts
GET {{baseUrl}}/api/productos

###

# @name getOneProduct
GET {{baseUrl}}/api/productos/{{id}}
EOF
```

![](images/clipboard-3238286084.png)

```         
: > src/features/business/product/http/products.create.http
cat >> src/features/business/product/http/products.create.http << 'EOF'
### Feature Product — CREATE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000

# @name createProduct
POST {{baseUrl}}/api/productos
Content-Type: application/json

{
  "name": "Laptop Pro",
  "brand": "TechBrand",
  "price": 1299.99,
  "min_stock": 5,
  "quantity": 50,
  "product_type_id": 1,
  "status": "active"
}
EOF
```

![](images/clipboard-587618455.png)

```         
: > src/features/business/product/http/products.update.http
cat >> src/features/business/product/http/products.update.http << 'EOF'
### Feature Product — UPDATE (PUT) / UPDATE (PATCH)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name updateProductPut
PUT {{baseUrl}}/api/productos/{{id}}
Content-Type: application/json

{
  "name": "Laptop Pro Max",
  "brand": "TechBrand",
  "price": 1499.99,
  "min_stock": 5,
  "quantity": 40,
  "product_type_id": 1,
  "status": "active"
}

###

# @name updateProductPatch
PATCH {{baseUrl}}/api/productos/{{id}}
Content-Type: application/json

{
  "price": 1399.99,
  "quantity": 45
}
EOF
```

![](images/clipboard-3490908816.png)

```         
: > src/features/business/product/http/products.delete.http
cat >> src/features/business/product/http/products.delete.http << 'EOF'
### Feature Product — DELETE físico / DELETE lógico (status = inactive)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name deleteProductPhysical
DELETE {{baseUrl}}/api/productos/{{id}}

###

# @name deleteProductLogical
PATCH {{baseUrl}}/api/productos/{{id}}/deactivate
EOF
```

![](images/clipboard-2788511513.png)

### 15.4 Cableado Routes + Config

**PARCHE** — `src/routes/index.ts`

![](images/clipboard-4273037211.png)

**PARCHE** — `src/config/index.ts`

![](images/clipboard-3764428209.png)

![](images/clipboard-3650883310.png)

### Verificación

![![](images/clipboard-2815427976.png)](images/clipboard-2670534646.png)

## 15.5 Seeder Vaccine

![](images/clipboard-3458498450.png)

**PARCHE** — `src/database/seeders/counts.ts`

![](images/clipboard-4031266418.png)

**PARCHE** — `src/database/seeders/index.ts`

![](images/clipboard-3854479578.png)

## 11.6 Swagger Vaccine

![](images/clipboard-1242118650.png)

**PARCHE** — `src/swagger/index.ts`

![](images/clipboard-1583384998.png)

### Cierre del ISSUE-10

![](images/clipboard-3860788738.png)

![](images/clipboard-3763005801.png)

![](images/clipboard-908693365.png)

# 16. ISS-11 — Feature Vaccine Batch (Lote de Vacunas)

## 16.1 Modelo Vaccine Batch

![](images/clipboard-335514669.png)

## 16.2 Controller + routes (CRUD completo)

![](images/clipboard-681635282.png)

![](images/clipboard-3204335019.png)

## 16.3 HTTP (REST Client)

### Get

![](images/clipboard-3327366466.png)

### Create

![](images/clipboard-2345758405.png)

### Update

![](images/clipboard-3508362961.png)

### Delete

![](images/clipboard-3661781637.png)

## 16.4 Cableado Routes + Config

**PARCHE** — `src/routes/index.ts`

![](images/clipboard-218117866.png)

**PARCHE** — `src/config/index.ts`

![](images/clipboard-1982595672.png)

![](images/clipboard-1037598709.png)

## 16.5 Relación Vaccine ↔ VaccineBatch

![](images/clipboard-3595960141.png)

**PARCHE** — `src/config/index.ts`

![](images/clipboard-3539668870.png)

### Verificación

![](images/clipboard-2074171878.png)

## 16.6 Seeder + Swagger VaccineBatch

![](images/clipboard-2886005926.png)

**PARCHE** — `src/database/seeders/counts.ts`

![](images/clipboard-1715207200.png)

**PARCHE** — `src/database/seeders/index.ts`

![](images/clipboard-4089688287.png)

![](images/clipboard-896022439.png)

**PARCHE** — `src/swagger/index.ts`

![](images/clipboard-815801480.png)

### Cierre del ISSUE-11

![](images/clipboard-4250160437.png)

![](images/clipboard-3178558948.png)

![](images/clipboard-457724080.png)

# 17. ISS-12 — Feature Recipe (Receta)

## 17.1 Modelo Recipe

![](images/clipboard-2046944931.png)

## 17.2 Controller + routes (CRUD completo)

![](images/clipboard-2193715437.png)

![](images/clipboard-4133511687.png)

## 17.3 HTTP (REST Client)

### Get

![](images/clipboard-262891378.png)

### Create

![](images/clipboard-3957279786.png)

### Update

![](images/clipboard-1666323264.png)

### Delete

![](images/clipboard-3394155296.png)

## 17.4 Cableado Routes + Config

**PARCHE** — `src/routes/index.ts`

![](images/clipboard-2810682448.png)

**PARCHE** — `src/config/index.ts`:

![](images/clipboard-2591528421.png)

![](images/clipboard-2966714906.png)

### Verificación

![](images/clipboard-1738010616.png)

## 17.5 Relación Consultation ↔ Recipe

![](images/clipboard-75185003.png)

**PARCHE** — `src/config/index.ts` **ya existe**.

![](images/clipboard-4257495726.png)

## 17.6 Seeder + Swagger Recipe

![](images/clipboard-4236694600.png)

**PARCHE** — `src/database/seeders/counts.ts`

![](images/clipboard-2660358169.png)

**PARCHE** — `src/database/seeders/index.ts`

![](images/clipboard-1642366473.png)

![](images/clipboard-3371347942.png)

**PARCHE** — `src/swagger/index.ts`

![](images/clipboard-2329161866.png)

### Cierre del ISSUE-12

![](images/clipboard-849734320.png)

![](images/clipboard-1061385506.png)

![](images/clipboard-2364310941.png)

# 18. ISS-13 — Feature Vaccine Application

## 18.1 Modelo VaccineApplication

![](images/clipboard-3505346876.png)

## 18.2 Controller + routes (CRUD completo)

![](images/clipboard-1648733103.png)

![](images/clipboard-1950197462.png)

## 18.3 HTTP (REST Client)

### Get

![](images/clipboard-657301602.png)

### Create

![](images/clipboard-172691237.png)

### Update

![](images/clipboard-754704193.png)

### Delete

![](images/clipboard-2698482207.png)

## 18.4 Cableado Routes + Config

**PARCHE** — `src/routes/index.ts` **ya existe**.

![](images/clipboard-862735151.png)

**PARCHE** — `src/config/index.ts` **ya existe**.

![](images/clipboard-223990526.png)

![](images/clipboard-2619845260.png)

### Verificación

![](images/clipboard-1925911224.png)

![](images/clipboard-154626393.png)

## 18.5 Relación Consultation ↔ VaccineApplication ↔ VaccineBatch

![](images/clipboard-3469457537.png)

**PARCHE** — `src/config/index.ts`

![](images/clipboard-2348243291.png)

## 18.6 Seeder VaccineApplication

![](images/clipboard-1263590159.png)

**PARCHE** — `src/database/seeders/counts.ts`

![](images/clipboard-2692048024.png)

**PARCHE** — `src/database/seeders/index.ts`

![](images/clipboard-293207605.png)

## 18.7 Swagger VaccineApplication

![](images/clipboard-2009437.png)

**PARCHE** — `src/swagger/index.ts`

![](images/clipboard-1137841685.png)

### Cierre del ISSUE-13

![](images/clipboard-1039926034.png)

![](images/clipboard-76233482.png)

![](images/clipboard-2999077173.png)

# 19. ISS-14 — Feature Pay

## 19.1 Modelo Pay

![](images/clipboard-1218652864.png)

## 19.2 Controller + routes (CRUD completo)

![](images/clipboard-3996228418.png)

![](images/clipboard-1768167308.png)

## 19.3 HTTP (REST Client)

### Get

![](images/clipboard-706970670.png)

### Create

![](images/clipboard-2334378584.png)

### Update

![](images/clipboard-1523425293.png)

### Delete

![](images/clipboard-4203820201.png)

## 19.4 Cableado Routes + Config

![](images/clipboard-1473106379.png)

En `src/config/index.ts`, PARCHE:

![](images/clipboard-4252129329.png)

![](images/clipboard-2012716896.png)

### Verificación

![](images/clipboard-2852003077.png)

![](images/clipboard-2310445423.png)

## 19.6 Seeder Feature Pay

![](images/clipboard-2459795497.png)

**PARCHE** — `src/database/seeders/counts.ts`

![](images/clipboard-1129121361.png)

**PARCHE** — `src/database/seeders/index.ts`

![](images/clipboard-1330998266.png)

![](images/clipboard-954647926.png)

## 19.7 Swagger Feature Pay

![](images/clipboard-4057827480.png)

**PARCHE** — `src/swagger/index.ts`

![](images/clipboard-2427009335.png)

### Cierre del ISSUE-14

![](images/clipboard-4055333708.png)

![](images/clipboard-173631118.png)

![](images/clipboard-883474891.png)

# 20. ISS-08-BIS — Refactor a arquitectura en capas

## Paso 0.1 — `AppError`

![](images/clipboard-265433609.png)

## Paso 0.2 — `BaseController`

![](images/clipboard-726254034.png)

## Paso 0.3 — `with-transaction`

![](images/clipboard-1543272829.png)

## Paso 0.4 — `swagger-security`

![](images/clipboard-3264913236.png)

## Verificación

![](images/clipboard-4269250444.png)

## 1. Refactor de `owner`

### 1.1 DTOs

![](images/clipboard-4166255107.png)

![](images/clipboard-2034438327.png)

![](images/clipboard-2628893572.png)

![](images/clipboard-2874409597.png)

![](images/clipboard-2960026130.png)

### 1.2 Repository

![](images/clipboard-3893700622.png)

### 1.3 Service

![](images/clipboard-534082499.png)

### 1.4. Controller (reescrito)

![](images/clipboard-1528838957.png)

## 2.Refactor de `pet`

### 2.1DTOs

![](images/clipboard-3511652907.png)

![](images/clipboard-1754282714.png)

![](images/clipboard-1801932717.png)

![](images/clipboard-775530520.png)

![](images/clipboard-912020265.png)

### 2.2 Modelo

![](images/clipboard-3637028568.png)

### 2.3 Repository

![](images/clipboard-3582033140.png)

### 2.4 Service

![](images/clipboard-3040029060.png)

### 2.5 Controller (reescrito)

![](images/clipboard-69980659.png)

## 3.Refactor de `pet`

### 3.1 DTOs

![](images/clipboard-3610201828.png)

![](images/clipboard-1814991993.png)

![](images/clipboard-497518221.png)

![](images/clipboard-563760304.png)

![](images/clipboard-3325161589.png)

### 3.2 Modelo

![](images/clipboard-2842473627.png)

### 3.3 Repository

![](images/clipboard-53318004.png)

### 3.4 Service

![](images/clipboard-2865997427.png)

### 3.5. Controller (reescrito)

![](images/clipboard-3548405293.png)

## 4. Refactor de `Appointment`

### 4.1 DTOs

![](images/clipboard-3367533265.png)

![](images/clipboard-877892380.png)

![](images/clipboard-1401941901.png)

![](images/clipboard-1700272830.png)

![](images/clipboard-395409116.png)

### 4.2 Repository

![](images/clipboard-473234150.png)

### 4.3 Service

![](images/clipboard-329601958.png)

### 4.4. Controller (reescrito)

![](images/clipboard-3487014056.png)

## 5. Refactor de `Consultation`

### 5.1 DTOs

![](images/clipboard-2703912893.png)

![](images/clipboard-121542317.png)

![](images/clipboard-3069891884.png)

![](images/clipboard-2572755937.png)

![](images/clipboard-1230532823.png)

### 5.2 Modelo

![](images/clipboard-3928179340.png)

### 5.3 Repository

![](images/clipboard-2600796546.png)

### 5.4 Service

![](images/clipboard-1950372298.png)

### 5.5 Controller (reescrito)

![](images/clipboard-3229667852.png)

## 6. Refactor de `Vaccine`

### 6.1 DTOs

![](images/clipboard-1375685086.png)

![](images/clipboard-3428640032.png)

![](images/clipboard-1009939691.png)

![](images/clipboard-1807181406.png)

![](images/clipboard-2465370392.png)

### 6.2 Modelo

![](images/clipboard-3389550109.png)

### 6.3 Repository

![](images/clipboard-3622063016.png)

### 6.4 Service

![](images/clipboard-131600912.png)

### 6.5 Controller (reescrito)

![](images/clipboard-2877282749.png)

## 7. Refactor de `Vaccine-batch`

### 7.1 DTOs

![](images/clipboard-1398619841.png)

![](images/clipboard-2856369501.png)

![](images/clipboard-728012708.png)

![](images/clipboard-237126747.png)

![](images/clipboard-2715061164.png)

### 7.2 Modelo

![](images/clipboard-1247640367.png)

### 7.3 Repository

![](images/clipboard-1093136237.png)

### 7.4 Service

![](images/clipboard-86755392.png)

### 7.5 Controller (reescrito)

![](images/clipboard-4275869103.png)

## 8. Refactor de `Recipe`

#### 8.1 DTOs

![](images/clipboard-1426614501.png)

![](images/clipboard-2584997913.png)

![](images/clipboard-3630641685.png)

![](images/clipboard-4202697980.png)

![](images/clipboard-3026885840.png)

### 8.2 Modelo

![](images/clipboard-1763870793.png)

### 8.3 Repository

![](images/clipboard-1451454296.png)

### 8.4 Service

![](images/clipboard-2164303304.png)

### 8.5 Controller (reescrito)

![](images/clipboard-4018099649.png)

## 9. Refactor de `Vaccine-application`

### 9.1 DTOs

![](images/clipboard-2246609062.png)

![](images/clipboard-3106387477.png)

![](images/clipboard-1428199777.png)

![](images/clipboard-2539532614.png)

![](images/clipboard-1930815097.png)

### 9.2 Modelo

![](images/clipboard-1435199073.png)

### 9.3 Repository

![](images/clipboard-1131166727.png)

### 9.4 Service

![](images/clipboard-2204923758.png)

### 9.5 Controller (reescrito)

![](images/clipboard-1359903027.png)

## 10. Refactor de `Pay`

### 10.1. DTOs

![](images/clipboard-1194129298.png)

![](images/clipboard-3782991227.png)

![](images/clipboard-2992262596.png)

### 10.2 Repository

![](images/clipboard-759518905.png)

### 10.3 Service

![](images/clipboard-1774210213.png)

### 10.4. Controller (reescrito)

![](images/clipboard-3321762182.png)

# 21. ISS-15 — Auth Base (Seguridad y Modelos)

## 21.1 Dependencias y variables de entorno

```         
# Paquetes (una vez). bcryptjs ya venía de Fase I.
npm install jsonwebtoken@^9.0.3
npm install -D @types/jsonwebtoken@^9.0.10
```

![](images/clipboard-190699713.png)

Variables nuevas del `.env` **PARCHE**

```         
cat >> .env << 'EOF'
# ─────────────────────────────────────────────────────────────
# Fase II — Seguridad (JWT + RBAC)
# ─────────────────────────────────────────────────────────────
# Secreto de firma del access token (HMAC SHA-256). Mínimo 32 caracteres.
# En producción: generar con `openssl rand -base64 48` y NO versionarlo.
JWT_SECRET=storelab-lab-secret-change-me-0123456789abcdef
# Vida útil del access token en segundos (900 = 15 min).
JWT_ACCESS_TTL=900
# Vida útil del refresh token en días.
JWT_REFRESH_TTL_DAYS=7
EOF
```

![](images/clipboard-159061456.png)

## 21.2 `password.ts` — hash de contraseña y hashes de tokens

```         
: > src/shared/auth/password.ts
cat >> src/shared/auth/password.ts << 'EOF'
import { hash, compare } from "bcryptjs";

/**
 * Derivación y verificación de contraseñas (bcrypt).
 *
 * Se centraliza aquí porque lo usan tres sitios distintos y **debe** usar los
 * mismos parámetros en los tres:
 *  - el hook `beforeCreate/beforeUpdate` del modelo `User` (hash al persistir);
 *  - el service de usuarios al cambiar la contraseña;
 *  - el login, que compara la credencial en memoria (nunca la devuelve).
 *
 * Coste 12 rondas: el valor de referencia del diseño de la base de datos
 * (`docs/bd-storelab.md` §14.1). Es un compromiso entre coste de CPU del servidor
 * y coste de fuerza bruta para un atacante que obtuviera el hash.
 */
const SALT_ROUNDS = 12;

/** Devuelve el hash bcrypt de una contraseña en claro. */
export async function hashPassword(plain: string): Promise<string> {
  return hash(plain, SALT_ROUNDS);
}

/** `true` si la contraseña en claro corresponde al hash almacenado. */
export async function comparePassword(plain: string, passwordHash: string): Promise<boolean> {
  return compare(plain, passwordHash);
}

/**
 * Hash determinista (SHA-256, hex) para credenciales de **alta entropía**.
 *
 * Se usa con los refresh tokens, no con contraseñas: un token aleatorio de 64
 * bytes no es adivinable, así que no necesita un algoritmo lento; basta con
 * impedir que el valor en claro quede en la base de datos. Esto permite, además,
 * buscar por índice único (`token_hash`) en O(1).
 */
import { createHash, randomBytes } from "node:crypto";

export function sha256Hex(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Genera un token opaco no adivinable (URL-safe, 64 bytes ≈ 86 caracteres). */
export function generateOpaqueToken(): string {
  return randomBytes(64).toString("base64url");
}
EOF
```

![](images/clipboard-616184785.png)

## 21.3 `jwt.ts` — firma y verificación del access token

```         
: > src/shared/auth/jwt.ts
cat >> src/shared/auth/jwt.ts << 'EOF'
import jwt, { JwtPayload } from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { AppError } from "../errors/app-error";

/**
 * Emisión y verificación del **access token** (JWT firmado, HS256).
 *
 * Referencias (fuentes oficiales):
 *  - RFC 7519 — JSON Web Token (`sub`, `iss`, `aud`, `exp`, `iat`, `jti`).
 *  - RFC 8725 §3.1 — *Perform Algorithm Verification*: el algoritmo se fija en el
 *    código (lista permitida), nunca se toma del encabezado `alg` del token.
 *  - RFC 8725 §3.8/§3.9 — validar `iss` (emisor) y `aud` (audiencia).
 *  - RFC 6750 — el token viaja en `Authorization: Bearer <token>`.
 *
 * El access token es **autocontenido y no se persiste**: se valida con la firma.
 * La base de datos solo interviene para revalidar que el usuario sigue activo
 * (ver `authenticate`), y para los refresh tokens.
 */

const ALGORITHM = "HS256";

/** Emisor/audiencia del sistema. Sirven para rechazar tokens de otro servicio. */
export const TOKEN_ISSUER = "app-storelab-express";
export const TOKEN_AUDIENCE = "app-storelab-api";

/** Vida útil del access token. Corta por diseño (Owasp/OAuth2: token de vida corta). */
export const ACCESS_TOKEN_TTL_SECONDS = Number(process.env.JWT_ACCESS_TTL ?? 900); // 15 min

export interface AccessTokenPayload extends JwtPayload {
  sub: string;
  username: string;
  jti: string;
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new AppError(
      500,
      "JWT_SECRET no configurado (mínimo 32 caracteres). Ver .env"
    );
  }
  return secret;
}

/** Firma un access token para un usuario. */
export function signAccessToken(user: { id: number; username: string }): {
  token: string;
  expiresIn: number;
} {
  const token = jwt.sign(
    { username: user.username },
    getSecret(),
    {
      algorithm: ALGORITHM,
      subject: String(user.id),
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
      jwtid: randomUUID(),
    }
  );
  return { token, expiresIn: ACCESS_TOKEN_TTL_SECONDS };
}

/**
 * Verifica firma y *claims* y devuelve el payload.
 *
 * Se pasan las opciones explícitas (no se confía en el token): `algorithms`,
 * `issuer` y `audience`; y después se comprueban a mano `sub` y `jti`.
 *
 * Ojo: `jsonwebtoken` **no** tiene opción `require` (es de `jose`); pasarla no
 * valida nada. Por eso los claims obligatorios se verifican explícitamente.
 * Cualquier fallo se traduce a `AppError(401)` para que el middleware responda
 * **no autenticado**.
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, getSecret(), {
      algorithms: [ALGORITHM],
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
      // Tolerancia de reloj: evita 401 espurios entre máquinas desincronizadas.
      clockTolerance: 5,
    }) as JwtPayload;
  } catch {
    throw new AppError(401, "Invalid or expired access token");
  }

  // Los claims obligatorios se comprueban AQUÍ, no en `jwt.verify`.
  //
  // `jsonwebtoken` **no** admite la opción `require` (esa opción es de `jose`):
  // pasarla no valida nada. `iss`, `aud` y `exp` sí los exige `jwt.verify` con
  // las opciones de arriba; `sub` y `jti` hay que verificarle explícitamente.
  //
  //  - sin `sub` no hay identidad -> no se puede autenticar;
  //  - `sub` debe ser un entero positivo: un valor no numérico llegaría al
  //    repositorio como `NaN` y provocaría un 500 en vez de un 401;
  //  - sin `jti` se pierde la trazabilidad del token (RFC 8725).
  if (
    typeof payload.sub !== "string" ||
    !/^[1-9]\d*$/.test(payload.sub) ||
    typeof payload.jti !== "string" ||
    payload.jti.length === 0
  ) {
    throw new AppError(401, "Invalid or expired access token");
  }

  return payload as AccessTokenPayload;
}

/** Extrae el token de `Authorization: Bearer <token>` (RFC 6750). */
export function extractBearerToken(header: string | undefined): string | null {
  if (!header) return null;
  const [scheme, value] = header.split(" ");
  if (!scheme || !value || scheme.toLowerCase() !== "bearer") return null;
  return value;
}
EOF
```

![](images/clipboard-1662387462.png)

## 21.4 `resource-match.ts` — casar la petición con el recurso

```         
: > src/shared/auth/resource-match.ts
cat >> src/shared/auth/resource-match.ts << 'EOF'
/**
 * Coincidencia entre la ruta de una petición y un **recurso** almacenado.
 *
 * Un recurso se guarda como patrón (`method` + `path` con parámetros):
 *
 * ```text
 * GET  /api/productos/:id
 * ```
 *
 * Y la petición llega con el valor concreto:
 *
 * ```text
 * GET  /api/productos/42
 * ```
 *
 * Reglas de la comparación (deliberadamente estrictas):
 *  - El verbo HTTP debe coincidir exactamente.
 *  - Un segmento `:param` del patrón casa con **un** segmento cualquiera.
 *  - El resto de segmentos deben ser iguales carácter a carácter.
 *  - El número de segmentos debe coincidir (no hay comodines tipo `*`).
 *
 * Así, `/api/productos/42` **no** casa con `/api/productos` (evita que un permiso
 * de listado autorice una lectura concreta por error) y `/api/productos/42/lotes`
 * tampoco.
 */

/** Normaliza una ruta: sin cadena de consulta, sin barra final, sin duplicar `/`. */
export function normalizePath(path: string): string {
  const withoutQuery = path.split("?")[0].split("#")[0];
  const single = withoutQuery.replace(/\/{2,}/g, "/");
  const trimmed = single.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

/** `true` si `path` (concreto) casa con `pattern` (con `:param`). */
export function pathMatches(pattern: string, path: string): boolean {
  const patternParts = normalizePath(pattern).split("/");
  const pathParts = normalizePath(path).split("/");

  if (patternParts.length !== pathParts.length) return false;

  for (let i = 0; i < patternParts.length; i++) {
    const p = patternParts[i];
    if (p.startsWith(":")) continue; // parámetro: casa con cualquier segmento
    if (p !== pathParts[i]) return false;
  }
  return true;
}

/**
 * `true` si el conjunto de recursos concedidos cubre la operación solicitada.
 *
 * Es la decisión final del RBAC: se compara el par `(method, path)` de la
 * petición contra las concesiones del usuario. **Deny by default**: si ninguna
 * coincide, se devuelve `false`.
 *
 * (Referencia: `docs/bd-storelab.md` §16 — la base de datos es la única fuente
 * de verdad de la matriz de permisos; la coincidencia por patrón se hace aquí.)
 */
export function isOperationGranted(
  granted: ReadonlyArray<{ method: string; path: string }>,
  method: string,
  path: string
): boolean {
  const upper = method.toUpperCase();
  return granted.some(
    (resource) => resource.method.toUpperCase() === upper && pathMatches(resource.path, path)
  );
}
EOF
```

![](images/clipboard-1217566234.png)

## 21.5 `auth-user.ts` — la identidad en `Request`

```         
: > src/shared/auth/auth-user.ts
cat >> src/shared/auth/auth-user.ts << 'EOF'
import { Request } from "express";
import { AppError } from "../errors/app-error";

/**
 * Identidad resuelta que los middlewares de acceso dejan en la petición.
 *
 * Se guarda en `req.auth` (ver la ampliación de tipos más abajo) y la consumen:
 *  - los controllers que necesitan saber quién llama (`GET /api/sesion/perfil`);
 *  - `authorize`, para consultar los permisos efectivos del usuario.
 */
export interface AuthUser {
  id: number;
  username: string;
  email?: string;
  /** Token con el que se autenticó (útil para cerrar la sesión actual). */
  tokenId?: string;
}

/**
 * Devuelve la identidad de la petición o falla con 401.
 *
 * Lo usan los controllers de rutas con modalidad JWT (sin `authorize`): allí el
 * middleware ya garantizó que `req.auth` existe, pero el tipo es opcional, así
 * que esta función cierra el caso sin recurrir a `!`.
 */
export function requireAuthUser(req: Request): AuthUser {
  if (!req.auth) {
    throw new AppError(401, "Authentication required");
  }
  return req.auth;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      /** Identidad resuelta por el middleware `authenticate`. `undefined` = OPEN. */
      auth?: AuthUser;
    }
  }
}

export {};
EOF
```

![](images/clipboard-376531185.png)

## 21.6 `error-response.ts` y PARCHE de `BaseController`

```         
: > src/shared/http/error-response.ts
cat >> src/shared/http/error-response.ts << 'EOF'
import { Response } from "express";
import { AppError } from "../errors/app-error";

/**
 * Traduce cualquier error a una respuesta HTTP. **Único punto** del proyecto
 * donde se decide el mapeo error -> status.
 *
 * Lo usan los dos sitios que pueden fallar antes de llegar a un controller:
 *  - `BaseController.handleError` (handlers de los controllers);
 *  - los middlewares de acceso (`authenticate` / `authorize`), que responden
 *    401/403 sin pasar por un controller.
 *
 * Regla: `AppError` -> su `statusCode`; cualquier otra cosa -> **500** (y el
 * detalle solo en el cuerpo, nunca el stack).
 */
export function sendError(res: Response, error: unknown): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }
  res.status(500).json({ error: "Internal server error", detail: String(error) });
}
EOF
```

![](images/clipboard-2998404718.png)

**PARCHE** en `src/shared/http/base-controller.ts`: `handleError` delega en `sendError`.

```         
: > src/shared/http/base-controller.ts
cat >> src/shared/http/base-controller.ts << 'EOF'
import { Request, Response } from "express";
import { AppError } from "../errors/app-error";
import { sendError } from "./error-response";

/**
 * Base de los controllers HTTP.
 *
 * Aísla las tres responsabilidades puramente HTTP que, si no, se repetirían en
 * los 7 métodos de cada controller:
 *
 *  - `run`:            ejecuta el cuerpo del handler y traduce el error a HTTP.
 *  - `paramId`:        lee y valida el `:id` de la URL.
 *  - `handleError`:    mapea `AppError` a su status y lo demás a 500.
 *
 * La capa de negocio (service) no conoce `req`/`res`.
 */
export abstract class BaseController {
  /**
   * Ejecuta el cuerpo de un handler y centraliza el manejo de errores.
   *
   * Sin este helper, cada uno de los 35 métodos de los controllers tendría su
   * propio `try/catch`. Aquí el `catch` vive una sola vez.
   */
  protected async run(res: Response, work: () => Promise<void>): Promise<void> {
    try {
      await work();
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * Lee el `:id` de la URL y lo valida como entero positivo.
   *
   * Sin la validación, `GET /api/clientes/abc` llegaría al repository como
   * `Number("abc") === NaN` y devolvería un 404 engañoso en vez de un 400.
   */
  protected paramId(req: Request): number {
    const raw = req.params.id;
    const value = Array.isArray(raw) ? raw[0] : raw;

    if (!value || !/^\d+$/.test(value) || Number(value) < 1) {
      throw new AppError(400, "Invalid id: must be a positive integer");
    }
    return Number(value);
  }

  /**
   * Mapea errores: `AppError` -> su status; cualquier otro -> 500.
   *
   * La traducción vive en `sendError` porque los middlewares de acceso también
   * la necesitan: un único punto decide el mapeo error -> HTTP.
   */
  protected handleError(res: Response, error: unknown): void {
    sendError(res, error);
  }
}
EOF
```

![](images/clipboard-2627276541.png)

## 21.7 `swagger-security.ts` — seguridad reutilizable para OpenAPI

```         
: > src/shared/http/swagger-security.ts
cat >> src/shared/http/swagger-security.ts << 'EOF'
/**
 * Piezas reutilizables de OpenAPI para las **tres modalidades de acceso**.
 *
 * Centralizar aquí el esquema `bearerAuth` y las respuestas 401/403 evita repetir
 * la misma definición en los 7 módulos de Swagger (auth) y en los 5 de business.
 * Al cambiar una descripción, cambia en toda la documentación.
 *
 * Convención de uso en cada operación:
 *
 * | Modalidad | `security` |
 * |---|---|
 * | OPEN  | `openSecurity`  (arreglo vacío: no exige credencial) |
 * | JWT   | `bearerSecurity` |
 * | RBAC  | `bearerSecurity` + respuestas 401 **y** 403 |
 */

/** Esquema de seguridad (RFC 6750: `Authorization: Bearer <token>`). */
export const bearerSecurityScheme = {
  bearerAuth: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description:
      "Access token JWT obtenido en `POST /api/sesion/login`. Enviar como " +
      "`Authorization: Bearer <access_token>`. Vida útil corta (por defecto 15 min); " +
      "se renueva con `POST /api/sesion/refresh`.",
  },
};

/** `security` de un endpoint OPEN (no exige credencial). */
export const openSecurity: unknown[] = [];

/** `security` de un endpoint JWT o RBAC (exige access token válido). */
export const bearerSecurity = [{ bearerAuth: [] }];

/** Respuesta 401: no hay identidad válida (token ausente, inválido o usuario inactivo). */
export const unauthorizedResponse = {
  description:
    "401 No autenticado — falta el Bearer token, el token es inválido/expiró o el usuario está inactivo",
};

/** Respuesta 403: hay identidad, pero la matriz RBAC no concede `(method, path)`. */
export const forbiddenResponse = {
  description:
    "403 Prohibido — autenticado, pero sin concesión activa para esta operación (deny by default)",
};

/** Respuesta 400 ante un `:id` que no es entero positivo. */
export const invalidIdResponse = {
  description: "400 id inválido (debe ser un entero positivo)",
};

/** Respuesta 404 estándar. */
export const notFoundResponse = {
  description: "404 No encontrado",
};
EOF
```

![](images/clipboard-2461382437.png)

## 21.8 Los seis modelos Sequelize

```         
: > src/features/auth/users/user.model.ts
cat >> src/features/auth/users/user.model.ts << 'EOF'
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";
import { hashPassword } from "../../../shared/auth/password";

/**
 * Modelo `User` (tabla `users`) — la identidad del sistema.
 *
 * Se diferencia de los modelos de business en un punto clave: **`password` nunca
 * se guarda en claro**. El hash se calcula en los hooks, de modo que ningún
 * service, repository o seeder puede olvidarse de hacerlo.
 *
 * El algoritmo y el coste viven en `shared/auth/password.ts` (única fuente), no
 * aquí: si mañana se sube el coste, se cambia en un solo sitio.
 */
export interface UserI {
  id?: number;
  username: string;
  email: string;
  password: string;
  avatar?: string | null;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public avatar!: string | null;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    username: {
      type: DataTypes.STRING(80),
      allowNull: false,
      // `unique` con nombre explícito -> la BD nombra la restricción `uq_users_username`
      // (misma nomenclatura que el DDL de referencia en docs/bd-storelab.md §14).
      unique: "uq_users_username",
      validate: {
        notEmpty: { msg: "Username cannot be empty" },
        len: { args: [3, 80], msg: "Username must be between 3 and 80 characters" },
      },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: "uq_users_email",
      validate: {
        isEmail: { msg: "Email must be a valid email address" },
      },
    },
    password: {
      // 255: el hash bcrypt ocupa 60 y sobra margen para algoritmos futuros.
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password cannot be empty" },
      },
    },
    avatar: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "inactive",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    hooks: {
      // Los tres hooks que crean/actualizan el hash. Cualquier ruta de escritura
      // (create, update, bulkCreate del seeder) pasa por aquí: no hay forma de
      // persistir una contraseña en claro.
      beforeCreate: async (user: User) => {
        if (user.password) {
          user.password = await hashPassword(user.password);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed("password") && user.password) {
          user.password = await hashPassword(user.password);
        }
      },
      beforeBulkCreate: async (users: User[]) => {
        for (const user of users) {
          if (user.password) {
            user.password = await hashPassword(user.password);
          }
        }
      },
      // Normalización: `username` y `email` siempre en minúsculas y sin espacios.
      // Se hace antes de validar para que el `isEmail`/`len` juzgue el valor final
      // y para que el login (que compara por igualdad) sea predecible.
      beforeValidate: (user: User) => {
        if (user.username) user.username = user.username.trim().toLowerCase();
        if (user.email) user.email = user.email.trim().toLowerCase();
      },
    },
  }
);
EOF
```

![](images/clipboard-3982058127.png)

**`Role`:**

```         
: > src/features/auth/roles/role.model.ts
cat >> src/features/auth/roles/role.model.ts << 'EOF'
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

/**
 * Modelo `Role` (tabla `roles`) — agrupador lógico de responsabilidades.
 *
 * Nota de diseño: **el nombre del rol no autoriza nada**. La autorización se
 * decide por las concesiones (`resource_roles`) asociadas al rol. Un rol
 * `ADMIN` sin concesiones activas no habilita ninguna operación.
 */
export interface RoleI {
  id?: number;
  name: string;
  description?: string | null;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Role extends Model {
  public id!: number;
  public name!: string;
  public description!: string | null;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Role.init(
  {
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: "uq_roles_name",
      validate: {
        notEmpty: { msg: "Role name cannot be empty" },
      },
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "inactive",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Role",
    tableName: "roles",
    timestamps: true,
    hooks: {
      // El nombre del rol se normaliza a MAYÚSCULAS (ADMIN, SELLER, BUYER):
      // es un identificador funcional, no una etiqueta libre.
      beforeValidate: (role: Role) => {
        if (role.name) role.name = role.name.trim().toUpperCase();
      },
    },
  }
);
EOF
```

![](images/clipboard-488946956.png)

`Resource`:

```         
: > src/features/auth/resources/resource.model.ts
cat >> src/features/auth/resources/resource.model.ts << 'EOF'
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";
import { normalizePath } from "../../../shared/auth/resource-match";

/**
 * Modelo `Resource` (tabla `resources`) — un punto de acceso protegible.
 *
 * Un recurso **no** es una entidad de negocio: es el par `(method, path)`.
 * `GET /api/productos` y `POST /api/productos` son **dos recursos distintos**.
 *
 * Las rutas se guardan con el patrón, no con el valor concreto:
 * `/api/productos/:id`. Así no se crea una fila por cada identificador y la
 * coincidencia se resuelve por patrón (`shared/auth/resource-match.ts`).
 */
export interface ResourceI {
  id?: number;
  method: string;
  path: string;
  description?: string | null;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Resource extends Model {
  public id!: number;
  public method!: string;
  public path!: string;
  public description!: string | null;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Resource.init(
  {
    method: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        isIn: {
          args: [["GET", "POST", "PUT", "PATCH", "DELETE"]],
          msg: "Method must be one of GET, POST, PUT, PATCH, DELETE",
        },
      },
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Path cannot be empty" },
      },
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "inactive",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Resource",
    tableName: "resources",
    timestamps: true,
    // Clave única compuesta: el mismo verbo con distinta ruta (o al revés) son
    // recursos distintos, pero la tupla exacta no se repite.
    indexes: [
      {
        name: "uq_resources_method_path",
        unique: true,
        fields: ["method", "path"],
      },
    ],
    hooks: {
      // Normalización: verbo en mayúsculas y ruta sin barra final ni duplicados,
      // para que la comparación por patrón sea determinista.
      beforeValidate: (resource: Resource) => {
        if (resource.method) resource.method = resource.method.trim().toUpperCase();
        if (resource.path) resource.path = normalizePath(resource.path.trim());
      },
    },
  }
);
EOF
```

![](images/clipboard-89285197.png)

`RoleUser`:

```         
: > src/features/auth/role-users/role-user.model.ts
cat >> src/features/auth/role-users/role-user.model.ts << 'EOF'
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

/**
 * Modelo `RoleUser` (tabla `role_users`) — asignación N:M `User` ↔ `Role`.
 *
 * Es el **primer eslabón** de la cadena de autorización. Un usuario sin filas
 * activas aquí no tiene ningún permiso granular, aunque tenga roles asignados
 * con estado `inactive`.
 *
 * La restricción única `(user_id, role_id)` impide duplicar la asignación:
 * revocar y volver a conceder se hace cambiando `status`, no insertando filas.
 */
export interface RoleUserI {
  id?: number;
  user_id: number;
  role_id: number;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class RoleUser extends Model {
  public id!: number;
  public user_id!: number;
  public role_id!: number;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RoleUser.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "inactive",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "RoleUser",
    tableName: "role_users",
    timestamps: true,
    indexes: [
      { name: "uq_role_users_user_role", unique: true, fields: ["user_id", "role_id"] },
      { name: "ix_role_users_user_id", fields: ["user_id"] },
      { name: "ix_role_users_role_id", fields: ["role_id"] },
    ],
  }
);
EOF
```

![](images/clipboard-1826556479.png)

**`ResourceRole`:**

```         
: > src/features/auth/resource-roles/resource-role.model.ts
cat >> src/features/auth/resource-roles/resource-role.model.ts << 'EOF'
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

/**
 * Modelo `ResourceRole` (tabla `resource_roles`) — la **concesión** `Role` ↔ `Resource`.
 *
 * Esta tabla **es el permiso**. No existe una entidad `Permission`: el permiso
 * es la tupla `(rol, recurso)` materializada aquí.
 *
 * - Conceder acceso   -> insertar o reactivar una fila.
 * - Retirar acceso    -> `status = inactive`.
 * - Cambiar la matriz -> no requiere código ni despliegue.
 */
export interface ResourceRoleI {
  id?: number;
  role_id: number;
  resource_id: number;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class ResourceRole extends Model {
  public id!: number;
  public role_id!: number;
  public resource_id!: number;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ResourceRole.init(
  {
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    resource_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "inactive",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ResourceRole",
    tableName: "resource_roles",
    timestamps: true,
    indexes: [
      {
        name: "uq_resource_roles_role_resource",
        unique: true,
        fields: ["role_id", "resource_id"],
      },
      { name: "ix_resource_roles_role_id", fields: ["role_id"] },
      { name: "ix_resource_roles_resource_id", fields: ["resource_id"] },
    ],
  }
);
EOF
```

![](images/clipboard-867974266.png)

**`RefreshToken`:**

```         
: > src/features/auth/refresh-tokens/refresh-token.model.ts
cat >> src/features/auth/refresh-tokens/refresh-token.model.ts << 'EOF'
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

/**
 * Modelo `RefreshToken` (tabla `refresh_tokens`) — sesión renovable y revocable.
 *
 * Es el **único** artefacto de sesión que se persiste. El access token (JWT) es
 * autocontenido y no se guarda.
 *
 * Campos de seguridad:
 *  - `token_hash`: solo se almacena el SHA-256 del token opaco. Aunque se
 *    filtrara la tabla, no se puede reconstruir un token utilizable. Permite
 *    buscar por índice único en O(1).
 *  - `family_id`: agrupa todos los tokens derivados de un mismo login por
 *    rotación. Si un token ya rotado se reutiliza, se revoca **toda la familia**
 *    (detección de reutilización, Owasp/OAuth2).
 *  - `expires_at`: vigencia; un token vencido se trata como inválido.
 *  - `device_info`: soporte de auditoría y de listado de sesiones por dispositivo.
 *
 * Desviación deliberada: `status` predetermina **`active`**. Un token recién
 * emitido nace vigente por definición, a diferencia del resto de tablas.
 */
export interface RefreshTokenI {
  id?: number;
  user_id: number;
  token_hash: string;
  family_id: string;
  device_info?: string | null;
  expires_at: Date;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class RefreshToken extends Model {
  public id!: number;
  public user_id!: number;
  public token_hash!: string;
  public family_id!: string;
  public device_info!: string | null;
  public expires_at!: Date;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RefreshToken.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    token_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "uq_refresh_tokens_token_hash",
    },
    family_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    device_info: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      // Única tabla cuyo estado por defecto es `active` (ver doc del modelo).
      defaultValue: "active",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "RefreshToken",
    tableName: "refresh_tokens",
    timestamps: true,
    indexes: [
      { name: "ix_refresh_tokens_family_id", fields: ["family_id"] },
      { name: "ix_refresh_tokens_user_id", fields: ["user_id"] },
    ],
  }
);
EOF
```

![](images/clipboard-2610023587.png)

## 21.9 `rbac.associations.ts` — el grafo en un solo lugar

```         
: > src/features/auth/rbac.associations.ts
cat >> src/features/auth/rbac.associations.ts << 'EOF'
import { User } from "./users/user.model";
import { Role } from "./roles/role.model";
import { Resource } from "./resources/resource.model";
import { RoleUser } from "./role-users/role-user.model";
import { ResourceRole } from "./resource-roles/resource-role.model";
import { RefreshToken } from "./refresh-tokens/refresh-token.model";

/**
 * Asociaciones de las seis entidades de seguridad.
 *
 * Se declaran en un solo archivo (y no dispersas por feature) porque la
 * autorización es una **cadena** que atraviesa cinco tablas; verla junta hace
 * evidente el camino que recorre la consulta de permisos:
 *
 * ```text
 * ResourceRole ──► Role ──► RoleUser ──► (filtro por user_id)
 *        │
 *        └────────► Resource  ──► (method, path)
 * ```
 *
 * Los alias (`as`) son los que usan los `include` de los repositories, así que
 * cambiar un alias aquí obliga a revisar las consultas RBAC.
 */

// --- La concesión conoce su rol y su recurso (los dos extremos del permiso) ---
ResourceRole.belongsTo(Role, { foreignKey: "role_id", as: "role" });
ResourceRole.belongsTo(Resource, { foreignKey: "resource_id", as: "resource" });
Role.hasMany(ResourceRole, { foreignKey: "role_id", as: "resource_roles" });
Resource.hasMany(ResourceRole, { foreignKey: "resource_id", as: "resource_roles" });

// --- La asignación conoce su usuario y su rol (primer eslabón de la cadena) ---
RoleUser.belongsTo(User, { foreignKey: "user_id", as: "user" });
RoleUser.belongsTo(Role, { foreignKey: "role_id", as: "role" });
User.hasMany(RoleUser, { foreignKey: "user_id", as: "role_users" });
Role.hasMany(RoleUser, { foreignKey: "role_id", as: "role_users" });

// --- Las sesiones pertenecen a un usuario ---
RefreshToken.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasMany(RefreshToken, { foreignKey: "user_id", as: "refresh_tokens" });
EOF
```

![](images/clipboard-592154729.png)

## 21.10 Cableado de modelos en `config` y `seeders`

**PARCHE** en `src/config/index.ts`

![](images/clipboard-1844553585.png)

**PARCHE** en `src/database/seeders/index.ts`

![](images/clipboard-1691570242.png)

### Verificación

![](images/clipboard-1559557686.png)

![](images/clipboard-1281171711.png){width="400"}

# 22. ISS-16 · Feature Users (identidad y contraseña)

## 22.1 DTOs del feature

```         
: > src/features/auth/users/dto/create-user.dto.ts
cat >> src/features/auth/users/dto/create-user.dto.ts << 'EOF'
/**
 * Datos de entrada de `POST /api/usuarios`.
 *
 * `status` es opcional y por defecto `active` (como en business). Después de
 * crear el usuario, el estado solo cambia con el borrado lógico.
 */
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  avatar?: string | null;
  status?: "active" | "inactive";
}
EOF
```

![](images/clipboard-2346654192.png)

```         
: > src/features/auth/users/dto/update-user.dto.ts
cat >> src/features/auth/users/dto/update-user.dto.ts << 'EOF'
/**
 * Datos de entrada de `PUT /api/usuarios/:id` (reemplazo completo).
 *
 * Ni `password` ni `status` están aquí, a propósito:
 *  - la contraseña tiene su propia operación (`PATCH /api/usuarios/:id/password`),
 *    porque cambiar una credencial exige verificar la anterior;
 *  - el estado solo cambia con el borrado lógico (`/deactivate`).
 */
export interface UpdateUserDto {
  username: string;
  email: string;
  avatar?: string | null;
}
EOF
```

![](images/clipboard-1980786009.png)

```         
: > src/features/auth/users/dto/patch-user.dto.ts
cat >> src/features/auth/users/dto/patch-user.dto.ts << 'EOF'
import { UpdateUserDto } from "./update-user.dto";

/** Datos de entrada de `PATCH /api/usuarios/:id` (actualización parcial). */
export type PatchUserDto = Partial<UpdateUserDto>;
EOF
```

![](images/clipboard-3896750281.png)

```         
: > src/features/auth/users/dto/change-password.dto.ts
cat >> src/features/auth/users/dto/change-password.dto.ts << 'EOF'
/**
 * Datos de entrada de `PATCH /api/usuarios/:id/password`.
 *
 * Exige la contraseña **actual** además de la nueva. Es una defensa en
 * profundidad: aunque el RBAC autorice la operación, nadie puede cambiar la
 * credencial de otro usuario sin conocerla (evita que un administrador
 * comprometido rote contraseñas ajenas sin más).
 */
export interface ChangePasswordDto {
  current_password: string;
  new_password: string;
}
EOF
```

![](images/clipboard-743051883.png)

```         
: > src/features/auth/users/dto/user-response.dto.ts
cat >> src/features/auth/users/dto/user-response.dto.ts << 'EOF'
import { User, UserI } from "../user.model";

/**
 * Respuesta HTTP de un usuario.
 *
 * Regla del DTO: `password` **nunca** sale de la API. El repositorio ni siquiera
 * lo proyecta en las lecturas (`attributes: { exclude: ["password"] }`), pero el
 * mapper lo elimina igualmente por si el modelo se cargó con el hash (p. ej. al
 * cambiar la contraseña). Doble red: el tipo no lo permite y el mapper lo borra.
 */
export type UserResponseDto = Omit<UserI, "password">;

/** Mapper modelo -> DTO de respuesta (objeto plano; elimina `password`). */
export function toUserResponse(user: User): UserResponseDto {
  const { password, ...safe } = user.toJSON() as UserI & { password?: string };
  return safe;
}
EOF
```

![](images/clipboard-3082882240.png)

```         
: > src/features/auth/users/dto/index.ts
cat >> src/features/auth/users/dto/index.ts << 'EOF'
export * from "./create-user.dto";
export * from "./update-user.dto";
export * from "./patch-user.dto";
export * from "./change-password.dto";
export * from "./user-response.dto";
EOF
```

![](images/clipboard-234556272.png)

## 22.2 Repository

```         
: > src/features/auth/users/users.repository.ts
cat >> src/features/auth/users/users.repository.ts << 'EOF'
import { CreationAttributes, Op, Transaction } from "sequelize";
import { User } from "./user.model";

/**
 * Capa Repository del feature Users.
 *
 * Única que habla con Sequelize (el modelo `User`). No contiene reglas de
 * negocio ni conoce `req`/`res`.
 *
 * Detalle de seguridad: las lecturas **normales** excluyen `password` en la
 * proyección SQL. Solo dos consultas lo incluyen, ambas con nombre explícito en
 * su firma (`...WithPassword`), de modo que un `findById` cualquiera jamás puede
 * devolver el hash por descuido.
 */
export class UsersRepository {
  /** Proyección sin credencial: la que usan todas las lecturas de API. */
  private static readonly WITHOUT_PASSWORD = { exclude: ["password"] };

  /** Todos los usuarios activos (sin `password`). */
  public async findAllActive(): Promise<User[]> {
    return User.findAll({
      where: { status: "active" },
      attributes: UsersRepository.WITHOUT_PASSWORD,
    });
  }

  /** Un usuario por PK (o `null`), sin `password`. Acepta transacción. */
  public async findById(id: number, transaction?: Transaction): Promise<User | null> {
    return User.findByPk(id, {
      attributes: UsersRepository.WITHOUT_PASSWORD,
      transaction,
    });
  }

  /** Un usuario por PK **con** su hash. Uso exclusivo: cambio de contraseña. */
  public async findByIdWithPassword(id: number): Promise<User | null> {
    return User.findByPk(id);
  }

  /**
   * Un usuario por `username` **o** `email`, con su hash.
   *
   * Uso exclusivo: validación de credenciales en el login (única operación que
   * lee la credencial). Normaliza el identificador a minúsculas para casar con
   * el valor almacenado.
   */
  public async findByIdentifierWithPassword(identifier: string): Promise<User | null> {
    const value = identifier.trim().toLowerCase();
    return User.findOne({
      where: { [Op.or]: [{ username: value }, { email: value }] },
    });
  }

  /** Busca por `username` o `email` (sin `password`) para detectar duplicados. */
  public async findConflicts(username: string, email: string): Promise<User[]> {
    return User.findAll({
      where: {
        [Op.or]: [
          { username: username.trim().toLowerCase() },
          { email: email.trim().toLowerCase() },
        ],
      },
      attributes: ["id", "username", "email"],
    });
  }

  /** Inserta un usuario (el hook del modelo hashea `password`). */
  public async create(data: CreationAttributes<User>): Promise<User> {
    return User.create(data);
  }

  /** Persiste cambios sobre una instancia existente. */
  public async update(user: User, data: Partial<User>): Promise<User> {
    return user.update(data);
  }

  /** Elimina físicamente una instancia. */
  public async delete(user: User): Promise<void> {
    await user.destroy();
  }
}
EOF
```

![](images/clipboard-2986560359.png)

## 22.3 Service

```         
: > src/features/auth/users/users.service.ts
cat >> src/features/auth/users/users.service.ts << 'EOF'
import {
  ChangePasswordDto,
  CreateUserDto,
  PatchUserDto,
  UpdateUserDto,
  UserResponseDto,
  toUserResponse,
} from "./dto";
import { UsersRepository } from "./users.repository";
import { User } from "./user.model";
import { AppError } from "../../../shared/errors/app-error";
import { comparePassword } from "../../../shared/auth/password";
import { ResourceRolesService } from "../resource-roles/resource-roles.service";
import { EffectivePermissionDto } from "../resource-roles/dto";

/**
 * Capa Service del feature Users.
 *
 * Reglas de negocio: unicidad de `username`/`email`, default de `status`,
 * política de borrado lógico, cambio de credencial y consulta de permisos
 * efectivos (que delega en el feature `resource-roles`: el permiso es una
 * concesión rol-recurso, no un atributo del usuario).
 *
 * No conoce `req`/`res` ni escribe Sequelize directamente.
 */
export class UsersService {
  public constructor(
    private readonly repository: UsersRepository = new UsersRepository(),
    private readonly resourceRolesService: ResourceRolesService = new ResourceRolesService()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<UserResponseDto[]> {
    const users = await this.repository.findAllActive();
    return users.map((user) => toUserResponse(user));
  }

  public async getOne(id: number): Promise<UserResponseDto> {
    return toUserResponse(await this.findOrFail(id));
  }

  /** Permisos efectivos del usuario (cadena RBAC completa). 404 si no existe. */
  public async getEffectivePermissions(id: number): Promise<EffectivePermissionDto[]> {
    await this.findOrFail(id);
    return this.resourceRolesService.findEffectiveForUser(id);
  }

  // ================== CREATE ==================
  public async create(body: CreateUserDto): Promise<UserResponseDto> {
    await this.assertUnique(body.username, body.email);

    // Copia campo a campo: solo lo que declara el DTO llega al modelo
    // (evita *mass assignment*, p. ej. inyectar un `id` o un `status` raro).
    const user = await this.repository.create({
      username: body.username,
      email: body.email,
      password: body.password,
      avatar: body.avatar ?? null,
      status: body.status ?? "active",
    });
    return toUserResponse(user);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.findOrFail(id);
    await this.assertUnique(body.username, body.email, id);

    await this.repository.update(user, {
      username: body.username,
      email: body.email,
      avatar: body.avatar ?? null,
    });
    return toUserResponse(user);
  }

  public async updatePatch(id: number, body: PatchUserDto): Promise<UserResponseDto> {
    const user = await this.findOrFail(id);

    const username = body.username ?? user.username;
    const email = body.email ?? user.email;
    await this.assertUnique(username, email, id);

    await this.repository.update(user, body);
    return toUserResponse(user);
  }

  /**
   * Cambia la contraseña de un usuario.
   *
   * Verifica la credencial actual antes de aceptar la nueva. El hash lo vuelve a
   * calcular el hook `beforeUpdate` del modelo al detectar el campo cambiado.
   */
  public async changePassword(id: number, body: ChangePasswordDto): Promise<void> {
    if (!body.current_password || !body.new_password) {
      throw new AppError(400, "current_password and new_password are required");
    }

    const user = await this.repository.findByIdWithPassword(id);
    if (!user || user.status !== "active") {
      throw new AppError(404, "User not found");
    }

    const matches = await comparePassword(body.current_password, user.password);
    if (!matches) {
      throw new AppError(400, "Current password is incorrect");
    }

    await this.repository.update(user, { password: body.new_password });
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(id: number): Promise<void> {
    const user = await this.findOrFail(id, false);
    await this.repository.delete(user);
  }

  /** Eliminación lógica -> `status = inactive`. */
  public async deleteLogical(id: number): Promise<UserResponseDto> {
    const user = await this.findOrFail(id);
    await this.repository.update(user, { status: "inactive" });
    return toUserResponse(user);
  }

  // ================== HELPERS ==================
  /** Busca por PK y falla con 404. `onlyActive` aplica la política de borrado lógico. */
  private async findOrFail(id: number, onlyActive = true): Promise<User> {
    const user = await this.repository.findById(id);
    if (!user || (onlyActive && user.status !== "active")) {
      throw new AppError(404, "User not found");
    }
    return user;
  }

  /**
   * Comprueba que `username` y `email` no estén tomados por **otro** usuario.
   *
   * `excludeId` permite excluir al propio usuario en las actualizaciones. Se
   * hace antes de escribir para responder 409 con un mensaje útil en lugar de
   * dejar que la restricción única de la BD reviente como un 500.
   */
  private async assertUnique(
    username: string,
    email: string,
    excludeId?: number
  ): Promise<void> {
    const conflicts = await this.repository.findConflicts(username, email);
    const taken = conflicts.find((candidate) => candidate.id !== excludeId);

    if (!taken) return;
    if (taken.username === username.trim().toLowerCase()) {
      throw new AppError(409, "Username already in use");
    }
    throw new AppError(409, "Email already in use");
  }
}
EOF
```

![](images/clipboard-3591900322.png)

## 22.4 Controller

```         
: > src/features/auth/users/users.controller.ts
cat >> src/features/auth/users/users.controller.ts << 'EOF'
import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import {
  ChangePasswordDto,
  CreateUserDto,
  PatchUserDto,
  UpdateUserDto,
} from "./dto";
import { UsersService } from "./users.service";

/**
 * Capa Controller del feature Users.
 * Solo HTTP: lee `req`, llama al service y arma la respuesta.
 * El manejo de errores se delega en `run()` (ver `BaseController`).
 */
export class UsersController extends BaseController {
  public constructor(
    private readonly service: UsersService = new UsersService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const users = await this.service.getAll();
      res.status(200).json({ users });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const user = await this.service.getOne(this.paramId(req));
      res.status(200).json({ user });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const user = await this.service.create(req.body as CreateUserDto);
      res.status(201).json({ user });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const user = await this.service.updatePut(
        this.paramId(req),
        req.body as UpdateUserDto
      );
      res.status(200).json({ user });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const user = await this.service.updatePatch(
        this.paramId(req),
        req.body as PatchUserDto
      );
      res.status(200).json({ user });
    });
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "User permanently deleted", id });
    });
  }

  /** Eliminación lógica -> `status = inactive`. */
  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const user = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "User deactivated (logical delete)", user });
    });
  }

  // ================== IDENTIDAD Y PERMISOS ==================
  /** Cambio de credencial (exige la contraseña actual). */
  public async changePassword(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.changePassword(id, req.body as ChangePasswordDto);
      res.status(200).json({ message: "Password updated", id });
    });
  }

  /** Permisos efectivos del usuario: recursos concedidos por sus roles activos. */
  public async getEffectivePermissions(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const permissions = await this.service.getEffectivePermissions(this.paramId(req));
      res.status(200).json({ permissions });
    });
  }
}
EOF
```

![](images/clipboard-1163878475.png)

## 22.5 Rutas (JWT + RBAC)

```         
: > src/features/auth/users/users.routes.ts
cat >> src/features/auth/users/users.routes.ts << 'EOF'
import { Application } from "express";
import { UsersController } from "./users.controller";
import { authenticate, authorize } from "../access";

/**
 * Rutas del feature Users — **modalidad 3 (JWT + RBAC)** en todas las operaciones.
 *
 * La administración de identidades está ella misma protegida por la matriz de
 * permisos: no basta con estar autenticado, hay que tener la concesión concreta
 * (`GET /api/usuarios`, `POST /api/usuarios`, ...). El catálogo de recursos ya
 * incluye las 9 operaciones de este feature.
 */
export class UsersRoutes {
  public usersController: UsersController = new UsersController();

  public routes(app: Application): void {
    // getAll
    app
      .route("/api/usuarios")
      .get(authenticate, authorize, this.usersController.getAll.bind(this.usersController));

    // getOne
    app
      .route("/api/usuarios/:id")
      .get(authenticate, authorize, this.usersController.getOne.bind(this.usersController));

    // create
    app
      .route("/api/usuarios")
      .post(authenticate, authorize, this.usersController.create.bind(this.usersController));

    // update (PUT / PATCH)
    app
      .route("/api/usuarios/:id")
      .put(authenticate, authorize, this.usersController.updatePut.bind(this.usersController))
      .patch(authenticate, authorize, this.usersController.updatePatch.bind(this.usersController));

    // delete físico
    app
      .route("/api/usuarios/:id")
      .delete(
        authenticate,
        authorize,
        this.usersController.deletePhysical.bind(this.usersController)
      );

    // delete lógico
    app
      .route("/api/usuarios/:id/deactivate")
      .patch(
        authenticate,
        authorize,
        this.usersController.deleteLogical.bind(this.usersController)
      );

    // cambio de contraseña
    app
      .route("/api/usuarios/:id/password")
      .patch(
        authenticate,
        authorize,
        this.usersController.changePassword.bind(this.usersController)
      );

    // permisos efectivos del usuario
    app
      .route("/api/usuarios/:id/permisos")
      .get(
        authenticate,
        authorize,
        this.usersController.getEffectivePermissions.bind(this.usersController)
      );
  }
}
EOF
```

![](images/clipboard-224257632.png)

### 22.6 Seeder de usuarios canónicos

```         
: > src/features/auth/users/users.seeder.ts
cat >> src/features/auth/users/users.seeder.ts << 'EOF'
import { User } from "./user.model";
import { faker } from "@faker-js/faker";

/**
 * Seeder de usuarios (`users`).
 *
 * Crea **dos usuarios canónicos** que sostienen toda la demostración de RBAC:
 *
 * | username | password    | rol    | permisos |
 * |----------|-------------|--------|----------|
 * | `admin`  | `Admin123!` | ADMIN  | 58 recursos |
 * | `seller` | `Seller123!`| SELLER | 7 recursos |
 *
 * Si `count > 2`, se añaden usuarios aleatorios (sin rol asignado): sirven para
 * comprobar que **estar autenticado no basta**: recibirán 403 en todo.
 *
 * Las contraseñas se guardan como **hash**: las hashea el hook `beforeCreate` del
 * modelo. Idempotente por `username`.
 */
export const SEED_USERS = [
  { username: "admin", email: "admin@storelab.local", password: "Admin123!" },
  { username: "seller", email: "seller@storelab.local", password: "Seller123!" },
] as const;

export async function seedUsers(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  users: count=0, se omite");
    return 0;
  }

  let created = 0;

  for (const item of SEED_USERS) {
    const [user, wasCreated] = await User.findOrCreate({
      where: { username: item.username },
      defaults: {
        username: item.username,
        email: item.email,
        password: item.password,
        avatar: null,
        status: "active",
      },
    });
    if (wasCreated) {
      created++;
      continue;
    }
    // Reconciliación: igual que los seeders de roles y recursos, el de usuarios
    // **reactiva** los canónicos si quedaron inactivos. Así `npm run db:seed`
    // devuelve siempre el laboratorio a un estado operable.
    if (user.status !== "active") {
      await user.update({ status: "active" });
    }
  }

  const extras = Math.max(0, count - SEED_USERS.length);
  for (let i = 0; i < extras; i++) {
    const username = `user.${i}.${faker.string.alphanumeric(6)}`.toLowerCase();
    await User.create({
      username,
      email: `${username}@example.com`,
      password: "Password123!",
      avatar: null,
      status: "active",
    });
    created++;
  }

  console.log(`✅ users: insertados ${created} usuario(s) (2 canónicos + ${extras} aleatorios)`);
  return created;
}
EOF
```

![](images/clipboard-492753087.png)

## 22.7 Swagger del feature

```         
: > src/features/auth/users/users.swagger.ts
cat >> src/features/auth/users/users.swagger.ts << 'EOF'
import {
  bearerSecurity,
  forbiddenResponse,
  invalidIdResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../../shared/http/swagger-security";

/**
 * Documentación OpenAPI del feature Users.
 *
 * Modalidad de **todas** las operaciones: **JWT + RBAC**. La administración de
 * identidades está protegida por la propia matriz de permisos: además de un
 * token válido, se exige la concesión del recurso `(method, path)`.
 */
export const usersSwagger = {
  tags: [
    {
      name: "Usuarios",
      description:
        "CRUD de identidades + cambio de contraseña + permisos efectivos — **JWT + RBAC**",
    },
  ],
  paths: {
    "/api/usuarios": {
      get: {
        tags: ["Usuarios"],
        summary: "Listar usuarios activos",
        description: "JWT + RBAC — recurso `GET /api/usuarios`. Nunca devuelve `password`.",
        security: bearerSecurity,
        responses: {
          "200": { description: "Lista de usuarios (`{ users: [...] }`)" },
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
        },
      },
      post: {
        tags: ["Usuarios"],
        summary: "Crear usuario",
        description:
          "JWT + RBAC — recurso `POST /api/usuarios`. El `password` se hashea (bcrypt, 12 rondas).",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/UserCreate" } },
          },
        },
        responses: {
          "201": { description: "Usuario creado (`{ user }`)" },
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "409": { description: "`username` o `email` ya en uso" },
        },
      },
    },
    "/api/usuarios/{id}": {
      get: {
        tags: ["Usuarios"],
        summary: "Obtener usuario por id",
        description: "JWT + RBAC — recurso `GET /api/usuarios/:id`. 404 si no existe o está inactivo.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Usuario (`{ user }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
      put: {
        tags: ["Usuarios"],
        summary: "Reemplazar usuario (PUT)",
        description: "JWT + RBAC — recurso `PUT /api/usuarios/:id`. No cambia `password` ni `status`.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/UserUpdate" } },
          },
        },
        responses: {
          "200": { description: "Usuario actualizado (`{ user }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
          "409": { description: "`username` o `email` ya en uso" },
        },
      },
      patch: {
        tags: ["Usuarios"],
        summary: "Modificar usuario (PATCH)",
        description: "JWT + RBAC — recurso `PATCH /api/usuarios/:id`. Actualización parcial.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/UserPatch" } },
          },
        },
        responses: {
          "200": { description: "Usuario actualizado (`{ user }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
      delete: {
        tags: ["Usuarios"],
        summary: "Eliminar usuario (físico)",
        description: "JWT + RBAC — recurso `DELETE /api/usuarios/:id`.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado (`{ message, id }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
    },
    "/api/usuarios/{id}/deactivate": {
      patch: {
        tags: ["Usuarios"],
        summary: "Desactivar usuario (borrado lógico)",
        description:
          "JWT + RBAC — recurso `PATCH /api/usuarios/:id/deactivate`. " +
          "Efecto inmediato: la revalidación del middleware `authenticate` deja de reconocer al usuario (401).",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Desactivado (`{ message, user }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
    },
    "/api/usuarios/{id}/password": {
      patch: {
        tags: ["Usuarios"],
        summary: "Cambiar contraseña",
        description:
          "JWT + RBAC — recurso `PATCH /api/usuarios/:id/password`. " +
          "Exige `current_password`: ni un administrador puede cambiar una credencial ajena sin conocerla (defensa en profundidad).",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ChangePassword" } },
          },
        },
        responses: {
          "200": { description: "Contraseña actualizada (`{ message, id }`)" },
          "400": { description: "Faltan campos o `current_password` incorrecta" },
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
    },
    "/api/usuarios/{id}/permisos": {
      get: {
        tags: ["Usuarios"],
        summary: "Permisos efectivos del usuario",
        description:
          "JWT + RBAC — recurso `GET /api/usuarios/:id/permisos`. Ejecuta la consulta de autorización " +
          "(`resource_roles → roles → role_users → resources`, todos los eslabones activos) y devuelve el par `(method, path)` de cada permiso.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Permisos efectivos (`{ permissions: [...] }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          username: { type: "string", example: "admin" },
          email: { type: "string", format: "email", example: "admin@storelab.local" },
          avatar: { type: "string", nullable: true, example: null },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      UserCreate: {
        type: "object",
        required: ["username", "email", "password"],
        properties: {
          username: { type: "string", minLength: 3, maxLength: 80, example: "nuevo.usuario" },
          email: { type: "string", format: "email", example: "nuevo@storelab.local" },
          password: { type: "string", format: "password", minLength: 8, example: "Password123!" },
          avatar: { type: "string", nullable: true },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      UserUpdate: {
        type: "object",
        required: ["username", "email"],
        properties: {
          username: { type: "string" },
          email: { type: "string", format: "email" },
          avatar: { type: "string", nullable: true },
        },
      },
      UserPatch: {
        type: "object",
        properties: {
          username: { type: "string" },
          email: { type: "string", format: "email" },
          avatar: { type: "string", nullable: true },
        },
      },
      ChangePassword: {
        type: "object",
        required: ["current_password", "new_password"],
        properties: {
          current_password: { type: "string", format: "password" },
          new_password: { type: "string", format: "password", minLength: 8 },
        },
      },
    },
  },
};
EOF
```

![](images/clipboard-3869674321.png)

## 22.8 Pruebas HTTP

```         
: > src/features/auth/users/http/users.get.http
cat >> src/features/auth/users/http/users.get.http << 'EOF'
### Feature Users — GET ALL / GET ONE (modalidad JWT + RBAC)
### JWT + RBAC: `authenticate` (401 si no hay identidad válida) +
### `authorize` (403 si la matriz no concede el par method+path).
@baseUrl = http://localhost:4000

# @name loginAdmin
POST {{baseUrl}}/api/sesion/login
Content-Type: application/json

{
  "identifier": "admin",
  "password": "Admin123!"
}

@adminToken = {{loginAdmin.response.body.$.access_token}}
@id = 1

### getAll — recurso `GET /api/usuarios` (solo ADMIN). Nunca devuelve `password`.
GET {{baseUrl}}/api/usuarios
Authorization: Bearer {{adminToken}}

### getOne — recurso `GET /api/usuarios/:id`
GET {{baseUrl}}/api/usuarios/{{id}}
Authorization: Bearer {{adminToken}}

### 400 — id no es entero positivo (validado en BaseController.paramId)
GET {{baseUrl}}/api/usuarios/abc
Authorization: Bearer {{adminToken}}

### 401 — sin token
GET {{baseUrl}}/api/usuarios

### 403 — el rol SELLER no tiene concedido `GET /api/usuarios`
# @name loginSeller
POST {{baseUrl}}/api/sesion/login
Content-Type: application/json

{
  "identifier": "seller",
  "password": "Seller123!"
}

###
GET {{baseUrl}}/api/usuarios
Authorization: Bearer {{loginSeller.response.body.$.access_token}}
EOF
```

![](images/clipboard-3662979735.png)

```         
: > src/features/auth/users/http/users.create.http
cat >> src/features/auth/users/http/users.create.http << 'EOF'
### Feature Users — CREATE / UPDATE / DELETE (modalidad JWT + RBAC)
@baseUrl = http://localhost:4000

# @name loginAdmin
POST {{baseUrl}}/api/sesion/login
Content-Type: application/json

{
  "identifier": "admin",
  "password": "Admin123!"
}

@token = {{loginAdmin.response.body.$.access_token}}
@id = 2

### CREATE — recurso `POST /api/usuarios`. El `password` se hashea (bcrypt, 12 rondas).
POST {{baseUrl}}/api/usuarios
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "username": "nuevo.usuario",
  "email": "nuevo.usuario@storelab.local",
  "password": "Password123!",
  "avatar": null
}

### 409 — username/email ya en uso
POST {{baseUrl}}/api/usuarios
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "username": "admin",
  "email": "otro@storelab.local",
  "password": "Password123!"
}

### UPDATE PUT — reemplazo completo. No cambia `password` ni `status`.
PUT {{baseUrl}}/api/usuarios/{{id}}
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "username": "seller",
  "email": "seller@storelab.local",
  "avatar": "https://example.com/avatar.png"
}

### UPDATE PATCH — parcial
PATCH {{baseUrl}}/api/usuarios/{{id}}
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "avatar": null
}

### CAMBIO DE CONTRASEÑA — recurso `PATCH /api/usuarios/:id/password`.
### Exige la contraseña ACTUAL (defensa en profundidad, incluso para un admin).
PATCH {{baseUrl}}/api/usuarios/{{id}}/password
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "current_password": "Seller123!",
  "new_password": "Seller456!"
}

### PERMISOS EFECTIVOS del usuario — recurso `GET /api/usuarios/:id/permisos`.
### Ejecuta la cadena RBAC completa (seller -> 7 permisos).
GET {{baseUrl}}/api/usuarios/{{id}}/permisos
Authorization: Bearer {{token}}

### DELETE lógico — `status = inactive`. Efecto inmediato: sus tokens dejan de valer (401).
PATCH {{baseUrl}}/api/usuarios/{{id}}/deactivate
Authorization: Bearer {{token}}

### DELETE físico — recurso `DELETE /api/usuarios/:id`
DELETE {{baseUrl}}/api/usuarios/{{id}}
Authorization: Bearer {{token}}
EOF
```

![](images/clipboard-2292028822.png)

### Verificación

```         
npx tsc --noEmit
npm run db:seed
npm run dev
```

![](images/clipboard-915925419.png)

# 23.ISS-17 · Features Roles y Resources

## 23.1 Feature Roles — DTOs

```         
: > src/features/auth/roles/dto/create-role.dto.ts
cat >> src/features/auth/roles/dto/create-role.dto.ts << 'EOF'
/**
 * Datos de entrada de `POST /api/roles`.
 * `name` se normaliza a MAYÚSCULAS en el modelo.
 */
export interface CreateRoleDto {
  name: string;
  description?: string | null;
  status?: "active" | "inactive";
}
EOF
```

![](images/clipboard-3520684435.png)

```         
: > src/features/auth/roles/dto/update-role.dto.ts
cat >> src/features/auth/roles/dto/update-role.dto.ts << 'EOF'
/**
 * Datos de entrada de `PUT /api/roles/:id` (reemplazo completo).
 * `status` no está aquí: el estado solo cambia con el borrado lógico.
 */
export interface UpdateRoleDto {
  name: string;
  description?: string | null;
}
EOF
```

![](images/clipboard-1071276261.png)

```         
: > src/features/auth/roles/dto/patch-role.dto.ts
cat >> src/features/auth/roles/dto/patch-role.dto.ts << 'EOF'
import { UpdateRoleDto } from "./update-role.dto";

/** Datos de entrada de `PATCH /api/roles/:id` (actualización parcial). */
export type PatchRoleDto = Partial<UpdateRoleDto>;
EOF
```

![](images/clipboard-3099227667.png)

```         
: > src/features/auth/roles/dto/role-response.dto.ts
cat >> src/features/auth/roles/dto/role-response.dto.ts << 'EOF'
import { Role, RoleI } from "../role.model";

/** Respuesta HTTP de un rol. Sin campos internos: el DTO coincide con el modelo. */
export type RoleResponseDto = RoleI;

/** Mapper modelo -> DTO de respuesta (objeto plano). */
export function toRoleResponse(role: Role): RoleResponseDto {
  return role.toJSON() as RoleI;
}
EOF
```

![](images/clipboard-2891069406.png)

```         
: > src/features/auth/roles/dto/index.ts
cat >> src/features/auth/roles/dto/index.ts << 'EOF'
export * from "./create-role.dto";
export * from "./update-role.dto";
export * from "./patch-role.dto";
export * from "./role-response.dto";
EOF
```

![](images/clipboard-3002599314.png)

## 23.2 Feature Roles — repository, service, controller y rutas

```         
: > src/features/auth/roles/roles.repository.ts
cat >> src/features/auth/roles/roles.repository.ts << 'EOF'
import { CreationAttributes, Transaction } from "sequelize";
import { Role } from "./role.model";

/**
 * Capa Repository del feature Roles.
 * Única que habla con Sequelize (el modelo `Role`).
 */
export class RolesRepository {
  /** Todos los roles activos. */
  public async findAllActive(): Promise<Role[]> {
    return Role.findAll({ where: { status: "active" } });
  }

  /** Un rol por PK (o `null`). */
  public async findById(id: number, transaction?: Transaction): Promise<Role | null> {
    return Role.findByPk(id, { transaction });
  }

  /** Un rol por nombre normalizado a MAYÚSCULAS (o `null`). */
  public async findByName(name: string): Promise<Role | null> {
    return Role.findOne({ where: { name: name.trim().toUpperCase() } });
  }

  /** Inserta un rol. */
  public async create(data: CreationAttributes<Role>): Promise<Role> {
    return Role.create(data);
  }

  /** Persiste cambios sobre una instancia existente. */
  public async update(role: Role, data: Partial<Role>): Promise<Role> {
    return role.update(data);
  }

  /** Elimina físicamente una instancia. */
  public async delete(role: Role): Promise<void> {
    await role.destroy();
  }
}
EOF
```

![](images/clipboard-469340266.png)

```         
: > src/features/auth/roles/roles.service.ts
cat >> src/features/auth/roles/roles.service.ts << 'EOF'
import {
  CreateRoleDto,
  PatchRoleDto,
  RoleResponseDto,
  UpdateRoleDto,
  toRoleResponse,
} from "./dto";
import { RolesRepository } from "./roles.repository";
import { Role } from "./role.model";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature Roles.
 *
 * Regla de negocio: el nombre del rol es único. La autorización **nunca** se
 * decide por el nombre, sino por las concesiones (`resource_roles`) asociadas;
 * el nombre solo sirve para agrupar.
 */
export class RolesService {
  public constructor(
    private readonly repository: RolesRepository = new RolesRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<RoleResponseDto[]> {
    const roles = await this.repository.findAllActive();
    return roles.map((role) => toRoleResponse(role));
  }

  public async getOne(id: number): Promise<RoleResponseDto> {
    return toRoleResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreateRoleDto): Promise<RoleResponseDto> {
    if (!body.name) {
      throw new AppError(400, "name is required");
    }
    await this.assertNameAvailable(body.name);

    const role = await this.repository.create({
      name: body.name,
      description: body.description ?? null,
      status: body.status ?? "active",
    });
    return toRoleResponse(role);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdateRoleDto): Promise<RoleResponseDto> {
    const role = await this.findOrFail(id);
    await this.assertNameAvailable(body.name, id);

    await this.repository.update(role, {
      name: body.name,
      description: body.description ?? null,
    });
    return toRoleResponse(role);
  }

  public async updatePatch(id: number, body: PatchRoleDto): Promise<RoleResponseDto> {
    const role = await this.findOrFail(id);

    if (body.name) {
      await this.assertNameAvailable(body.name, id);
    }

    await this.repository.update(role, body);
    return toRoleResponse(role);
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(id: number): Promise<void> {
    const role = await this.findOrFail(id, false);
    await this.repository.delete(role);
  }

  /** Eliminación lógica -> `status = inactive`. Todos sus usuarios pierden ese rol. */
  public async deleteLogical(id: number): Promise<RoleResponseDto> {
    const role = await this.findOrFail(id);
    await this.repository.update(role, { status: "inactive" });
    return toRoleResponse(role);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number, onlyActive = true): Promise<Role> {
    const role = await this.repository.findById(id);
    if (!role || (onlyActive && role.status !== "active")) {
      throw new AppError(404, "Role not found");
    }
    return role;
  }

  private async assertNameAvailable(name: string, excludeId?: number): Promise<void> {
    const existing = await this.repository.findByName(name);
    if (existing && existing.id !== excludeId) {
      throw new AppError(409, "Role name already in use");
    }
  }
}
EOF
```

![](images/clipboard-3415315659.png)

```         
: > src/features/auth/roles/roles.controller.ts
cat >> src/features/auth/roles/roles.controller.ts << 'EOF'
import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateRoleDto, PatchRoleDto, UpdateRoleDto } from "./dto";
import { RolesService } from "./roles.service";

/**
 * Capa Controller del feature Roles.
 * Solo HTTP: lee `req`, llama al service y arma la respuesta.
 */
export class RolesController extends BaseController {
  public constructor(
    private readonly service: RolesService = new RolesService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const roles = await this.service.getAll();
      res.status(200).json({ roles });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const role = await this.service.getOne(this.paramId(req));
      res.status(200).json({ role });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const role = await this.service.create(req.body as CreateRoleDto);
      res.status(201).json({ role });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const role = await this.service.updatePut(
        this.paramId(req),
        req.body as UpdateRoleDto
      );
      res.status(200).json({ role });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const role = await this.service.updatePatch(
        this.paramId(req),
        req.body as PatchRoleDto
      );
      res.status(200).json({ role });
    });
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Role permanently deleted", id });
    });
  }

  /** Eliminación lógica -> `status = inactive`. */
  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const role = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Role deactivated (logical delete)", role });
    });
  }
}
EOF
```

![](images/clipboard-2346808713.png)

```         
: > src/features/auth/roles/roles.routes.ts
cat >> src/features/auth/roles/roles.routes.ts << 'EOF'
import { Application } from "express";
import { RolesController } from "./roles.controller";
import { authenticate, authorize } from "../access";

/** Rutas del feature Roles — **modalidad 3 (JWT + RBAC)** en todas las operaciones. */
export class RolesRoutes {
  public rolesController: RolesController = new RolesController();

  public routes(app: Application): void {
    // getAll
    app
      .route("/api/roles")
      .get(authenticate, authorize, this.rolesController.getAll.bind(this.rolesController));

    // getOne
    app
      .route("/api/roles/:id")
      .get(authenticate, authorize, this.rolesController.getOne.bind(this.rolesController));

    // create
    app
      .route("/api/roles")
      .post(authenticate, authorize, this.rolesController.create.bind(this.rolesController));

    // update (PUT / PATCH)
    app
      .route("/api/roles/:id")
      .put(authenticate, authorize, this.rolesController.updatePut.bind(this.rolesController))
      .patch(authenticate, authorize, this.rolesController.updatePatch.bind(this.rolesController));

    // delete físico
    app
      .route("/api/roles/:id")
      .delete(
        authenticate,
        authorize,
        this.rolesController.deletePhysical.bind(this.rolesController)
      );

    // delete lógico
    app
      .route("/api/roles/:id/deactivate")
      .patch(authenticate, authorize, this.rolesController.deleteLogical.bind(this.rolesController));
  }
}
EOF
```

![](images/clipboard-240056548.png)

## 23.3 Feature Roles — seeder y swagger

```         
: > src/features/auth/roles/roles.seeder.ts
cat >> src/features/auth/roles/roles.seeder.ts << 'EOF'
import { Role } from "./role.model";

/**
 * Seeder del catálogo de roles (`roles`).
 *
 * Crea los dos roles de referencia del sistema. Es determinista (no usa datos
 * aleatorios) e idempotente: `findOrCreate` por nombre y reactivación si ya
 * existía inactivo.
 *
 * Los roles nacen **sin permisos**: las concesiones las crea el seeder de
 * `resource_roles` (ADMIN recibe los 58 recursos, SELLER los 7 de operación).
 */
export const SEED_ROLES = [
  { name: "ADMIN", description: "Administración del sistema: gestiona usuarios, roles y permisos" },
  { name: "SELLER", description: "Operación de ventas: consulta catálogo y registra ventas" },
] as const;

export async function seedRoles(): Promise<number> {
  let created = 0;

  for (const item of SEED_ROLES) {
    const [role, wasCreated] = await Role.findOrCreate({
      where: { name: item.name },
      defaults: { name: item.name, description: item.description, status: "active" },
    });

    if (wasCreated) {
      created++;
      continue;
    }
    if (role.status !== "active") {
      await role.update({ status: "active" });
    }
  }

  console.log(`✅ roles: catálogo reconciliado (${SEED_ROLES.length} roles, ${created} nuevos)`);
  return created;
}
EOF
```

![](images/clipboard-604589822.png)

```         
: > src/features/auth/roles/roles.swagger.ts
cat >> src/features/auth/roles/roles.swagger.ts << 'EOF'
import {
  bearerSecurity,
  forbiddenResponse,
  invalidIdResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../../shared/http/swagger-security";

/**
 * Documentación OpenAPI del feature Roles.
 *
 * Modalidad: **JWT + RBAC** en todas las operaciones.
 *
 * Recordatorio de diseño: el **nombre** del rol no autoriza nada. Un rol
 * `ADMIN` sin concesiones activas no habilita ninguna operación; la autorización
 * se decide por las filas de `resource_roles`.
 */
export const rolesSwagger = {
  tags: [
    { name: "Roles", description: "CRUD de roles (agrupadores de permisos) — **JWT + RBAC**" },
  ],
  paths: {
    "/api/roles": {
      get: {
        tags: ["Roles"],
        summary: "Listar roles activos",
        description: "JWT + RBAC — recurso `GET /api/roles`.",
        security: bearerSecurity,
        responses: {
          "200": { description: "Lista de roles (`{ roles: [...] }`)" },
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
        },
      },
      post: {
        tags: ["Roles"],
        summary: "Crear rol",
        description:
          "JWT + RBAC — recurso `POST /api/roles`. El rol nace **sin permisos**: se conceden con `POST /api/concesiones-rol`.",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/RoleCreate" } },
          },
        },
        responses: {
          "201": { description: "Rol creado (`{ role }`)" },
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "409": { description: "Nombre de rol ya en uso" },
        },
      },
    },
    "/api/roles/{id}": {
      get: {
        tags: ["Roles"],
        summary: "Obtener rol por id",
        description: "JWT + RBAC — recurso `GET /api/roles/:id`.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Rol (`{ role }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
      put: {
        tags: ["Roles"],
        summary: "Reemplazar rol (PUT)",
        description: "JWT + RBAC — recurso `PUT /api/roles/:id`.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/RoleUpdate" } },
          },
        },
        responses: {
          "200": { description: "Rol actualizado (`{ role }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
      patch: {
        tags: ["Roles"],
        summary: "Modificar rol (PATCH)",
        description: "JWT + RBAC — recurso `PATCH /api/roles/:id`.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/RolePatch" } },
          },
        },
        responses: {
          "200": { description: "Rol actualizado (`{ role }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
      delete: {
        tags: ["Roles"],
        summary: "Eliminar rol (físico)",
        description: "JWT + RBAC — recurso `DELETE /api/roles/:id`.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado (`{ message, id }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
    },
    "/api/roles/{id}/deactivate": {
      patch: {
        tags: ["Roles"],
        summary: "Desactivar rol (borrado lógico)",
        description:
          "JWT + RBAC — recurso `PATCH /api/roles/:id/deactivate`. " +
          "Efecto inmediato: todos los usuarios de ese rol pierden sus permisos (eslabón `roles` inactivo -> DENY).",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Desactivado (`{ message, role }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
    },
  },
  components: {
    schemas: {
      Role: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "SELLER" },
          description: { type: "string", nullable: true },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      RoleCreate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "BUYER" },
          description: { type: "string", nullable: true },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      RoleUpdate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string", nullable: true },
        },
      },
      RolePatch: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string", nullable: true },
        },
      },
    },
  },
};
EOF
```

![](images/clipboard-4252200040.png)

## 23.4 Feature Resources — DTOs y catálogo semilla (103 Recursos)

```         
: > src/features/auth/resources/dto/create-resource.dto.ts
cat >> src/features/auth/resources/dto/create-resource.dto.ts << 'EOF'
/**
 * Datos de entrada de `POST /api/recursos`.
 *
 * `path` se guarda con el patrón (`/api/productos/:id`), no con un valor concreto.
 */
export interface CreateResourceDto {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description?: string | null;
  status?: "active" | "inactive";
}
EOF
```

![](images/clipboard-2668791153.png)

```         
: > src/features/auth/resources/dto/update-resource.dto.ts
cat >> src/features/auth/resources/dto/update-resource.dto.ts << 'EOF'
/**
 * Datos de entrada de `PUT /api/recursos/:id` (reemplazo completo).
 * `status` no está aquí: el estado solo cambia con el borrado lógico.
 */
export interface UpdateResourceDto {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description?: string | null;
}
EOF
```

![](images/clipboard-905232845.png)

```         
: > src/features/auth/resources/dto/patch-resource.dto.ts
cat >> src/features/auth/resources/dto/patch-resource.dto.ts << 'EOF'
import { UpdateResourceDto } from "./update-resource.dto";

/** Datos de entrada de `PATCH /api/recursos/:id` (actualización parcial). */
export type PatchResourceDto = Partial<UpdateResourceDto>;
EOF
```

![](images/clipboard-1497297951.png)

```         
: > src/features/auth/resources/dto/resource-response.dto.ts
cat >> src/features/auth/resources/dto/resource-response.dto.ts << 'EOF'
import { Resource, ResourceI } from "../resource.model";

/**
 * Respuesta HTTP de un recurso. `resources` no tiene campos internos, así que el
 * DTO coincide con el modelo; se declara igualmente para que la API quede
 * desacoplada del modelo (cambiar el modelo no cambia el contrato por accidente).
 */
export type ResourceResponseDto = ResourceI;

/** Mapper modelo -> DTO de respuesta (objeto plano). */
export function toResourceResponse(resource: Resource): ResourceResponseDto {
  return resource.toJSON() as ResourceI;
}
EOF
```

![](images/clipboard-2507698043.png)

```         
: > src/features/auth/resources/dto/index.ts
cat >> src/features/auth/resources/dto/index.ts << 'EOF'
export * from "./create-resource.dto";
export * from "./update-resource.dto";
export * from "./patch-resource.dto";
export * from "./resource-response.dto";
EOF
```

![](images/clipboard-1022032716.png)

**El catálogo** — fuente única de los 103 recursos:

```         
: > src/features/auth/resources/resource-catalog.ts
cat >> src/features/auth/resources/resource-catalog.ts << 'EOF'
/**
 * Catálogo de los **58 recursos** del sistema (fuente única).
 *
 * Un recurso es un par `(method, path)`; un permiso es la concesión de un
 * recurso a un rol. Este archivo es la definición en código del catálogo que
 * puebla el seeder de `resources` y del que se derivan las concesiones de los
 * roles (`ADMIN` recibe los 58; `SELLER`, los 7 marcados con `seller: true`).
 *
 * Composición (referencia: `docs/bd-storelab.md` §21):
 *
 * | Grupo                                        | Recursos |
 * |----------------------------------------------|---------:|
 * | Clientes                                     | 7 |
 * | Tipos de producto                            | 7 |
 * | Productos                                    | 7 |
 * | Ventas                                       | 3 |
 * | Detalle de ventas                            | 1 |
 * | Usuarios (+ cambio de contraseña + permisos) | 9 |
 * | Roles                                        | 7 |
 * | Recursos                                     | 7 |
 * | Asignaciones usuario-rol                     | 5 |
 * | Concesiones rol-recurso                      | 5 |
 * | **Total**                                    | **58** |
 *
 * Nota: las operaciones de sesión (`/api/sesion/*` y `/api/sesiones/*`) **no**
 * son recursos RBAC. Son las modalidades OPEN y JWT: no dependen de la matriz
 * de permisos, sino de poseer (o no) una identidad válida.
 */
export interface CatalogResource {
  method: string;
  path: string;
  description: string;
  /** `true` si el rol `SELLER` recibe esta concesión (7 en total). */
  seller?: boolean;
}

export const RESOURCE_CATALOG: readonly CatalogResource[] = [
  // ── Clientes (7) ──────────────────────────────────────────────
  { method: "GET", path: "/api/clientes", description: "Listar clientes", seller: true },
  { method: "GET", path: "/api/clientes/:id", description: "Consultar cliente", seller: true },
  { method: "POST", path: "/api/clientes", description: "Crear cliente" },
  { method: "PUT", path: "/api/clientes/:id", description: "Reemplazar cliente" },
  { method: "PATCH", path: "/api/clientes/:id", description: "Modificar cliente" },
  { method: "DELETE", path: "/api/clientes/:id", description: "Eliminar cliente" },
  { method: "PATCH", path: "/api/clientes/:id/deactivate", description: "Desactivar cliente" },

  // ── Tipos de producto (7) ─────────────────────────────────────
  { method: "GET", path: "/api/tipos-producto", description: "Listar tipos de producto" },
  { method: "GET", path: "/api/tipos-producto/:id", description: "Consultar tipo de producto" },
  { method: "POST", path: "/api/tipos-producto", description: "Crear tipo de producto" },
  { method: "PUT", path: "/api/tipos-producto/:id", description: "Reemplazar tipo de producto" },
  { method: "PATCH", path: "/api/tipos-producto/:id", description: "Modificar tipo de producto" },
  { method: "DELETE", path: "/api/tipos-producto/:id", description: "Eliminar tipo de producto" },
  {
    method: "PATCH",
    path: "/api/tipos-producto/:id/deactivate",
    description: "Desactivar tipo de producto",
  },

  // ── Productos (7) ─────────────────────────────────────────────
  { method: "GET", path: "/api/productos", description: "Listar productos", seller: true },
  { method: "GET", path: "/api/productos/:id", description: "Consultar producto", seller: true },
  { method: "POST", path: "/api/productos", description: "Crear producto" },
  { method: "PUT", path: "/api/productos/:id", description: "Reemplazar producto" },
  { method: "PATCH", path: "/api/productos/:id", description: "Modificar producto" },
  { method: "DELETE", path: "/api/productos/:id", description: "Eliminar producto" },
  { method: "PATCH", path: "/api/productos/:id/deactivate", description: "Desactivar producto" },

  // ── Ventas (3) ────────────────────────────────────────────────
  { method: "GET", path: "/api/ventas", description: "Listar ventas", seller: true },
  { method: "GET", path: "/api/ventas/:id", description: "Consultar venta", seller: true },
  { method: "POST", path: "/api/ventas", description: "Registrar venta", seller: true },

  // ── Detalle de ventas (1) ─────────────────────────────────────
  { method: "GET", path: "/api/detalle-ventas", description: "Listar detalle de ventas" },

  // ── Usuarios (9) ──────────────────────────────────────────────
  { method: "GET", path: "/api/usuarios", description: "Listar usuarios" },
  { method: "GET", path: "/api/usuarios/:id", description: "Consultar usuario" },
  { method: "POST", path: "/api/usuarios", description: "Crear usuario" },
  { method: "PUT", path: "/api/usuarios/:id", description: "Reemplazar usuario" },
  { method: "PATCH", path: "/api/usuarios/:id", description: "Modificar usuario" },
  { method: "DELETE", path: "/api/usuarios/:id", description: "Eliminar usuario" },
  { method: "PATCH", path: "/api/usuarios/:id/deactivate", description: "Desactivar usuario" },
  {
    method: "PATCH",
    path: "/api/usuarios/:id/password",
    description: "Cambiar contraseña de usuario",
  },
  {
    method: "GET",
    path: "/api/usuarios/:id/permisos",
    description: "Consultar permisos efectivos del usuario",
  },

  // ── Roles (7) ─────────────────────────────────────────────────
  { method: "GET", path: "/api/roles", description: "Listar roles" },
  { method: "GET", path: "/api/roles/:id", description: "Consultar rol" },
  { method: "POST", path: "/api/roles", description: "Crear rol" },
  { method: "PUT", path: "/api/roles/:id", description: "Reemplazar rol" },
  { method: "PATCH", path: "/api/roles/:id", description: "Modificar rol" },
  { method: "DELETE", path: "/api/roles/:id", description: "Eliminar rol" },
  { method: "PATCH", path: "/api/roles/:id/deactivate", description: "Desactivar rol" },

  // ── Recursos (7) ──────────────────────────────────────────────
  { method: "GET", path: "/api/recursos", description: "Listar recursos" },
  { method: "GET", path: "/api/recursos/:id", description: "Consultar recurso" },
  { method: "POST", path: "/api/recursos", description: "Crear recurso" },
  { method: "PUT", path: "/api/recursos/:id", description: "Reemplazar recurso" },
  { method: "PATCH", path: "/api/recursos/:id", description: "Modificar recurso" },
  { method: "DELETE", path: "/api/recursos/:id", description: "Eliminar recurso" },
  { method: "PATCH", path: "/api/recursos/:id/deactivate", description: "Desactivar recurso" },

  // ── Asignaciones usuario ↔ rol (5) ────────────────────────────
  { method: "GET", path: "/api/asignaciones-rol", description: "Listar asignaciones usuario-rol" },
  {
    method: "GET",
    path: "/api/asignaciones-rol/:id",
    description: "Consultar asignación usuario-rol",
  },
  {
    method: "POST",
    path: "/api/asignaciones-rol",
    description: "Asignar rol a usuario",
  },
  {
    method: "PATCH",
    path: "/api/asignaciones-rol/:id/deactivate",
    description: "Retirar rol a usuario",
  },
  {
    method: "PATCH",
    path: "/api/asignaciones-rol/:id/reactivate",
    description: "Reactivar rol a usuario",
  },

  // ── Concesiones rol ↔ recurso (5) ─────────────────────────────
  { method: "GET", path: "/api/concesiones-rol", description: "Listar concesiones rol-recurso" },
  {
    method: "GET",
    path: "/api/concesiones-rol/:id",
    description: "Consultar concesión rol-recurso",
  },
  {
    method: "POST",
    path: "/api/concesiones-rol",
    description: "Conceder recurso a rol",
  },
  {
    method: "PATCH",
    path: "/api/concesiones-rol/:id/deactivate",
    description: "Retirar recurso a rol",
  },
  {
    method: "PATCH",
    path: "/api/concesiones-rol/:id/reactivate",
    description: "Reactivar recurso a rol",
  },
];

/** Recursos que recibe el rol `SELLER` (7). Derivado del catálogo, no duplicado. */
export const SELLER_RESOURCES: readonly CatalogResource[] = RESOURCE_CATALOG.filter(
  (resource) => resource.seller === true
);
EOF
```

![](images/clipboard-428920036.png)

## 23.5 Feature Resources — repository, service, controller y rutas

```         
: > src/features/auth/resources/resources.repository.ts
cat >> src/features/auth/resources/resources.repository.ts << 'EOF'
import { CreationAttributes, Transaction } from "sequelize";
import { Resource } from "./resource.model";
import { normalizePath } from "../../../shared/auth/resource-match";

/**
 * Capa Repository del feature Resources.
 * Única que habla con Sequelize (el modelo `Resource`).
 */
export class ResourcesRepository {
  /** Todos los recursos activos. */
  public async findAllActive(): Promise<Resource[]> {
    return Resource.findAll({ where: { status: "active" } });
  }

  /** Un recurso por PK (o `null`). */
  public async findById(id: number, transaction?: Transaction): Promise<Resource | null> {
    return Resource.findByPk(id, { transaction });
  }

  /** Un recurso por su par `(method, path)` (o `null`). */
  public async findByOperation(method: string, path: string): Promise<Resource | null> {
    return Resource.findOne({
      where: { method: method.trim().toUpperCase(), path: normalizePath(path.trim()) },
    });
  }

  /** Inserta un recurso. */
  public async create(data: CreationAttributes<Resource>): Promise<Resource> {
    return Resource.create(data);
  }

  /** Persiste cambios sobre una instancia existente. */
  public async update(resource: Resource, data: Partial<Resource>): Promise<Resource> {
    return resource.update(data);
  }

  /** Elimina físicamente una instancia. */
  public async delete(resource: Resource): Promise<void> {
    await resource.destroy();
  }
}
EOF
```

![](images/clipboard-2654962175.png)

```         
: > src/features/auth/resources/resources.service.ts
cat >> src/features/auth/resources/resources.service.ts << 'EOF'
import {
  CreateResourceDto,
  PatchResourceDto,
  ResourceResponseDto,
  UpdateResourceDto,
  toResourceResponse,
} from "./dto";
import { ResourcesRepository } from "./resources.repository";
import { Resource } from "./resource.model";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature Resources.
 *
 * Reglas de negocio: la tupla `(method, path)` es única. Se comprueba antes de
 * escribir para responder 409 con un mensaje útil en lugar de dejar reventar la
 * restricción única de la base de datos como 500.
 */
export class ResourcesService {
  public constructor(
    private readonly repository: ResourcesRepository = new ResourcesRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<ResourceResponseDto[]> {
    const resources = await this.repository.findAllActive();
    return resources.map((resource) => toResourceResponse(resource));
  }

  public async getOne(id: number): Promise<ResourceResponseDto> {
    return toResourceResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreateResourceDto): Promise<ResourceResponseDto> {
    if (!body.method || !body.path) {
      throw new AppError(400, "method and path are required");
    }
    await this.assertOperationAvailable(body.method, body.path);

    const resource = await this.repository.create({
      method: body.method,
      path: body.path,
      description: body.description ?? null,
      status: body.status ?? "active",
    });
    return toResourceResponse(resource);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdateResourceDto): Promise<ResourceResponseDto> {
    const resource = await this.findOrFail(id);
    await this.assertOperationAvailable(body.method, body.path, id);

    await this.repository.update(resource, {
      method: body.method,
      path: body.path,
      description: body.description ?? null,
    });
    return toResourceResponse(resource);
  }

  public async updatePatch(id: number, body: PatchResourceDto): Promise<ResourceResponseDto> {
    const resource = await this.findOrFail(id);

    const method = body.method ?? resource.method;
    const path = body.path ?? resource.path;
    await this.assertOperationAvailable(method, path, id);

    await this.repository.update(resource, body);
    return toResourceResponse(resource);
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(id: number): Promise<void> {
    const resource = await this.findOrFail(id, false);
    await this.repository.delete(resource);
  }

  /** Eliminación lógica -> `status = inactive`. Deshabilita el punto de acceso. */
  public async deleteLogical(id: number): Promise<ResourceResponseDto> {
    const resource = await this.findOrFail(id);
    await this.repository.update(resource, { status: "inactive" });
    return toResourceResponse(resource);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number, onlyActive = true): Promise<Resource> {
    const resource = await this.repository.findById(id);
    if (!resource || (onlyActive && resource.status !== "active")) {
      throw new AppError(404, "Resource not found");
    }
    return resource;
  }

  /** 409 si otro recurso ya declara el mismo `(method, path)`. */
  private async assertOperationAvailable(
    method: string,
    path: string,
    excludeId?: number
  ): Promise<void> {
    const existing = await this.repository.findByOperation(method, path);
    if (existing && existing.id !== excludeId) {
      throw new AppError(409, `Resource ${method.toUpperCase()} ${path} already exists`);
    }
  }
}
EOF
```

![](images/clipboard-778348576.png)

```         
: > src/features/auth/resources/resources.controller.ts
cat >> src/features/auth/resources/resources.controller.ts << 'EOF'
import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import {
  CreateResourceDto,
  PatchResourceDto,
  UpdateResourceDto,
} from "./dto";
import { ResourcesService } from "./resources.service";

/**
 * Capa Controller del feature Resources.
 * Solo HTTP: lee `req`, llama al service y arma la respuesta.
 */
export class ResourcesController extends BaseController {
  public constructor(
    private readonly service: ResourcesService = new ResourcesService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const resources = await this.service.getAll();
      res.status(200).json({ resources });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const resource = await this.service.getOne(this.paramId(req));
      res.status(200).json({ resource });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const resource = await this.service.create(req.body as CreateResourceDto);
      res.status(201).json({ resource });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const resource = await this.service.updatePut(
        this.paramId(req),
        req.body as UpdateResourceDto
      );
      res.status(200).json({ resource });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const resource = await this.service.updatePatch(
        this.paramId(req),
        req.body as PatchResourceDto
      );
      res.status(200).json({ resource });
    });
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Resource permanently deleted", id });
    });
  }

  /** Eliminación lógica -> `status = inactive`. */
  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const resource = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Resource deactivated (logical delete)", resource });
    });
  }
}
EOF
```

![](images/clipboard-3142339613.png)

```         
: > src/features/auth/resources/resources.routes.ts
cat >> src/features/auth/resources/resources.routes.ts << 'EOF'
import { Application } from "express";
import { ResourcesController } from "./resources.controller";
import { authenticate, authorize } from "../access";

/** Rutas del feature Resources — **modalidad 3 (JWT + RBAC)** en todas las operaciones. */
export class ResourcesRoutes {
  public resourcesController: ResourcesController = new ResourcesController();

  public routes(app: Application): void {
    // getAll
    app
      .route("/api/recursos")
      .get(authenticate, authorize, this.resourcesController.getAll.bind(this.resourcesController));

    // getOne
    app
      .route("/api/recursos/:id")
      .get(authenticate, authorize, this.resourcesController.getOne.bind(this.resourcesController));

    // create
    app
      .route("/api/recursos")
      .post(authenticate, authorize, this.resourcesController.create.bind(this.resourcesController));

    // update (PUT / PATCH)
    app
      .route("/api/recursos/:id")
      .put(
        authenticate,
        authorize,
        this.resourcesController.updatePut.bind(this.resourcesController)
      )
      .patch(
        authenticate,
        authorize,
        this.resourcesController.updatePatch.bind(this.resourcesController)
      );

    // delete físico
    app
      .route("/api/recursos/:id")
      .delete(
        authenticate,
        authorize,
        this.resourcesController.deletePhysical.bind(this.resourcesController)
      );

    // delete lógico
    app
      .route("/api/recursos/:id/deactivate")
      .patch(
        authenticate,
        authorize,
        this.resourcesController.deleteLogical.bind(this.resourcesController)
      );
  }
}
EOF
```

![](images/clipboard-2883708873.png)

## 23.6 Feature Resources — seeder y swagger

```         
: > src/features/auth/resources/resources.seeder.ts
cat >> src/features/auth/resources/resources.seeder.ts << 'EOF'
import { Resource } from "./resource.model";
import { RESOURCE_CATALOG } from "./resource-catalog";

/**
 * Seeder del catálogo de recursos (`resources`).
 *
 * A diferencia de los seeders de business, este **no usa datos aleatorios**: los
 * 58 recursos son un catálogo determinista definido en `resource-catalog.ts`.
 * Es idempotente por partida doble: `findOrCreate` por `(method, path)` y
 * reactivación de las filas que ya existían inactivas, de modo que volver a
 * ejecutarlo reconcilia el catálogo sin duplicar ni perder concesiones.
 */
export async function seedResources(): Promise<number> {
  let created = 0;

  for (const item of RESOURCE_CATALOG) {
    const [resource, wasCreated] = await Resource.findOrCreate({
      where: { method: item.method, path: item.path },
      defaults: {
        method: item.method,
        path: item.path,
        description: item.description,
        status: "active",
      },
    });

    if (wasCreated) {
      created++;
      continue;
    }
    if (resource.status !== "active") {
      await resource.update({ status: "active" });
    }
  }

  console.log(
    `✅ resources: catálogo reconciliado (${RESOURCE_CATALOG.length} recursos, ${created} nuevos)`
  );
  return created;
}
EOF
```

![](images/clipboard-2309407445.png)

```         
: > src/features/auth/resources/resources.swagger.ts
cat >> src/features/auth/resources/resources.swagger.ts << 'EOF'
import {
  bearerSecurity,
  forbiddenResponse,
  invalidIdResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../../shared/http/swagger-security";

/**
 * Documentación OpenAPI del feature Resources.
 *
 * Modalidad: **JWT + RBAC** en todas las operaciones.
 *
 * Un recurso es un par `(method, path)` con la ruta **en patrón**
 * (`/api/productos/:id`). `GET` y `POST` sobre la misma ruta son dos recursos
 * distintos y se conceden por separado.
 */
export const resourcesSwagger = {
  tags: [
    {
      name: "Recursos",
      description:
        "Catálogo de puntos de acceso protegibles: par `(method, path)` — **JWT + RBAC**",
    },
  ],
  paths: {
    "/api/recursos": {
      get: {
        tags: ["Recursos"],
        summary: "Listar recursos activos",
        description: "JWT + RBAC — recurso `GET /api/recursos`.",
        security: bearerSecurity,
        responses: {
          "200": { description: "Lista de recursos (`{ resources: [...] }`)" },
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
        },
      },
      post: {
        tags: ["Recursos"],
        summary: "Crear recurso",
        description:
          "JWT + RBAC — recurso `POST /api/recursos`. Alta de un nuevo punto de acceso; concederlo a un rol no requiere desplegar código.",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ResourceCreate" } },
          },
        },
        responses: {
          "201": { description: "Recurso creado (`{ resource }`)" },
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "409": { description: "La tupla `(method, path)` ya existe" },
        },
      },
    },
    "/api/recursos/{id}": {
      get: {
        tags: ["Recursos"],
        summary: "Obtener recurso por id",
        description: "JWT + RBAC — recurso `GET /api/recursos/:id`.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Recurso (`{ resource }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
      put: {
        tags: ["Recursos"],
        summary: "Reemplazar recurso (PUT)",
        description: "JWT + RBAC — recurso `PUT /api/recursos/:id`.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ResourceUpdate" } },
          },
        },
        responses: {
          "200": { description: "Recurso actualizado (`{ resource }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
      patch: {
        tags: ["Recursos"],
        summary: "Modificar recurso (PATCH)",
        description: "JWT + RBAC — recurso `PATCH /api/recursos/:id`.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ResourcePatch" } },
          },
        },
        responses: {
          "200": { description: "Recurso actualizado (`{ resource }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
      delete: {
        tags: ["Recursos"],
        summary: "Eliminar recurso (físico)",
        description: "JWT + RBAC — recurso `DELETE /api/recursos/:id`.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado (`{ message, id }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
    },
    "/api/recursos/{id}/deactivate": {
      patch: {
        tags: ["Recursos"],
        summary: "Desactivar recurso (borrado lógico)",
        description:
          "JWT + RBAC — recurso `PATCH /api/recursos/:id/deactivate`. " +
          "Efecto inmediato: ningún rol puede autorizar ese punto de acceso (eslabón `resources` inactivo -> DENY).",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Desactivado (`{ message, resource }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
    },
  },
  components: {
    schemas: {
      Resource: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          method: { type: "string", enum: ["GET", "POST", "PUT", "PATCH", "DELETE"], example: "GET" },
          path: { type: "string", example: "/api/productos/:id" },
          description: { type: "string", nullable: true },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ResourceCreate: {
        type: "object",
        required: ["method", "path"],
        properties: {
          method: { type: "string", enum: ["GET", "POST", "PUT", "PATCH", "DELETE"] },
          path: { type: "string", example: "/api/reportes/:id" },
          description: { type: "string", nullable: true },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      ResourceUpdate: {
        type: "object",
        required: ["method", "path"],
        properties: {
          method: { type: "string", enum: ["GET", "POST", "PUT", "PATCH", "DELETE"] },
          path: { type: "string" },
          description: { type: "string", nullable: true },
        },
      },
      ResourcePatch: {
        type: "object",
        properties: {
          method: { type: "string", enum: ["GET", "POST", "PUT", "PATCH", "DELETE"] },
          path: { type: "string" },
          description: { type: "string", nullable: true },
        },
      },
    },
  },
};
EOF
```

![](images/clipboard-377722276.png)

## 23.7 Pruebas HTTP

```         
: > src/features/auth/roles/http/roles.get.http
cat >> src/features/auth/roles/http/roles.get.http << 'EOF'
### Feature Roles — CRUD (modalidad JWT + RBAC)
### El NOMBRE del rol no autoriza nada: la autorización son las filas de `resource_roles`.
@baseUrl = http://localhost:4000

# @name loginAdmin
POST {{baseUrl}}/api/sesion/login
Content-Type: application/json

{
  "identifier": "admin",
  "password": "Admin123!"
}

# @name loginSeller
POST {{baseUrl}}/api/sesion/login
Content-Type: application/json

{
  "identifier": "seller",
  "password": "Seller123!"
}

@token = {{loginAdmin.response.body.$.access_token}}

### getAll — recurso `GET /api/roles` (ADMIN y SELLER)
GET {{baseUrl}}/api/roles
Authorization: Bearer {{token}}

### getOne
GET {{baseUrl}}/api/roles/1
Authorization: Bearer {{token}}

### CREATE — nace SIN permisos
POST {{baseUrl}}/api/roles
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "AUDITOR",
  "description": "Solo lectura de catálogo"
}

### UPDATE PUT
PUT {{baseUrl}}/api/roles/3
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "AUDITOR",
  "description": "Solo lectura de catálogo y ventas"
}

### UPDATE PATCH
PATCH {{baseUrl}}/api/roles/3
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "description": "Auditoría operativa"
}

### DELETE lógico — efecto inmediato: todos sus usuarios pierden esos permisos (403)
PATCH {{baseUrl}}/api/roles/3/deactivate
Authorization: Bearer {{token}}

### DELETE físico
DELETE {{baseUrl}}/api/roles/3
Authorization: Bearer {{token}}

### 403 — SELLER no tiene concedido `GET /api/roles`
GET {{baseUrl}}/api/roles
Authorization: Bearer {{loginSeller.response.body.$.access_token}}
EOF
```

![](images/clipboard-3986380039.png)

```         
: > src/features/auth/resources/http/resources.get.http
cat >> src/features/auth/resources/http/resources.get.http << 'EOF'
### Feature Resources — catálogo de puntos de acceso (modalidad JWT + RBAC)
### Un recurso es el par (method, path) con la ruta EN PATRÓN: /api/productos/:id
### GET y POST sobre la misma ruta son DOS recursos distintos.
@baseUrl = http://localhost:4000

# @name loginAdmin
POST {{baseUrl}}/api/sesion/login
Content-Type: application/json

{
  "identifier": "admin",
  "password": "Admin123!"
}

@token = {{loginAdmin.response.body.$.access_token}}

### getAll — el catálogo completo (58 recursos sembrados)
GET {{baseUrl}}/api/recursos
Authorization: Bearer {{token}}

### getOne
GET {{baseUrl}}/api/recursos/25
Authorization: Bearer {{token}}

### CREATE — alta de un punto de acceso nuevo
### Concederlo después a un rol no requiere desplegar código.
POST {{baseUrl}}/api/recursos
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "method": "GET",
  "path": "/api/reportes/ventas/:id",
  "description": "Consultar reporte de ventas"
}

### 409 — la tupla (method, path) ya existe
POST {{baseUrl}}/api/recursos
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "method": "GET",
  "path": "/api/clientes",
  "description": "Duplicado"
}

### UPDATE PUT
PUT {{baseUrl}}/api/recursos/59
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "method": "GET",
  "path": "/api/reportes/ventas/:id",
  "description": "Reporte de ventas por id"
}

### DELETE lógico — ningún rol puede ya autorizar ese endpoint (403 para todos)
PATCH {{baseUrl}}/api/recursos/59/deactivate
Authorization: Bearer {{token}}

### DELETE físico
DELETE {{baseUrl}}/api/recursos/59
Authorization: Bearer {{token}}
EOF
```

![](images/clipboard-1376384726.png)

### Verificación

```         
npx tsc --noEmit
npm run db:seed
```

![](images/clipboard-2037733611.png)

![](images/clipboard-1369215188.png)

# 24.ISS-18 · Features RoleUsers y ResourceRoles

## 24.1 DTOs de RoleUsers

```         
: > src/features/auth/role-users/dto/create-role-user.dto.ts
cat >> src/features/auth/role-users/dto/create-role-user.dto.ts << 'EOF'
/**
 * Datos de entrada de `POST /api/asignaciones-rol` — **asignar un rol a un usuario**.
 *
 * Es el primer eslabón de la autorización. Se envía la pareja de identificadores;
 * si la asignación ya existía inactiva, se **reactiva** en lugar de duplicarla
 * (la restricción única `(user_id, role_id)` lo garantiza).
 */
export interface CreateRoleUserDto {
  user_id: number;
  role_id: number;
}
EOF
```

![](images/clipboard-609453170.png)

```         
: > src/features/auth/role-users/dto/role-user-response.dto.ts
cat >> src/features/auth/role-users/dto/role-user-response.dto.ts << 'EOF'
import { RoleUser, RoleUserI } from "../role-user.model";

/**
 * Respuesta HTTP de una asignación usuario-rol.
 *
 * Incluye, además de las claves foráneas, un resumen del usuario y del rol
 * (`user`, `role`) para que el consumidor no tenga que hacer dos peticiones
 * extra. La proyección del usuario **excluye la contraseña** por `attributes`
 * en el `include` del repository, no aquí: nunca sale de la base de datos.
 */
export interface RoleUserResponseDto extends RoleUserI {
  user?: { id: number; username: string; email: string } | null;
  role?: { id: number; name: string } | null;
}

/** Mapper modelo -> DTO de respuesta (objeto plano, con resúmenes si vienen). */
export function toRoleUserResponse(roleUser: RoleUser): RoleUserResponseDto {
  return roleUser.toJSON() as RoleUserResponseDto;
}
EOF
```

![](images/clipboard-3835268858.png)

```         
: > src/features/auth/role-users/dto/index.ts
cat >> src/features/auth/role-users/dto/index.ts << 'EOF'
export * from "./create-role-user.dto";
export * from "./role-user-response.dto";
EOF
```

![](images/clipboard-2039840632.png)

## 24.2 RoleUsers — repository, service, controller y rutas

```         
: > src/features/auth/role-users/role-users.repository.ts
cat >> src/features/auth/role-users/role-users.repository.ts << 'EOF'
import { CreationAttributes, Transaction } from "sequelize";
import { RoleUser } from "./role-user.model";
import { Role } from "../roles/role.model";
import { User } from "../users/user.model";

/** `include` reutilizable: resumen del usuario (sin contraseña) y del rol. */
const SUMMARIES = [
  { model: User, as: "user", attributes: ["id", "username", "email"] },
  { model: Role, as: "role", attributes: ["id", "name"] },
];

/**
 * Capa Repository del feature RoleUsers (tabla `role_users`).
 * Única que habla con Sequelize. La proyección del usuario excluye `password`.
 */
export class RoleUsersRepository {
  /** Asignaciones activas (con resumen de usuario y rol). */
  public async findAllActive(): Promise<RoleUser[]> {
    return RoleUser.findAll({ where: { status: "active" }, include: SUMMARIES });
  }

  /** Una asignación por PK (o `null`). */
  public async findById(id: number, transaction?: Transaction): Promise<RoleUser | null> {
    return RoleUser.findByPk(id, { include: SUMMARIES, transaction });
  }

  /**
   * La asignación de un usuario a un rol, sea cual sea su estado.
   *
   * Permite la semántica *create-or-reactivate*: si ya existe inactiva, se
   * reactiva en lugar de chocar con la restricción única `(user_id, role_id)`.
   */
  public async findByUserAndRole(userId: number, roleId: number): Promise<RoleUser | null> {
    return RoleUser.findOne({ where: { user_id: userId, role_id: roleId } });
  }

  /** Inserta una asignación. */
  public async create(data: CreationAttributes<RoleUser>): Promise<RoleUser> {
    return RoleUser.create(data);
  }

  /** Persiste cambios sobre una instancia existente. */
  public async update(roleUser: RoleUser, data: Partial<RoleUser>): Promise<RoleUser> {
    return roleUser.update(data);
  }
}
EOF
```

![](images/clipboard-1528038169.png)

```         
: > src/features/auth/role-users/role-users.service.ts
cat >> src/features/auth/role-users/role-users.service.ts << 'EOF'
import {
  CreateRoleUserDto,
  RoleUserResponseDto,
  toRoleUserResponse,
} from "./dto";
import { RoleUsersRepository } from "./role-users.repository";
import { RoleUser } from "./role-user.model";
import { UsersRepository } from "../users/users.repository";
import { RolesRepository } from "../roles/roles.repository";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature RoleUsers — **asignaciones usuario ↔ rol**.
 *
 * Aquí empieza la administración de la autorización. Reglas de negocio:
 *  - Solo se asigna un rol **activo** a un usuario **activo** (un eslabón
 *    inactivo rompería la cadena y el permiso no se concedería de todos modos).
 *  - Asignar es **idempotente**: si la pareja ya existía desactivada, se
 *    reactiva; si ya estaba activa, se informa 409 sin duplicar filas.
 *  - Retirar es un borrado lógico: preserva la auditoría y es reversible.
 *
 * El efecto es inmediato: la próxima petición del usuario vuelve a consultar la
 * cadena RBAC y ya ve (o deja de ver) el permiso. No hay caché que invalidar.
 */
export class RoleUsersService {
  public constructor(
    private readonly repository: RoleUsersRepository = new RoleUsersRepository(),
    private readonly usersRepository: UsersRepository = new UsersRepository(),
    private readonly rolesRepository: RolesRepository = new RolesRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<RoleUserResponseDto[]> {
    const assignments = await this.repository.findAllActive();
    return assignments.map((assignment) => toRoleUserResponse(assignment));
  }

  public async getOne(id: number): Promise<RoleUserResponseDto> {
    return toRoleUserResponse(await this.findOrFail(id));
  }

  // ================== CREATE (asignar) ==================
  /** Asigna un rol a un usuario (o reactiva la asignación existente). */
  public async assign(body: CreateRoleUserDto): Promise<RoleUserResponseDto> {
    if (!body.user_id || !body.role_id) {
      throw new AppError(400, "user_id and role_id are required");
    }

    await this.assertUserActive(body.user_id);
    await this.assertRoleActive(body.role_id);

    const existing = await this.repository.findByUserAndRole(body.user_id, body.role_id);
    if (existing) {
      if (existing.status === "active") {
        throw new AppError(409, "Role is already assigned to this user");
      }
      const reactivated = await this.repository.update(existing, { status: "active" });
      return toRoleUserResponse(await this.reload(reactivated.id));
    }

    const created = await this.repository.create({
      user_id: body.user_id,
      role_id: body.role_id,
      status: "active",
    });
    return toRoleUserResponse(await this.reload(created.id));
  }

  // ================== STATE (retirar / reactivar) ==================
  /** Retirar el rol -> `status = inactive`. El usuario pierde los permisos del rol. */
  public async deactivate(id: number): Promise<RoleUserResponseDto> {
    const assignment = await this.findOrFail(id);
    await this.repository.update(assignment, { status: "inactive" });
    return toRoleUserResponse(await this.reload(assignment.id));
  }

  /** Reactivar la asignación. */
  public async reactivate(id: number): Promise<RoleUserResponseDto> {
    const assignment = await this.findOrFail(id, false);
    if (assignment.status === "active") {
      throw new AppError(409, "Assignment is already active");
    }
    await this.repository.update(assignment, { status: "active" });
    return toRoleUserResponse(await this.reload(assignment.id));
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number, onlyActive = true): Promise<RoleUser> {
    const assignment = await this.repository.findById(id);
    if (!assignment || (onlyActive && assignment.status !== "active")) {
      throw new AppError(404, "Role assignment not found");
    }
    return assignment;
  }

  /** Recarga con los `include` de resumen (el `findById` ya los trae). */
  private async reload(id: number): Promise<RoleUser> {
    const assignment = await this.repository.findById(id);
    if (!assignment) {
      throw new AppError(404, "Role assignment not found");
    }
    return assignment;
  }

  private async assertUserActive(userId: number): Promise<void> {
    const user = await this.usersRepository.findById(userId);
    if (!user || user.status !== "active") {
      throw new AppError(404, "User not found or inactive");
    }
  }

  private async assertRoleActive(roleId: number): Promise<void> {
    const role = await this.rolesRepository.findById(roleId);
    if (!role || role.status !== "active") {
      throw new AppError(404, "Role not found or inactive");
    }
  }
}
EOF
```

![](images/clipboard-1009025565.png)

```         
: > src/features/auth/role-users/role-users.controller.ts
cat >> src/features/auth/role-users/role-users.controller.ts << 'EOF'
import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateRoleUserDto } from "./dto";
import { RoleUsersService } from "./role-users.service";

/**
 * Capa Controller del feature RoleUsers.
 *
 * Orden de operaciones (el mismo patrón del proyecto):
 * getAll → getOne → assign (create) → deactivate → reactivate.
 * No expone borrado físico: la revocación es lógica para preservar auditoría.
 */
export class RoleUsersController extends BaseController {
  public constructor(
    private readonly service: RoleUsersService = new RoleUsersService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const assignments = await this.service.getAll();
      res.status(200).json({ assignments });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const assignment = await this.service.getOne(this.paramId(req));
      res.status(200).json({ assignment });
    });
  }

  // ================== CREATE (asignar) ==================
  public async assign(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const assignment = await this.service.assign(req.body as CreateRoleUserDto);
      res.status(201).json({ assignment });
    });
  }

  // ================== STATE ==================
  /** Retirar el rol (borrado lógico). */
  public async deactivate(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const assignment = await this.service.deactivate(this.paramId(req));
      res.status(200).json({ message: "Role assignment deactivated", assignment });
    });
  }

  /** Reactivar la asignación. */
  public async reactivate(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const assignment = await this.service.reactivate(this.paramId(req));
      res.status(200).json({ message: "Role assignment reactivated", assignment });
    });
  }
}
EOF
```

![](images/clipboard-1088721933.png)

```         
: > src/features/auth/role-users/role-users.routes.ts
cat >> src/features/auth/role-users/role-users.routes.ts << 'EOF'
import { Application } from "express";
import { RoleUsersController } from "./role-users.controller";
import { authenticate, authorize } from "../access";

/**
 * Rutas del feature RoleUsers — **modalidad 3 (JWT + RBAC)**.
 *
 * Es la vía administrativa para **asignar un rol a un usuario**:
 * `POST /api/asignaciones-rol` con `{ user_id, role_id }`.
 *
 * No hay borrado físico: retirar un rol es un borrado lógico (`/deactivate`) y
 * es reversible (`/reactivate`). La auditoría de quién tuvo qué rol se conserva.
 */
export class RoleUsersRoutes {
  public roleUsersController: RoleUsersController = new RoleUsersController();

  public routes(app: Application): void {
    // getAll
    app
      .route("/api/asignaciones-rol")
      .get(
        authenticate,
        authorize,
        this.roleUsersController.getAll.bind(this.roleUsersController)
      );

    // getOne
    app
      .route("/api/asignaciones-rol/:id")
      .get(
        authenticate,
        authorize,
        this.roleUsersController.getOne.bind(this.roleUsersController)
      );

    // asignar rol (create)
    app
      .route("/api/asignaciones-rol")
      .post(
        authenticate,
        authorize,
        this.roleUsersController.assign.bind(this.roleUsersController)
      );

    // retirar rol (delete lógico)
    app
      .route("/api/asignaciones-rol/:id/deactivate")
      .patch(
        authenticate,
        authorize,
        this.roleUsersController.deactivate.bind(this.roleUsersController)
      );

    // reactivar asignación
    app
      .route("/api/asignaciones-rol/:id/reactivate")
      .patch(
        authenticate,
        authorize,
        this.roleUsersController.reactivate.bind(this.roleUsersController)
      );
  }
}
EOF
```

![](images/clipboard-628216851.png)

## 24.3 RoleUsers — seeder y swagger

```         
: > src/features/auth/role-users/role-users.seeder.ts
cat >> src/features/auth/role-users/role-users.seeder.ts << 'EOF'
import { RoleUser } from "./role-user.model";
import { Role } from "../roles/role.model";
import { User } from "../users/user.model";

/**
 * Seeder de las asignaciones usuario ↔ rol (`role_users`).
 *
 * Crea las dos asignaciones de referencia. Con esto el usuario `admin` hereda
 * los 58 recursos de `ADMIN` y el usuario `seller` los 7 de `SELLER`, sin
 * escribir ni una fila de autorización a mano.
 *
 * Idempotente: si la pareja ya existe (activa o no), se asegura de que quede
 * activa en lugar de duplicarla.
 */
export const SEED_ROLE_USERS = [
  { username: "admin", roleName: "ADMIN" },
  { username: "seller", roleName: "SELLER" },
] as const;

export async function seedRoleUsers(): Promise<number> {
  let created = 0;

  for (const item of SEED_ROLE_USERS) {
    const user = await User.findOne({ where: { username: item.username } });
    const role = await Role.findOne({ where: { name: item.roleName } });

    if (!user || !role) {
      console.log(
        `⏭️  role_users: falta ${item.username} o ${item.roleName}, se omite esa asignación`
      );
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
EOF
```

![](images/clipboard-3379276376.png)

```         
: > src/features/auth/role-users/role-users.swagger.ts
cat >> src/features/auth/role-users/role-users.swagger.ts << 'EOF'
import {
  bearerSecurity,
  forbiddenResponse,
  invalidIdResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../../shared/http/swagger-security";

/**
 * Documentación OpenAPI del feature RoleUsers — **asignaciones usuario ↔ rol**.
 *
 * Modalidad: **JWT + RBAC** en todas las operaciones.
 *
 * Estas rutas son una de las dos vías administrativas de la autorización:
 * `POST /api/asignaciones-rol` **asigna un rol a un usuario**, primer eslabón de
 * la cadena. Sin asignación activa no hay permisos, por muchos roles que existan.
 */
export const roleUsersSwagger = {
  tags: [
    {
      name: "Asignaciones usuario-rol",
      description:
        "Asignar / retirar / reactivar el rol de un usuario (`role_users`) — **JWT + RBAC**",
    },
  ],
  paths: {
    "/api/asignaciones-rol": {
      get: {
        tags: ["Asignaciones usuario-rol"],
        summary: "Listar asignaciones activas",
        description:
          "JWT + RBAC — recurso `GET /api/asignaciones-rol`. Incluye un resumen del usuario (sin `password`) y del rol.",
        security: bearerSecurity,
        responses: {
          "200": { description: "Lista de asignaciones (`{ assignments: [...] }`)" },
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
        },
      },
      post: {
        tags: ["Asignaciones usuario-rol"],
        summary: "Asignar rol a usuario",
        description:
          "JWT + RBAC — recurso `POST /api/asignaciones-rol`. " +
          "Cuerpo: `{ user_id, role_id }`. Es idempotente: si la pareja existía desactivada, se reactiva. " +
          "El usuario y el rol deben estar activos.",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/RoleUserCreate" } },
          },
        },
        responses: {
          "201": { description: "Asignación creada (`{ assignment }`)" },
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": { description: "Usuario o rol inexistente o inactivo" },
          "409": { description: "El rol ya está asignado a ese usuario" },
        },
      },
    },
    "/api/asignaciones-rol/{id}": {
      get: {
        tags: ["Asignaciones usuario-rol"],
        summary: "Obtener asignación por id",
        description: "JWT + RBAC — recurso `GET /api/asignaciones-rol/:id`.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Asignación (`{ assignment }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
    },
    "/api/asignaciones-rol/{id}/deactivate": {
      patch: {
        tags: ["Asignaciones usuario-rol"],
        summary: "Retirar rol a usuario (borrado lógico)",
        description:
          "JWT + RBAC — recurso `PATCH /api/asignaciones-rol/:id/deactivate`. " +
          "Rompe el eslabón `role_users` -> el usuario pierde los permisos de ese rol de inmediato (403).",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Asignación desactivada (`{ message, assignment }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
    },
    "/api/asignaciones-rol/{id}/reactivate": {
      patch: {
        tags: ["Asignaciones usuario-rol"],
        summary: "Reactivar asignación",
        description:
          "JWT + RBAC — recurso `PATCH /api/asignaciones-rol/:id/reactivate`. Reversible: vuelve a conceder los permisos del rol.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Asignación reactivada (`{ message, assignment }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
          "409": { description: "La asignación ya estaba activa" },
        },
      },
    },
  },
  components: {
    schemas: {
      RoleUser: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          user_id: { type: "integer", example: 1 },
          role_id: { type: "integer", example: 1 },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          user: {
            type: "object",
            properties: {
              id: { type: "integer" },
              username: { type: "string" },
              email: { type: "string", format: "email" },
            },
          },
          role: {
            type: "object",
            properties: { id: { type: "integer" }, name: { type: "string" } },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      RoleUserCreate: {
        type: "object",
        required: ["user_id", "role_id"],
        properties: {
          user_id: { type: "integer", example: 2 },
          role_id: { type: "integer", example: 2 },
        },
      },
    },
  },
};
EOF
```

![](images/clipboard-1637606257.png)

## 24.4 DTOs de ResourceRoles

```         
: > src/features/auth/resource-roles/dto/create-resource-role.dto.ts
cat >> src/features/auth/resource-roles/dto/create-resource-role.dto.ts << 'EOF'
/**
 * Datos de entrada de `POST /api/concesiones-rol` — **conceder un recurso a un rol**.
 *
 * Esta operación **crea un permiso**: el permiso no es una entidad con nombre,
 * es la tupla `(role_id, resource_id)` materializada en `resource_roles`. Si la
 * concesión ya existía inactiva, se reactiva en lugar de duplicarla.
 *
 * Ejemplo: conceder `POST /api/ventas` al rol `SELLER` significa que los
 * usuarios con ese rol podrán registrar ventas, sin tocar el código.
 */
export interface CreateResourceRoleDto {
  role_id: number;
  resource_id: number;
}
EOF
```

![](images/clipboard-3318353341.png)

```         
: > src/features/auth/resource-roles/dto/list-resource-roles.dto.ts
cat >> src/features/auth/resource-roles/dto/list-resource-roles.dto.ts << 'EOF'
/**
 * Filtros de `GET /api/concesiones-rol`.
 * Permiten pedir "los permisos de este rol" o "los roles que conceden este recurso".
 */
export interface ListResourceRolesDto {
  role_id?: number;
  resource_id?: number;
}
EOF
```

![](images/clipboard-968366987.png)

```         
: > src/features/auth/resource-roles/dto/resource-role-response.dto.ts
cat >> src/features/auth/resource-roles/dto/resource-role-response.dto.ts << 'EOF'
import { ResourceRole, ResourceRoleI } from "../resource-role.model";

/**
 * Respuesta HTTP de una concesión rol-recurso (un permiso).
 *
 * Incluye un resumen del rol y del recurso: `resource` lleva `(method, path)`,
 * que es exactamente el par que evalúa el middleware de autorización.
 */
export interface ResourceRoleResponseDto extends ResourceRoleI {
  role?: { id: number; name: string } | null;
  resource?: {
    id: number;
    method: string;
    path: string;
    description: string | null;
  } | null;
}

/** Mapper modelo -> DTO de respuesta (objeto plano). */
export function toResourceRoleResponse(resourceRole: ResourceRole): ResourceRoleResponseDto {
  return resourceRole.toJSON() as ResourceRoleResponseDto;
}

/**
 * Un permiso **efectivo**: el resultado de recorrer la cadena completa
 * `role_users → roles → resource_roles → resources` para un usuario concreto.
 *
 * Es plano a propósito: el middleware de autorización solo necesita
 * `(method, path)`; el resto es información útil para el endpoint de consulta.
 */
export interface EffectivePermissionDto {
  resource_id: number;
  method: string;
  path: string;
  description: string | null;
  role_id: number;
  role_name: string;
}
EOF
```

![](images/clipboard-2380106849.png)

```         
: > src/features/auth/resource-roles/dto/index.ts
cat >> src/features/auth/resource-roles/dto/index.ts << 'EOF'
export * from "./create-resource-role.dto";
export * from "./list-resource-roles.dto";
export * from "./resource-role-response.dto";
EOF
```

![](images/clipboard-2887007795.png)

## 24.5 ResourceRoles — repository, service, controller, rutas

```         
: > src/features/auth/resource-roles/resource-roles.repository.ts
cat >> src/features/auth/resource-roles/resource-roles.repository.ts << 'EOF'
import { CreationAttributes, Op, Transaction } from "sequelize";
import { ResourceRole } from "./resource-role.model";
import { Role } from "../roles/role.model";
import { Resource } from "../resources/resource.model";
import { RoleUser } from "../role-users/role-user.model";
import { EffectivePermissionDto } from "./dto";

/** `include` reutilizable: resumen del rol y del recurso (con `method`/`path`). */
const SUMMARIES = [
  { model: Role, as: "role", attributes: ["id", "name"] },
  {
    model: Resource,
    as: "resource",
    attributes: ["id", "method", "path", "description"],
  },
];

/**
 * Capa Repository del feature ResourceRoles (tabla `resource_roles`).
 *
 * Aquí vive la **consulta de autorización efectiva**: la única que recorre la
 * cadena completa de seguridad. Es el corazón del RBAC.
 */
export class ResourceRolesRepository {
  /** Todas las concesiones activas (con resumen de rol y recurso). */
  public async findAllActive(): Promise<ResourceRole[]> {
    return ResourceRole.findAll({ where: { status: "active" }, include: SUMMARIES });
  }

  /** Concesiones activas filtradas por rol y/o recurso. */
  public async findAllActiveFiltered(filters: {
    role_id?: number;
    resource_id?: number;
  }): Promise<ResourceRole[]> {
    const where: Record<string, unknown> = { status: "active" };
    if (filters.role_id) where.role_id = filters.role_id;
    if (filters.resource_id) where.resource_id = filters.resource_id;

    return ResourceRole.findAll({ where, include: SUMMARIES, order: [["id", "ASC"]] });
  }

  /** Una concesión por PK (o `null`). */
  public async findById(id: number, transaction?: Transaction): Promise<ResourceRole | null> {
    return ResourceRole.findByPk(id, { include: SUMMARIES, transaction });
  }

  /** La concesión de un recurso a un rol, sea cual sea su estado. */
  public async findByRoleAndResource(
    roleId: number,
    resourceId: number
  ): Promise<ResourceRole | null> {
    return ResourceRole.findOne({
      where: { role_id: roleId, resource_id: resourceId },
    });
  }

  /** Todas las concesiones (activas e inactivas) de un rol. */
  public async findAllByRole(roleId: number, transaction?: Transaction): Promise<ResourceRole[]> {
    return ResourceRole.findAll({ where: { role_id: roleId }, transaction });
  }

  /** Inserta una concesión. */
  public async create(
    data: CreationAttributes<ResourceRole>,
    transaction?: Transaction
  ): Promise<ResourceRole> {
    return ResourceRole.create(data, { transaction });
  }

  /** Persiste cambios sobre una instancia existente. */
  public async update(
    resourceRole: ResourceRole,
    data: Partial<ResourceRole>,
    transaction?: Transaction
  ): Promise<ResourceRole> {
    return resourceRole.update(data, { transaction });
  }

  /**
   * **CONSULTA DE AUTORIZACIÓN EFECTIVA** (`docs/bd-storelab.md` §16).
   *
   * Devuelve los recursos que un usuario puede ejecutar, recorriendo la cadena
   * y exigiendo `status = 'active'` en **los cuatro eslabones**:
   *
   * ```sql
   * resource_roles (rr)  -> rr.status = active
   *   JOIN roles (ro)     -> ro.status = active
   *   JOIN role_users(ru) -> ru.status = active AND ru.user_id = :userId
   *   JOIN resources (r)  -> r.status  = active
   * ```
   *
   * Si cualquier eslabón está inactivo o ausente, la fila no aparece: el
   * resultado vacío se traduce en **deny by default** en el middleware.
   *
   * Los `include` con `required: true` producen INNER JOIN; no se usan
   * `attributes` del `RoleUser` porque solo interesa que exista y cumpla el WHERE.
   */
  public async findEffectiveForUser(userId: number): Promise<EffectivePermissionDto[]> {
    const rows = await ResourceRole.findAll({
      where: { status: "active" },
      attributes: ["id"],
      include: [
        {
          model: Role,
          as: "role",
          required: true,
          attributes: ["id", "name"],
          where: { status: "active" },
          include: [
            {
              model: RoleUser,
              as: "role_users",
              required: true,
              attributes: [],
              where: { status: "active", user_id: userId },
            },
          ],
        },
        {
          model: Resource,
          as: "resource",
          required: true,
          attributes: ["id", "method", "path", "description"],
          where: { status: "active" },
        },
      ],
      order: [["id", "ASC"]],
    });

    return rows.map((row) => {
      const plain = row.toJSON() as unknown as {
        role: { id: number; name: string };
        resource: { id: number; method: string; path: string; description: string | null };
      };
      return {
        resource_id: plain.resource.id,
        method: plain.resource.method,
        path: plain.resource.path,
        description: plain.resource.description,
        role_id: plain.role.id,
        role_name: plain.role.name,
      };
    });
  }

  /** Cuenta las concesiones activas de un rol. */
  public async countActiveByRole(roleId: number): Promise<number> {
    return ResourceRole.count({ where: { role_id: roleId, status: "active" } });
  }

  /** Cuenta las concesiones activas totales. */
  public async countActive(): Promise<number> {
    return ResourceRole.count({ where: { status: "active" } });
  }

  /** Cuenta las concesiones activas cuyo recurso está en una lista de ids. */
  public async countActiveByResources(resourceIds: number[]): Promise<number> {
    if (resourceIds.length === 0) return 0;
    return ResourceRole.count({
      where: { resource_id: { [Op.in]: resourceIds }, status: "active" },
    });
  }
}
EOF
```

![](images/clipboard-1037454863.png)

```         
: > src/features/auth/resource-roles/resource-roles.service.ts
cat >> src/features/auth/resource-roles/resource-roles.service.ts << 'EOF'
import {
  CreateResourceRoleDto,
  EffectivePermissionDto,
  ListResourceRolesDto,
  ResourceRoleResponseDto,
  toResourceRoleResponse,
} from "./dto";
import { ResourceRolesRepository } from "./resource-roles.repository";
import { ResourceRole } from "./resource-role.model";
import { RolesRepository } from "../roles/roles.repository";
import { ResourcesRepository } from "../resources/resources.repository";
import { AppError } from "../../../shared/errors/app-error";
import { withTransaction } from "../../../shared/database/with-transaction";

/** Resumen de una reconciliación de concesiones de un rol. */
export interface ReconcileResult {
  role_id: number;
  activated: number;
  deactivated: number;
  total_active: number;
}

/**
 * Capa Service del feature ResourceRoles — **la gestión de permisos**.
 *
 * Aquí es donde el modelo "Role + Resource = permiso" se vuelve operativo:
 *  - `grant`     -> concede un recurso a un rol (crea o reactiva la concesión).
 *  - `deactivate`-> retira el permiso (borrado lógico, reversible).
 *  - `findEffectiveForUser` -> materializa los permisos de un usuario concreto.
 *  - `reconcileRole` -> deja el catálogo de un rol exactamente en un conjunto
 *    dado de recursos (idempotente); lo usa el seeder para el rol `SELLER`.
 *
 * Nada de esto requiere desplegar código: son filas.
 */
export class ResourceRolesService {
  public constructor(
    private readonly repository: ResourceRolesRepository = new ResourceRolesRepository(),
    private readonly rolesRepository: RolesRepository = new RolesRepository(),
    private readonly resourcesRepository: ResourcesRepository = new ResourcesRepository()
  ) {}

  // ================== READ ==================
  public async getAll(filters: ListResourceRolesDto = {}): Promise<ResourceRoleResponseDto[]> {
    const grants = await this.repository.findAllActiveFiltered({
      role_id: filters.role_id,
      resource_id: filters.resource_id,
    });
    return grants.map((grant) => toResourceRoleResponse(grant));
  }

  public async getOne(id: number): Promise<ResourceRoleResponseDto> {
    return toResourceRoleResponse(await this.findOrFail(id));
  }

  /** Permisos efectivos de un usuario (cadena RBAC completa, todos los eslabones activos). */
  public async findEffectiveForUser(userId: number): Promise<EffectivePermissionDto[]> {
    return this.repository.findEffectiveForUser(userId);
  }

  // ================== CREATE (conceder) ==================
  /** Concede un recurso a un rol (crea el permiso o reactiva la concesión). */
  public async grant(body: CreateResourceRoleDto): Promise<ResourceRoleResponseDto> {
    if (!body.role_id || !body.resource_id) {
      throw new AppError(400, "role_id and resource_id are required");
    }

    const role = await this.rolesRepository.findById(body.role_id);
    if (!role || role.status !== "active") {
      throw new AppError(404, "Role not found or inactive");
    }
    const resource = await this.resourcesRepository.findById(body.resource_id);
    if (!resource || resource.status !== "active") {
      throw new AppError(404, "Resource not found or inactive");
    }

    const existing = await this.repository.findByRoleAndResource(body.role_id, body.resource_id);
    if (existing) {
      if (existing.status === "active") {
        throw new AppError(409, "Role already has this resource granted");
      }
      const reactivated = await this.repository.update(existing, { status: "active" });
      return toResourceRoleResponse(await this.reload(reactivated.id));
    }

    const created = await this.repository.create({
      role_id: body.role_id,
      resource_id: body.resource_id,
      status: "active",
    });
    return toResourceRoleResponse(await this.reload(created.id));
  }

  // ================== STATE (retirar / reactivar) ==================
  /** Retirar el permiso -> `status = inactive`. Solo se pierde esa operación. */
  public async deactivate(id: number): Promise<ResourceRoleResponseDto> {
    const grant = await this.findOrFail(id);
    await this.repository.update(grant, { status: "inactive" });
    return toResourceRoleResponse(await this.reload(grant.id));
  }

  /** Reactivar la concesión. */
  public async reactivate(id: number): Promise<ResourceRoleResponseDto> {
    const grant = await this.findOrFail(id, false);
    if (grant.status === "active") {
      throw new AppError(409, "Grant is already active");
    }
    await this.repository.update(grant, { status: "active" });
    return toResourceRoleResponse(await this.reload(grant.id));
  }

  // ================== RECONCILIACIÓN ==================
  /**
   * Deja las concesiones de un rol **exactamente** en `resourceIds`.
   *
   * - Recursos de la lista sin concesión -> se conceden.
   * - Recursos de la lista con concesión inactiva -> se reactivan.
   * - Recursos concedidos que no están en la lista -> se retiran (inactive).
   *
   * Todo dentro de una transacción: o el rol queda con ese catálogo exacto, o no
   * se toca nada. Lo usa el seeder para el rol `SELLER` (7 recursos) y `ADMIN`
   * (58), de modo que volver a ejecutar el seeder reconcilia en vez de duplicar.
   */
  public async reconcileRole(roleId: number, resourceIds: number[]): Promise<ReconcileResult> {
    const role = await this.rolesRepository.findById(roleId);
    if (!role) {
      throw new AppError(404, "Role not found");
    }

    const wanted = new Set(resourceIds);

    return withTransaction(async (t) => {
      const existing = await this.repository.findAllByRole(roleId, t);
      const byResource = new Map(existing.map((row) => [row.resource_id, row]));

      let activated = 0;
      let deactivated = 0;

      for (const resourceId of wanted) {
        const row = byResource.get(resourceId);
        if (!row) {
          await this.repository.create(
            { role_id: roleId, resource_id: resourceId, status: "active" },
            t
          );
          activated++;
          continue;
        }
        if (row.status !== "active") {
          await this.repository.update(row, { status: "active" }, t);
          activated++;
        }
      }

      for (const row of existing) {
        if (wanted.has(row.resource_id)) continue;
        if (row.status === "active") {
          await this.repository.update(row, { status: "inactive" }, t);
          deactivated++;
        }
      }

      return {
        role_id: roleId,
        activated,
        deactivated,
        total_active: wanted.size,
      };
    });
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number, onlyActive = true): Promise<ResourceRole> {
    const grant = await this.repository.findById(id);
    if (!grant || (onlyActive && grant.status !== "active")) {
      throw new AppError(404, "Grant not found");
    }
    return grant;
  }

  private async reload(id: number): Promise<ResourceRole> {
    const grant = await this.repository.findById(id);
    if (!grant) {
      throw new AppError(404, "Grant not found");
    }
    return grant;
  }
}
EOF
```

![](images/clipboard-879310752.png)

```         
: > src/features/auth/resource-roles/resource-roles.controller.ts
cat >> src/features/auth/resource-roles/resource-roles.controller.ts << 'EOF'
import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateResourceRoleDto } from "./dto";
import { ResourceRolesService } from "./resource-roles.service";

/**
 * Capa Controller del feature ResourceRoles.
 *
 * Orden de operaciones: getAll → getOne → grant (create) → deactivate → reactivate.
 * `GET /api/concesiones-rol` acepta filtros `?role_id=` y `?resource_id=`.
 */
export class ResourceRolesController extends BaseController {
  public constructor(
    private readonly service: ResourceRolesService = new ResourceRolesService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const grants = await this.service.getAll({
        role_id: toOptionalNumber(req.query.role_id),
        resource_id: toOptionalNumber(req.query.resource_id),
      });
      res.status(200).json({ grants });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const grant = await this.service.getOne(this.paramId(req));
      res.status(200).json({ grant });
    });
  }

  // ================== CREATE (conceder permiso) ==================
  public async grant(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const grant = await this.service.grant(req.body as CreateResourceRoleDto);
      res.status(201).json({ message: "Resource granted to role", grant });
    });
  }

  // ================== STATE ==================
  /** Retirar el permiso (borrado lógico). */
  public async deactivate(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const grant = await this.service.deactivate(this.paramId(req));
      res.status(200).json({ message: "Grant deactivated (permission revoked)", grant });
    });
  }

  /** Reactivar la concesión. */
  public async reactivate(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const grant = await this.service.reactivate(this.paramId(req));
      res.status(200).json({ message: "Grant reactivated", grant });
    });
  }
}

/** Convierte un `query param` en número o `undefined` (sin lanzar por basura). */
function toOptionalNumber(value: unknown): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== "string" || !/^\d+$/.test(raw)) return undefined;
  return Number(raw);
}
EOF
```

![](images/clipboard-1566257314.png)

```         
: > src/features/auth/resource-roles/resource-roles.routes.ts
cat >> src/features/auth/resource-roles/resource-roles.routes.ts << 'EOF'
import { Application } from "express";
import { ResourceRolesController } from "./resource-roles.controller";
import { authenticate, authorize } from "../access";

/**
 * Rutas del feature ResourceRoles — **modalidad 3 (JWT + RBAC)**.
 *
 * Es la vía administrativa para **conceder un recurso a un rol** (crear un
 * permiso):
 * `POST /api/concesiones-rol` con `{ role_id, resource_id }`.
 *
 * El efecto es inmediato y por datos: la siguiente petición del usuario afectado
 * ya consulta la nueva matriz. No se reinicia el servidor ni se despliega nada.
 */
export class ResourceRolesRoutes {
  public resourceRolesController: ResourceRolesController = new ResourceRolesController();

  public routes(app: Application): void {
    // getAll (filtros ?role_id= y ?resource_id=)
    app
      .route("/api/concesiones-rol")
      .get(
        authenticate,
        authorize,
        this.resourceRolesController.getAll.bind(this.resourceRolesController)
      );

    // getOne
    app
      .route("/api/concesiones-rol/:id")
      .get(
        authenticate,
        authorize,
        this.resourceRolesController.getOne.bind(this.resourceRolesController)
      );

    // conceder recurso a rol (create)
    app
      .route("/api/concesiones-rol")
      .post(
        authenticate,
        authorize,
        this.resourceRolesController.grant.bind(this.resourceRolesController)
      );

    // retirar permiso (delete lógico)
    app
      .route("/api/concesiones-rol/:id/deactivate")
      .patch(
        authenticate,
        authorize,
        this.resourceRolesController.deactivate.bind(this.resourceRolesController)
      );

    // reactivar permiso
    app
      .route("/api/concesiones-rol/:id/reactivate")
      .patch(
        authenticate,
        authorize,
        this.resourceRolesController.reactivate.bind(this.resourceRolesController)
      );
  }
}
EOF
```

![](images/clipboard-2221238642.png)

## 24.6-24.7 `reconcileRole` + seeder de la matriz y swagger

```         
: > src/features/auth/resource-roles/resource-roles.seeder.ts
cat >> src/features/auth/resource-roles/resource-roles.seeder.ts << 'EOF'
import { Resource } from "../resources/resource.model";
import { Role } from "../roles/role.model";
import { RESOURCE_CATALOG, SELLER_RESOURCES } from "../resources/resource-catalog";
import { ResourceRolesService } from "./resource-roles.service";

/**
 * Seeder de las concesiones rol ↔ recurso (`resource_roles`). **Es el que
 * construye la matriz de permisos.**
 *
 * Reparto de referencia (`docs/bd-storelab.md` §21):
 *  - `ADMIN`  -> los **58** recursos (administración total).
 *  - `SELLER` -> los **7** recursos de operación (consultar clientes y
 *    productos, consultar y registrar ventas).
 *
 * Como `reconcileRole` es determinista, reejecutar el seeder **reconcilia** el
 * catálogo: concede lo que falte, reactiva lo inactivo y retira lo que sobre.
 * Así el rol `SELLER` nunca acumula permisos por accidente.
 */
export async function seedResourceRoles(): Promise<number> {
  const service = new ResourceRolesService();

  const resources = await Resource.findAll({ where: { status: "active" } });
  const idByOperation = new Map(
    resources.map((resource) => [`${resource.method} ${resource.path}`, resource.id])
  );

  /** Traduce el catálogo en código a los `resource_id` reales de la base. */
  const idsFor = (catalog: ReadonlyArray<{ method: string; path: string }>): number[] =>
    catalog
      .map((item) => idByOperation.get(`${item.method} ${item.path}`))
      .filter((id): id is number => typeof id === "number");

  let total = 0;

  const admin = await Role.findOne({ where: { name: "ADMIN" } });
  if (admin) {
    const result = await service.reconcileRole(admin.id, idsFor(RESOURCE_CATALOG));
    console.log(
      `✅ resource_roles: ADMIN -> ${result.total_active} recursos ` +
        `(${result.activated} altas, ${result.deactivated} bajas)`
    );
    total += result.total_active;
  }

  const seller = await Role.findOne({ where: { name: "SELLER" } });
  if (seller) {
    const result = await service.reconcileRole(seller.id, idsFor(SELLER_RESOURCES));
    console.log(
      `✅ resource_roles: SELLER -> ${result.total_active} recursos ` +
        `(${result.activated} altas, ${result.deactivated} bajas)`
    );
    total += result.total_active;
  }

  return total;
}
EOF
```

![](images/clipboard-92932586.png)

```         
: > src/features/auth/resource-roles/resource-roles.swagger.ts
cat >> src/features/auth/resource-roles/resource-roles.swagger.ts << 'EOF'
import {
  bearerSecurity,
  forbiddenResponse,
  invalidIdResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../../shared/http/swagger-security";

/**
 * Documentación OpenAPI del feature ResourceRoles — **la gestión de permisos**.
 *
 * Modalidad: **JWT + RBAC** en todas las operaciones.
 *
 * Aquí se materializa el principio de diseño: **no existe una entidad
 * `Permission`**. Conceder un permiso es crear (o reactivar) una fila en
 * `resource_roles`; el permiso es la tupla `(rol, recurso)`.
 */
export const resourceRolesSwagger = {
  tags: [
    {
      name: "Concesiones rol-recurso",
      description:
        "Conceder / retirar / reactivar recursos a un rol: **el permiso** — **JWT + RBAC**",
    },
  ],
  paths: {
    "/api/concesiones-rol": {
      get: {
        tags: ["Concesiones rol-recurso"],
        summary: "Listar concesiones activas",
        description:
          "JWT + RBAC — recurso `GET /api/concesiones-rol`. " +
          "Filtros opcionales: `?role_id=` (permisos de un rol) y `?resource_id=` (roles que conceden un recurso).",
        security: bearerSecurity,
        parameters: [
          { name: "role_id", in: "query", required: false, schema: { type: "integer" } },
          { name: "resource_id", in: "query", required: false, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Lista de concesiones (`{ grants: [...] }`)" },
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
        },
      },
      post: {
        tags: ["Concesiones rol-recurso"],
        summary: "Conceder recurso a rol (crear permiso)",
        description:
          "JWT + RBAC — recurso `POST /api/concesiones-rol`. " +
          "Cuerpo: `{ role_id, resource_id }`. Idempotente: si la concesión existía retirada, se reactiva. " +
          "Efecto inmediato y sin despliegue: la siguiente petición del usuario ya consulta la nueva matriz.",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ResourceRoleCreate" } },
          },
        },
        responses: {
          "201": { description: "Permiso concedido (`{ message, grant }`)" },
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": { description: "Rol o recurso inexistente o inactivo" },
          "409": { description: "El rol ya tiene concedido ese recurso" },
        },
      },
    },
    "/api/concesiones-rol/{id}": {
      get: {
        tags: ["Concesiones rol-recurso"],
        summary: "Obtener concesión por id",
        description: "JWT + RBAC — recurso `GET /api/concesiones-rol/:id`.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Concesión (`{ grant }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
    },
    "/api/concesiones-rol/{id}/deactivate": {
      patch: {
        tags: ["Concesiones rol-recurso"],
        summary: "Retirar permiso (borrado lógico)",
        description:
          "JWT + RBAC — recurso `PATCH /api/concesiones-rol/:id/deactivate`. " +
          "Solo se pierde esa operación; el resto de permisos del rol siguen vigentes.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Permiso retirado (`{ message, grant }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
    },
    "/api/concesiones-rol/{id}/reactivate": {
      patch: {
        tags: ["Concesiones rol-recurso"],
        summary: "Reactivar permiso",
        description: "JWT + RBAC — recurso `PATCH /api/concesiones-rol/:id/reactivate`.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Permiso reactivado (`{ message, grant }`)" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
          "409": { description: "La concesión ya estaba activa" },
        },
      },
    },
  },
  components: {
    schemas: {
      ResourceRole: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          role_id: { type: "integer", example: 2 },
          resource_id: { type: "integer", example: 25 },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          role: {
            type: "object",
            properties: { id: { type: "integer" }, name: { type: "string", example: "SELLER" } },
          },
          resource: {
            type: "object",
            properties: {
              id: { type: "integer" },
              method: { type: "string", example: "POST" },
              path: { type: "string", example: "/api/ventas" },
              description: { type: "string", nullable: true },
            },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ResourceRoleCreate: {
        type: "object",
        required: ["role_id", "resource_id"],
        properties: {
          role_id: { type: "integer", example: 2 },
          resource_id: { type: "integer", example: 25 },
        },
      },
    },
  },
};
EOF
```

![](images/clipboard-2552576523.png)

## 24.8 Pruebas HTTP

```         
: > src/features/auth/role-users/http/role-users.assign.http
cat >> src/features/auth/role-users/http/role-users.assign.http << 'EOF'
### Feature RoleUsers — ASIGNAR ROL A USUARIO (modalidad JWT + RBAC)
### Primer eslabón de la cadena: sin asignación activa NO hay permisos.
@baseUrl = http://localhost:4000

# @name loginAdmin
POST {{baseUrl}}/api/sesion/login
Content-Type: application/json

{
  "identifier": "admin",
  "password": "Admin123!"
}

@token = {{loginAdmin.response.body.$.access_token}}

### getAll — asignaciones activas (con resumen de usuario y rol)
GET {{baseUrl}}/api/asignaciones-rol
Authorization: Bearer {{token}}

### getOne
GET {{baseUrl}}/api/asignaciones-rol/1
Authorization: Bearer {{token}}

### ASIGNAR — `POST /api/asignaciones-rol` con { user_id, role_id }
### (seller = user_id 2 recibe ADMIN = role_id 1; no lo tiene todavía -> 201)
# @name assignCreate
POST {{baseUrl}}/api/asignaciones-rol
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "user_id": 2,
  "role_id": 1
}

@assignmentId = {{assignCreate.response.body.$.assignment.id}}

### 409 — ese rol ya está asignado a ese usuario (la tupla es única)
POST {{baseUrl}}/api/asignaciones-rol
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "user_id": 2,
  "role_id": 1
}

### 404 — usuario o rol inexistente/inactivo
POST {{baseUrl}}/api/asignaciones-rol
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "user_id": 9999,
  "role_id": 2
}

### RETIRAR ROL (borrado lógico) — el usuario pierde los permisos de ese rol de inmediato
PATCH {{baseUrl}}/api/asignaciones-rol/{{assignmentId}}/deactivate
Authorization: Bearer {{token}}

### Comprobación del efecto: los permisos efectivos cambian sin reiniciar nada
GET {{baseUrl}}/api/usuarios/2/permisos
Authorization: Bearer {{token}}

### REACTIVAR asignación (reversible, la auditoría se conserva)
PATCH {{baseUrl}}/api/asignaciones-rol/{{assignmentId}}/reactivate
Authorization: Bearer {{token}}
EOF
```

![](images/clipboard-669211445.png)

```         
: > src/features/auth/resource-roles/http/resource-roles.grant.http
cat >> src/features/auth/resource-roles/http/resource-roles.grant.http << 'EOF'
### Feature ResourceRoles — CONCEDER / RETIRAR PERMISOS (modalidad JWT + RBAC)
### Aquí se ve el principio de diseño: NO existe entidad `Permission`.
### El permiso es la tupla (rol, recurso) materializada en `resource_roles`.
### resource_id 3 = `POST /api/clientes` (3.ª entrada del catálogo semilla).
@baseUrl = http://localhost:4000

# @name loginAdmin
POST {{baseUrl}}/api/sesion/login
Content-Type: application/json

{
  "identifier": "admin",
  "password": "Admin123!"
}

# @name loginSeller
POST {{baseUrl}}/api/sesion/login
Content-Type: application/json

{
  "identifier": "seller",
  "password": "Seller123!"
}

@token = {{loginAdmin.response.body.$.access_token}}
@sellerToken = {{loginSeller.response.body.$.access_token}}
@sellerRoleId = 2

### getAll — concesiones activas (ADMIN 58 + SELLER 7 = 65)
GET {{baseUrl}}/api/concesiones-rol
Authorization: Bearer {{token}}

### Filtro: permisos de un rol (?role_id=)
GET {{baseUrl}}/api/concesiones-rol?role_id={{sellerRoleId}}
Authorization: Bearer {{token}}

### Filtro inverso: qué roles conceden un recurso (?resource_id=)
GET {{baseUrl}}/api/concesiones-rol?resource_id=1
Authorization: Bearer {{token}}

### getOne
GET {{baseUrl}}/api/concesiones-rol/1
Authorization: Bearer {{token}}

### ESTADO INICIAL — SELLER no puede crear clientes -> 403 (deny by default)
POST {{baseUrl}}/api/clientes
Authorization: Bearer {{sellerToken}}
Content-Type: application/json

{
  "name": "Prueba RBAC",
  "phone": "3000000000",
  "email": "rbac.demo@example.com",
  "password": "x"
}

### CONCEDER — `POST /api/concesiones-rol` con { role_id: 2 (SELLER), resource_id: 3 (POST /api/clientes) }
# @name grantCreate
POST {{baseUrl}}/api/concesiones-rol
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "role_id": 2,
  "resource_id": 3
}

@grantId = {{grantCreate.response.body.$.grant.id}}

### EFECTO INMEDIATO — el mismo seller ahora sí puede (201), sin reiniciar el servidor
POST {{baseUrl}}/api/clientes
Authorization: Bearer {{sellerToken}}
Content-Type: application/json

{
  "name": "Prueba RBAC 2",
  "phone": "3000000001",
  "email": "rbac.demo2@example.com",
  "password": "x"
}

### RETIRAR EL PERMISO (borrado lógico) — solo se pierde esa operación
PATCH {{baseUrl}}/api/concesiones-rol/{{grantId}}/deactivate
Authorization: Bearer {{token}}

### El seller vuelve a 403
POST {{baseUrl}}/api/clientes
Authorization: Bearer {{sellerToken}}
Content-Type: application/json

{
  "name": "Prueba RBAC 3",
  "phone": "3000000002",
  "email": "rbac.demo3@example.com",
  "password": "x"
}

### REACTIVAR EL PERMISO (reversible, la auditoría se conserva)
PATCH {{baseUrl}}/api/concesiones-rol/{{grantId}}/reactivate
Authorization: Bearer {{token}}

### 403 — el propio SELLER no puede administrar la matriz de permisos
GET {{baseUrl}}/api/concesiones-rol
Authorization: Bearer {{sellerToken}}
EOF
```

![](images/clipboard-3394156215.png)

### Verificación

```         
npx tsc --noEmit
npm run db:seed
```

![](images/clipboard-996094594.png)

```         
SELECT COUNT(*) FROM role_users;      -- 2 (admin→ADMIN, seller→SELLER)
SELECT COUNT(*) FROM resource_roles;  -- 65 (ADMIN 58 + SELLER 7)
```

![](images/clipboard-1433052271.png){width="387"}

![](images/clipboard-3107835111.png){width="389"}
