import { createApp } from "./app.js";

const port = Number.parseInt(process.env.PORT || "3000", 10);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

const app = createApp();
const server = app.listen(port, "0.0.0.0", () => {
  console.log(JSON.stringify({
    level: "info",
    message: "release-beacon listening",
    port,
    environment: process.env.APP_ENV || "local",
    release: process.env.RELEASE_SHA || "dev",
  }));
});

function shutDown(signal) {
  console.log(JSON.stringify({ level: "info", message: "shutdown requested", signal }));
  server.close((error) => {
    if (error) {
      console.error(JSON.stringify({ level: "error", message: error.message }));
      process.exit(1);
    }
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutDown("SIGTERM"));
process.on("SIGINT", () => shutDown("SIGINT"));

