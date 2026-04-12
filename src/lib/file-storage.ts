import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { AppDataFile } from "@/lib/server-types";
import { seedClubs, seedReports, seedUsers } from "@/lib/seed-data";

const dataDir = path.join(process.cwd(), "data");
const uploadsDir = path.join(process.cwd(), "public", "uploads");
const dataFilePath = path.join(dataDir, "app-data.json");

export function getUploadsDir() {
  return uploadsDir;
}

export function toPublicUrl(storagePath: string) {
  return storagePath.startsWith("public/")
    ? `/${storagePath.slice("public/".length).replaceAll(path.sep, "/")}`
    : `/${storagePath.replaceAll(path.sep, "/")}`;
}

export async function ensureStorage() {
  await mkdir(dataDir, { recursive: true });
  await mkdir(uploadsDir, { recursive: true });

  try {
    await readFile(dataFilePath, "utf8");
  } catch {
    const seed: AppDataFile = {
      users: seedUsers,
      clubs: seedClubs,
      reports: seedReports,
    };
    await writeFile(dataFilePath, JSON.stringify(seed, null, 2), "utf8");
  }
}

export async function readData() {
  await ensureStorage();
  const raw = await readFile(dataFilePath, "utf8");
  return JSON.parse(raw) as AppDataFile;
}

export async function writeData(data: AppDataFile) {
  await ensureStorage();
  const tempPath = path.join(dataDir, `${randomUUID()}.tmp`);
  await writeFile(tempPath, JSON.stringify(data, null, 2), "utf8");
  await rename(tempPath, dataFilePath);
}
