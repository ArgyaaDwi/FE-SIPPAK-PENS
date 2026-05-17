import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createSessionToken, verifySessionToken } from "@/lib/auth/encrypt";
import { getSession } from "@/lib/auth/session";

const auth = new Hono();

// ENDPOINT LOGIN
auth.post("/login", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json(
        { success: false, error: "Email dan password wajib diisi" },
        400,
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return c.json({ success: false, error: "User tidak ditemukan" }, 404);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return c.json({ success: false, error: "Password salah" }, 401);
    }

    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000 * 24); // 24 Jam
    const sessionPayload = {
      user_id: user.id,
      nama: user.nama,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      expiresAt,
    };

    const token = await createSessionToken(sessionPayload);

    setCookie(c, "session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 hari dalam detik
    });

    return c.json(
      {
        success: true,
        message: "Login berhasil",
        data: { token, role: user.role },
      },
      200,
    );
  } catch (error: any) {
    console.error("❌ Login Error:", error.message);
    return c.json(
      { success: false, error: "Terjadi kesalahan pada server" },
      500,
    );
  }
});

// ENDPOINT LOGOUT
auth.post("/logout", async (c) => {
  deleteCookie(c, "session", {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });

  return c.json({ success: true, message: "Logout berhasil" }, 200);
});

// ENDPOINT CEK SESI (/me)
auth.get("/me", async (c) => {
  try {
    // 1. Cari token di Cookie dulu (untuk Browser FE)
    let token = getCookie(c, "session");

    if (!token) {
      const authHeader = c.req.header("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return c.json(
        { success: false, error: "Unauthorized / Belum Login" },
        401,
      );
    }

    const session = await verifySessionToken(token);

    if (!session) {
      return c.json(
        { success: false, error: "Session tidak valid atau expired" },
        401,
      );
    }

    return c.json({ success: true, payload: session }, 200);
  } catch (error) {
    return c.json({ success: false, error: "Gagal memvalidasi sesi" }, 500);
  }
});
export default auth;
