import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app.js";

test("GET /health reports a healthy service", async () => {
  const response = await request(createApp()).get("/health");

  assert.equal(response.status, 200);
  assert.equal(response.body.status, "ok");
  assert.equal(response.body.service, "release-beacon");
  assert.equal(typeof response.body.uptimeSeconds, "number");
});

test("GET /api/info exposes safe release metadata", async () => {
  process.env.APP_ENV = "test";
  process.env.RELEASE_SHA = "test-commit";

  const response = await request(createApp()).get("/api/info");

  assert.equal(response.status, 200);
  assert.equal(response.body.environment, "test");
  assert.equal(response.body.release, "test-commit");
  assert.match(response.body.nodeVersion, /^v\d+/);
});

test("unknown routes return a useful 404 response", async () => {
  const response = await request(createApp()).get("/missing");

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { error: "not_found", path: "/missing" });
});

