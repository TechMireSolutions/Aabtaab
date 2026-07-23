import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { env } from "@/lib/env";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "aabtaab",
  title: "Aabtaab CMS",
  basePath: "/studio",
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder",
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
