import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const publicDirectory = path.join(currentDirectory, "..", "public");

export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "16kb" }));

  app.get("/health", (_request, response) => {
    response.status(200).json({
      status: "ok",
      service: "release-beacon",
      uptimeSeconds: Math.floor(process.uptime()),
    });
  });

  app.get("/api/info", (_request, response) => {
    response.status(200).json({
      service: "release-beacon",
      environment: process.env.APP_ENV || "local",
      release: process.env.RELEASE_SHA || "dev",
      nodeVersion: process.version,
    });
  });

  app.use(express.static(publicDirectory));

  app.use((request, response) => {
    response.status(404).json({ error: "not_found", path: request.path });
  });

  return app;
}

