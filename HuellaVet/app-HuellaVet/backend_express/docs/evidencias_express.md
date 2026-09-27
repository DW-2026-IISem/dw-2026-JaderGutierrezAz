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
