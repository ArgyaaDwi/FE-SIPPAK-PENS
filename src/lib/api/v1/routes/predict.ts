import { Hono } from "hono";
import prisma from "@/lib/prisma";
import { getCookie } from "hono/cookie";
import { verifySessionToken } from "@/lib/auth/encrypt";
import { Prisma } from "@prisma/client";

const predictRouter = new Hono();

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

// POST /api/v1/predict
predictRouter.post("/", async (c) => {
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
    const role = String(session.role);
    const userId = Number(session.user_id);

    const body = await c.req.json();
    const {
      mahasiswa_id,
      payload_input,
      output,
      prob_rendah,
      prob_sedang,
      prob_tinggi,
    } = body;

    if (!mahasiswa_id) {
      return c.json(
        { success: false, error: "Mahasiswa wajib dipilih" },
        400,
      );
    }

    const mahasiswa = await prisma.mahasiswa.findFirst({
      where: {
        id: mahasiswa_id,
        ...mahasiswaAccessWhere(role, userId),
      },
    });

    if (!mahasiswa) {
      return c.json(
        {
          success: false,
          error: "Mahasiswa tidak ditemukan dalam cakupan akses akun Anda",
        },
        403,
      );
    }

    const newPrediction = await prisma.prediksi.create({
      data: {
        mahasiswa_id: mahasiswa_id,
        created_by: userId,
        payload_input: payload_input,
        output: output,
        prob_rendah: prob_rendah,
        prob_sedang: prob_sedang,
        prob_tinggi: prob_tinggi,
      },
    });

    return c.json(
      { success: true, message: "Prediksi disimpan!", data: newPrediction },
      201,
    );
  } catch (error) {
    console.error("Predict Save Error:", error);
    return c.json(
      { success: false, error: "Gagal menyimpan prediksi ke database" },
      500,
    );
  }
});

export default predictRouter;
