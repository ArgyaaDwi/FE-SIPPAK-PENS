import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
// import prisma from "@/lib/prisma";
const prisma = new PrismaClient();

async function main() {
  console.log("Memulai proses seeding...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Bersihkan data turunan dulu agar seed bisa dijalankan berulang kali.
  await prisma.prediksi.deleteMany();
  await prisma.mahasiswa.deleteMany();
  await prisma.kelas.deleteMany();
  await prisma.prodi.deleteMany();
  await prisma.departemen.deleteMany();

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

  // Departemen
  const departemen = await prisma.departemen.create({
    data: {
      id: 1,
      nama: "Teknik Informatika dan Komputer",
      kadep_id: kadep.id,
    },
  });

  // Prodi
  const prodi = await prisma.prodi.create({
    data: {
      id: 1,
      nama: "D4 Teknik Informatika",
      departemen_id: departemen.id,
      kaprodi_id: kaprodi.id,
    },
  });

  // Kelas
  const kelas = await prisma.kelas.create({
    data: {
      id: 1,
      nama: "TI-4A",
      angkatan: 2022,
      prodi_id: prodi.id,
      dosen_wali_id: dosenWali.id,
    },
  });

  // ===== MAHASISWA =====
  const dataMahasiswa = [
    { id: "2042231001", nama: "Ian Ale" },
    { id: "2042231002", nama: "Khanza Fadila" },
    { id: "2042231003", nama: "Bayu Hadi" },
    { id: "2042231004", nama: "Abid Farhan" },
    { id: "2042231005", nama: "Aaron Pratama" },
  ];

  for (const mhs of dataMahasiswa) {
    await prisma.mahasiswa.upsert({
      where: { id: mhs.id },
      update: {},
      create: {
        id: mhs.id,
        nama: mhs.nama,
        angkatan: 2022,
        kelas_id: kelas.id,
      },
    });
  }

  console.log("Seeding selesai! 🚀 Berhasil membuat user:");
  console.log({
    kadep: kadep.email,
    kaprodi: kaprodi.email,
    dosenWali: dosenWali.email,
    waliMurid: waliMurid.email,
  });
  console.log({
    departemen: departemen.nama,
    prodi: prodi.nama,
    kelas: kelas.nama,
  });
  console.log(`Mahasiswa: ${dataMahasiswa.length} data berhasil di-seed`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
