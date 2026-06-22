import { Hono } from "hono";
import prisma from "@/lib/prisma";
import { getCookie } from "hono/cookie";
import { verifySessionToken } from "@/lib/auth/encrypt";
import { Prisma } from "@prisma/client";

const mahasiswaRouter = new Hono();

function mahasiswaAccessWhere(
  role: string,
  userId: number,
): Prisma.MahasiswaWhereInput {
  if (role === "KADEP") {
    return {
      deleted: false,
      kelas: {
        deleted: false,
        prodi: {
          deleted: false,
          departemen: {
            deleted: false,
            kadep_id: userId,
          },
        },
      },
    };
  }

  if (role === "KAPRODI") {
    return {
      deleted: false,
      kelas: {
        deleted: false,
        prodi: {
          deleted: false,
          kaprodi_id: userId,
        },
      },
    };
  }

  if (role === "DOSEN_WALI") {
    return {
      deleted: false,
      kelas: {
        deleted: false,
        dosen_wali_id: userId,
      },
    };
  }

  if (role === "WALI_MURID") {
    return {
      deleted: false,
      wali_id: userId,
    };
  }

  return {
    id: "__forbidden__",
  };
}

// GET /api/v1/mahasiswa (Untuk mengisi Dropdown di Frontend)
mahasiswaRouter.get("/", async (c) => {
  try {
    const token =
      getCookie(c, "session") || c.req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return c.json({ success: false, error: "Invalid Token" }, 401);
    }

    const mahasiswa = await prisma.mahasiswa.findMany({
      where: mahasiswaAccessWhere(String(session.role), Number(session.user_id)),
      select: {
        id: true,
        nama: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return c.json({ success: true, data: mahasiswa }, 200);
  } catch {
    return c.json({ success: false, error: "Gagal memuat mahasiswa" }, 500);
  }
});

export default mahasiswaRouter;
