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

### Cierre del ISS

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
