import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
// import prisma from "@/lib/prisma";
const prisma = new PrismaClient();

async function main() {
  console.log("Memulai proses seeding...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  // User KADEP
  const kadep = await prisma.user.upsert({
    where: { email: "kadep@pens.ac.id" },
    update: {},
    create: {
      nama: "Bapak Kadep IT",
      email: "kadep@pens.ac.id",
      password: hashedPassword,
      role: "KADEP",
    },
  });

  // User KAPRODI
  const kaprodi = await prisma.user.upsert({
    where: { email: "kaprodi@pens.ac.id" },
    update: {},
    create: {
      nama: "Ibu Kaprodi D4",
      email: "kaprodi@pens.ac.id",
      password: hashedPassword,
      role: "KAPRODI",
    },
  });

  // User DOSEN_WALI
  const dosenWali = await prisma.user.upsert({
    where: { email: "dosen@pens.ac.id" },
    update: {},
    create: {
      nama: "Pak Mirza (Dosen Wali)",
      email: "dosen@pens.ac.id",
      password: hashedPassword,
      role: "DOSEN_WALI",
    },
  });

  // User WALI_MURID
  const waliMurid = await prisma.user.upsert({
    where: { email: "walimurid@pens.ac.id" },
    update: {},
    create: {
      nama: "Pak Yudhis (Wali Murid)",
      email: "walimurid@pens.ac.id",
      password: hashedPassword,
      role: "WALI_MURID",
    },
  });

  console.log("Seeding selesai! 🚀 Berhasil membuat user:");
  console.log({
    kadep: kadep.email,
    kaprodi: kaprodi.email,
    dosenWali: dosenWali.email,
    waliMurid: waliMurid.email,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
