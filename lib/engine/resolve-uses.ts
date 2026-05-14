import fs from "node:fs";
import path from "node:path";
import type { UsesPageJson } from "./uses-types";

const USES_DIR = path.join(process.cwd(), "content/uses");

function loadUsesData(): Record<string, UsesPageJson> {
  const data: Record<string, UsesPageJson> = {};
  if (!fs.existsSync(USES_DIR)) return data;

  const files = fs.readdirSync(USES_DIR).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const slug = file.replace(".json", "");
    const raw = fs.readFileSync(path.join(USES_DIR, file), "utf-8");
    data[slug] = JSON.parse(raw) as UsesPageJson;
  }
  return data;
}

const USES_DATA_MAP = loadUsesData();

export async function getAllUsesSlugs(): Promise<string[]> {
  return Object.keys(USES_DATA_MAP);
}

export async function getUsesData(slug: string): Promise<UsesPageJson | null> {
  return USES_DATA_MAP[slug] || null;
}

export async function getAllUsesData(): Promise<UsesPageJson[]> {
  return Object.values(USES_DATA_MAP);
}
