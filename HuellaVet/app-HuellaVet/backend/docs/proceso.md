# Manual de creación del Backend

## FASE 1 **— `00_BASE_INIT_NESTJS`**

### Inicialización del proyecto 

#### 1.1 — Crear carpetas padre y permisos

Prepara la ruta de trabajo en WSL. Los permisos evitan fallos de escritura del CLI.

``` bash
mkdir -p /lab-lab-academia/proyects/dw/HuellaVet/app-HuellaVet 
chmod -R 777 /lab-lab-academia/proyects/dw/HuellaVet/app-HuellaVet 
```

![](images/clipboard-4040100345.png)

![](images/clipboard-945224081.png)

#### 1.2 — Instalar Nest CLI (si no existe)

``` bash
npm install -g @nestjs/cli
nest --version
```

![](images/clipboard-1306085809.png)

![](images/clipboard-3621085646.png)
