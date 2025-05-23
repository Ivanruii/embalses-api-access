# Embalses API Data Access

Este proyecto contiene scripts para descargar datos relacionados con embalses desde un servicio ArcGIS API. Los datos se procesan y guardan en archivos JSON.

La URL base de la API utilizada es:
`https://services-eu1.arcgis.com/RvnYk1PBUJ9rrAuT/arcgis/rest/services/Embalses_Total/FeatureServer/0/query`

## Características

- **Descarga de Datos Históricos:** El script `index.js` descarga todos los datos disponibles de la API, los organiza por año y los guarda en archivos JSON individuales por cada año.
- **Descarga de Datos de la Última Semana:** El script `last-week-fetch.js` descarga los datos correspondientes a la fecha más reciente (`Fecha_str`) disponible en la API y los guarda en un único archivo JSON.

## Scripts Principales

### `index.js`

Este script está diseñado para obtener un volcado completo de todos los datos de embalses disponibles en la API.

- Realiza múltiples peticiones a la API, manejando la paginación (`resultOffset`).
- Extrae el año del campo `boletin_anyo` de cada registro.
- Crea un archivo JSON separado para cada año (ej. `embalses_1990.json`, `embalses_2024.json`).
- Escribe los atributos de cada característica de la API como un objeto JSON en el archivo correspondiente a su año.
- Muestra el progreso de la descarga en la consola.
- En caso de interrupción (Ctrl+C), intenta cerrar todos los archivos JSON abiertos de forma ordenada.

### `last-week-fetch.js`

Este script está diseñado para obtener los datos más recientes de la API, correspondientes a la última "semana" o período de reporte.

- Primero, realiza una consulta a la API para determinar la `Fecha_str` (fecha en formato de texto) más reciente.
- Luego, descarga todos los registros que coinciden con esa `Fecha_str` más reciente.
- Guarda todos los registros obtenidos en un único archivo llamado `embalses_last_week.json`.
- Muestra el progreso de la descarga en la consola.

## Requisitos

- Node.js
- npm

## Configuración e Instalación

1.  Clona este repositorio.
2.  Navega al directorio del proyecto en tu terminal:
    ```bash
    cd ruta/a/embalses-api-access
    ```
3.  Instala las dependencias necesarias:

    ```bash
    npm install
    ```

### Para descargar todos los datos históricos por año:

```bash
npm run start
```

O directamente:

```bash
node index.js
```

Esto comenzará el proceso de descarga y creará/actualizará los archivos `embalses_YYYY.json` en el directorio raíz del proyecto, **este proceso pueda tardar varios minutos**.

### Para descargar los datos de la última semana:

```bash
npm run start:last-week
```

O directamente:

```bash
node last-week-fetch.js
```

Esto creará/actualizará el archivo `embalses_last_week.json` con los datos más recientes.
