# **Archivo Evidencia Frontend Express**

**Nombre:** Jader Gutiérrez Areiza

**Asignatura:** Desarrollo Web

**Docente:** Jaider Quintero

Programa Ingeniería en Sistemas - Octavo Semestre

Universidad de La Guajira

# 0. ISS-00 — Requisitos previos

## 0.1 Node, npm y Angular CLI

```         
node --version
npm --version
npm view @angular/cli version engines --json
npm install -g @angular/cli
ng version
```

![](images/clipboard-2601864439.png)

## 0.2 Backend en marcha (preparación para integrar HTTP)

![](images/clipboard-3645159132.png)

## 0.3 Login y permisos

![](images/clipboard-2831144350.png)

![](images/clipboard-1453038873.png)

## 0.4 Credenciales del seeder

![](images/clipboard-1111205433.png)

![](images/clipboard-1539783913.png)

![](images/clipboard-3711797209.png)

![](images/clipboard-3541699336.png)

## 0.5 Navegador y herramientas

![](images/clipboard-2993497294.png)

## 0.6 Estructura de trabajo

![](images/clipboard-1572617194.png)

## Verificación del ISS

![](images/clipboard-1535124403.png)

# 1.ISS-01 · Bootstrap Angular 22 con CLI, Tailwind y PrimeNG

## 1.1 Crear el proyecto en la carpeta actual

![](images/clipboard-1735942850.png)

## 1.2 Instalar PrimeNG compatible con Angular

![](images/clipboard-935188031.png)

## 1.3 Estilos globales

![](images/clipboard-2313812593.png)

## 1.4 Configurar PrimeNG en `app.config.ts`

![](images/clipboard-615952867.png)

### 1.4.1 Licencia de PrimeNG 22 (obligatoria para la entrega limpia)

![](images/clipboard-2924889177.png)

## 1.5 Pantalla de arranque: `App` compone el componente `demo/ejemplo`

![](images/clipboard-2793267300.png)

## 1.6 Personalizar `index.html`

![](images/clipboard-1153530512.png)

## 1.7 Ajustar el presupuesto de build

![](images/clipboard-1600507817.png)

## 1.8 Primera ejecución

![](images/clipboard-3024219608.png)

## 1.9 Anatomía del componente `demo/ejemplo` y signals

### 1.9.1 De `index.html` a la pantalla y 1.9.2 Los cuatro archivos de un componente

![](images/clipboard-3552420393.png)

### 1.9.3 Leer `ejemplo.ts` línea a línea y 1.9.5 Signals

![](images/clipboard-133631362.png)

### 1.9.6 `computed` y `effect`: derivar y reaccionar - 1.9.9 Errores comunes

![](images/clipboard-3710763470.png)

## Verificación del ISS

![](images/clipboard-992940194.png)

# 1.1 Fase I: Frontend — ISS-01A — Esqueleto Header / Aside / contenido / Footer

## 1.1 Qué es un componente y por qué el padre debe importarlo

| Campo de `@Component` | Pregunta que responde                       |
|-----------------------|---------------------------------------------|
| `selector`            | ¿Con qué etiqueta se usa en otra plantilla? |
| `imports`             | ¿Qué usa **su** plantilla?                  |
| `templateUrl`         | ¿Dónde está el HTML?                        |
| `styleUrl`            | ¿Dónde están los estilos privados?          |
| `host`                | ¿Qué clases lleva el elemento anfitrión?    |

Un componente generado **no se ve** hasta que el padre lo declara en `imports` **y** escribe su etiqueta. Son dos pasos.

## 1.2 Generar las tres piezas de `layout/`

![](images/clipboard-3082609312.png)

## 1.3 Contenido de cada componente

![](images/clipboard-2983025876.png)

## 1.4 Componer las cuatro regiones en `App`

![](images/clipboard-3113167584.png)

## 1.5 Comprobar antes de avanzar

![](images/clipboard-1050628033.png)

![](images/clipboard-1160394617.png)

## Verificación del ISS

![](images/clipboard-2810932376.png)

# 1.2 Fase I: Frontend — ISS-01B — Menú PrimeNG y primera interacción

## 1.1 Los conceptos que se agregan, uno por vez

| Concepto | Qué resuelve | Dónde |
|----|----|----|
| `input()` | Dato del padre al hijo | `items` en Aside |
| `output()` | Aviso del hijo al padre | `menuRequested`, `navigated` |
| `signal()` | Estado propio | `title`, `mobileOpen` en `Construir` |
| `[(visible)]` | Ida y vuelta del Drawer | `[(visible)]="mobileOpen"` |
| `MenuItem[]` | Contrato del menú de PrimeNG | `items` |

Los tres componentes de `layout/` solo **reciben y avisan**. Únicamente `Construir` tiene estado.

**Logo:**

![](images/clipboard-1775106193.png)

## 1.2 El Aside recibe el menú con `input()`

![](images/clipboard-3783538238.png)

## 1.3 El Header avisa al padre con `output()`

![](images/clipboard-2420285669.png)

## 1.4 `features/construir`: estado local y Drawer móvil

![](images/clipboard-1137746153.png)

**El helper que decide el ancho**

