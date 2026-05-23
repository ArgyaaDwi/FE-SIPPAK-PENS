import { Hono } from "hono";
import prisma from "@/lib/prisma";

const mahasiswaRouter = new Hono();

// GET /api/v1/mahasiswa (Untuk mengisi Dropdown di Frontend)
mahasiswaRouter.get("/", async (c) => {
  try {
    const mahasiswa = await prisma.mahasiswa.findMany({
      select: {
        id: true,
        nama: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return c.json({ success: true, data: mahasiswa }, 200);
  } catch (error) {
    return c.json({ success: false, error: "Gagal memuat mahasiswa" }, 500);
  }
});

export default mahasiswaRouter;
