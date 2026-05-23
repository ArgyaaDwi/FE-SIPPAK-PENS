import { Hono } from "hono";
import prisma from "@/lib/prisma";
import { getCookie } from "hono/cookie";
import { verifySessionToken } from "@/lib/auth/encrypt";

const predictRouter = new Hono();

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

    const body = await c.req.json();
    const {
      mahasiswa_id,
      payload_input,
      output,
      prob_rendah,
      prob_sedang,
      prob_tinggi,
    } = body;

    await prisma.mahasiswa.upsert({
      where: { id: mahasiswa_id },
      update: {},
      create: {
        id: mahasiswa_id,
        nama: `Mahasiswa ${mahasiswa_id}`,
        angkatan: 2021,
        kelas_id: 1,
      },
    });

    const newPrediction = await prisma.prediksi.create({
      data: {
        mahasiswa_id: mahasiswa_id,
        created_by: Number(session.user_id),
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
  } catch (error: any) {
    console.error("Predict Save Error:", error.message);
    return c.json(
      { success: false, error: "Gagal menyimpan prediksi ke database" },
      500,
    );
  }
});

export default predictRouter;