![](images/clipboard-4192870632.png)

**Construir**

![](images/clipboard-495043168.png)

**Prueba de la pantalla**

![](images/clipboard-2739767231.png)

## 1.5 `App` pasa a ser punto de entrada con `router-outlet`

![](images/clipboard-272898452.png)

## 1.6 Comprobar antes de avanzar

![](images/clipboard-1525259754.png)

![](images/clipboard-2029826698.png)

## Verificación del ISS

![](images/clipboard-3191134159.png)

# 2.Fase I: Frontend — ISS-02 — Núcleo: environment, modelos, servicios y layout

## 2.1 `environment`: una sola URL para todo el frente

![](images/clipboard-1236535798.png)

### 2.1.1 Licencia PrimeUI (`primeUiLicense`)

![](images/clipboard-1779580375.png)

![](images/clipboard-2060805941.png)

![](images/clipboard-1162659495.png)

## 2.2 Modelos: reflejar el backend, no inventarlo

![](images/clipboard-302932806.png)

![](images/clipboard-3445850305.png)

**Entidades de negocio: Propietarios, mascotas, veterinarios, consultas, vacunas, lotes, aplicaciones y recetas.**

![](images/clipboard-4197825571.png)

![](images/clipboard-2580150759.png)

![](images/clipboard-3501190422.png)

![](images/clipboard-4153436767.png)

## 2.3 Servicios HTTP por feature: desenvolver la respuesta

![](images/clipboard-3143696782.png)

![](images/clipboard-1079583771.png)

![](images/clipboard-4163780938.png)

![](images/clipboard-2175542042.png)

![](images/clipboard-2349415687.png)

![](images/clipboard-2803783870.png)

![](images/clipboard-3864205379.png)

## 2.4 Utilidades transversales: `toApiMessage` y `NotificationService`

![](images/clipboard-351965234.png)

## 2.5 Componentes compartidos: `PageHeader`, `EmptyState`, `StatusTag`

![](images/clipboard-1350301865.png)

![](images/clipboard-2724684826.png)

![](images/clipboard-4845554.png)

## 2.6 `Shell`: conservar el esqueleto al navegar

![](images/clipboard-3815500229.png)

![](images/clipboard-320002556.png)

## 2.7 y 2.8 Comprobar antes de avanzar

![](images/clipboard-4087940908.png)

## Verificación del ISS

![](images/clipboard-849222531.png)

![](images/clipboard-2120877624.png)

# 3. ISS-03 · CRUD de Owners (Propietarios) Front

## 3.1 Generar componentes con CLI

![](images/clipboard-766001321.png)

## 3.2 Utilidad de filtro local

![](images/clipboard-1653697435.png)

## 3.3 Formulario reactivo reutilizable

![](images/clipboard-1000273517.png)

## 3.4 Lista con estado en Signals

![](images/clipboard-217815055.png)

## 3.5 Plantilla de la lista

![](images/clipboard-649515064.png)

## 3.6 Baja lógica vs baja física

![](images/clipboard-1969956497.png)

## 3.7 Ruta y menú

![](images/clipboard-2960427627.png)

![](images/clipboard-797538552.png)

## Pruebas

![](images/clipboard-2220488667.png)

## Verificación del ISS

![](images/clipboard-3627853767.png)

![](images/clipboard-2695077674.png)

![](images/clipboard-2311234279.png)

# 4. ISS-04 · CRUD de Pet (Mascotas) Front

## 4.1 Endpoint y contrato

| Operación      | Método y ruta                        | Respuesta          |
|----------------|--------------------------------------|--------------------|
| Listar         | `GET /api/mascotas`                  | `{ pets: [...] }`  |
| Obtener una    | `GET /api/mascotas/:id`              | `{ pet }`          |
| Crear          | `POST /api/mascotas`                 | `{ pet }`          |
| Editar parcial | `PATCH /api/mascotas/:id`            | `{ pet }`          |
| Reemplazar     | `PUT /api/mascotas/:id`              | `{ pet }`          |
| Baja lógica    | `PATCH /api/mascotas/:id/deactivate` | `{ message, pet }` |
| Baja física    | `DELETE /api/mascotas/:id`           | `204`              |

| Campo | Tipo | Al crear | Al editar |
|----|----|----|----|
| `owner_id` | número | obligatorio | opcional |
| `name` | texto | obligatorio | opcional |
| `description` | texto o `null` | opcional | opcional |
| `is_active` | booleano | opcional (por defecto `true`) | **no viaja**, solo `/deactivate` |

## 4.2 Generar con CLI

![](images/clipboard-1431171637.png)

## 4.3 Servicio

Ya fué creado en ISS-02

![](images/clipboard-2088101561.png)

## 4.4 Formulario

![](images/clipboard-2929056526.png)

## 4.5 Lista

![](images/clipboard-1627124085.png)

**Plantilla (resumen):**

![](images/clipboard-110839102.png)

## 4.6 Ruta

![](images/clipboard-280347924.png)

## Pruebas

![](images/clipboard-886986778.png)

## Comprobación

![](images/clipboard-2283825387.png)

![](images/clipboard-2225938143.png)

![](images/clipboard-2031894931.png)
