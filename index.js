import axios from "axios";
import fs from "fs";
import path from "path";

const url =
  "https://services-eu1.arcgis.com/RvnYk1PBUJ9rrAuT/arcgis/rest/services/Embalses_Total/FeatureServer/0/query";

const paramsBase = {
  where: "1=1",
  outFields: "*",
  returnGeometry: false,
  f: "json",
  resultRecordCount: 2000,
};

let offset = 0;
let keepFetching = true;
let totalRecords = 0;

const streams = new Map();
const isFirstObject = new Map();

function startJsonArrayFile(year) {
  const filePath = path.resolve(process.cwd(), `embalses_${year}.json`);
  const stream = fs.createWriteStream(filePath, { flags: "w" });
  stream.write("[\n");
  streams.set(year, stream);
  isFirstObject.set(year, true);
  console.log(`Archivo creado: ${filePath}`);
}

function writeToYear(year, obj) {
  if (!streams.has(year)) {
    startJsonArrayFile(year);
  }

  const stream = streams.get(year);
  const first = isFirstObject.get(year);

  if (!first) {
    stream.write(",\n");
  } else {
    isFirstObject.set(year, false);
  }

  stream.write(JSON.stringify(obj));
}

async function closeAllStreams() {
  const promises = [];

  for (const [year, stream] of streams.entries()) {
    promises.push(
      new Promise((resolve) => {
        stream.write("\n]\n");
        stream.end(() => {
          console.log(`Archivo para año ${year} cerrado.`);
          resolve();
        });
      })
    );
  }

  await Promise.all(promises);
}

process.on("SIGINT", async () => {
  console.log("\nInterrupción detectada (Ctrl+C). Cerrando archivos JSON...");
  await closeAllStreams();
  console.log(`Datos guardados hasta ahora: ${totalRecords} registros.`);
  process.exit();
});

async function fetchAllData() {
  while (keepFetching) {
    try {
      const params = {
        ...paramsBase,
        resultOffset: offset,
      };

      const response = await axios.get(url, { params });
      const features = response.data.features;

      if (!features || features.length === 0) {
        keepFetching = false;
        break;
      }

      for (const f of features) {
        const year = f.attributes.boletin_anyo || "sin_anio";
        writeToYear(year, f.attributes);
        totalRecords++;
      }

      offset += features.length;
      console.log(`Datos descargados hasta ahora: ${totalRecords}`);
    } catch (error) {
      console.error("Error al obtener los datos:", error.message);
      keepFetching = false;
    }
  }

  await closeAllStreams();
  console.log(`Proceso finalizado. Total registros: ${totalRecords}`);
}

fetchAllData();
