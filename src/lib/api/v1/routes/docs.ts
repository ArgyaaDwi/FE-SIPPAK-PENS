import { Hono } from "hono";
import { getOpenApiSpec, getSwaggerHtml } from "@/lib/api/docs";

const docsRouter = new Hono();

docsRouter.get("/", (c) => {
  return c.html(getSwaggerHtml("/api/v1/docs/openapi.json"));
});

docsRouter.get("/openapi.json", (c) => {
  return c.json(getOpenApiSpec());
});

export default docsRouter;
