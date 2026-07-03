import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type PredictionOutput = "tinggi" | "sedang" | "rendah" | "unknown";

export function normalizePredictionOutput(output: string): PredictionOutput {
  const normalized = output.trim().toLowerCase();

  if (normalized.includes("tinggi")) return "tinggi";
  if (normalized.includes("sedang")) return "sedang";
  if (normalized.includes("rendah")) return "rendah";

  return "unknown";
}

export function formatRoleLabel(role: string) {
  switch (role) {
    case "KADEP":
      return "Kepala Departemen";
    case "KAPRODI":
      return "Kepala Program Studi";
    case "DOSEN_WALI":
      return "Dosen Wali";
    case "WALI_MURID":
      return "Wali Murid";
    default:
      return role;
  }
}

export function formatPredictionStatusLabel(status?: string | null) {
  switch (status) {
    case "tinggi":
      return "Tinggi";
    case "sedang":
      return "Sedang";
    case "rendah":
      return "Rendah";
    default:
      return "Belum Ada";
  }
}

export function formatActualCategoryIpkLabel(category?: string | null) {
  const normalized = category?.trim();

  if (!normalized) {
    return "-";
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
}
