import { Role } from "@/types/interfaces";

export const ROLE_REDIRECT: Record<Role, string> = {
  KADEP: "/kadep/dashboard",
  KAPRODI: "/kaprodi/dashboard",
  DOSEN_WALI: "/dosen-wali/dashboard",
  WALI_MURID: "/wali-murid/dashboard",
};