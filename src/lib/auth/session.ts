"use server";
import { cookies } from "next/headers";
import { createSessionToken, verifySessionToken } from "./encrypt";
import { SessionUser } from "@/types/sessionUser";

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    return null;
  }

  const session = await verifySessionToken(sessionCookie.value);
  return session;
}

// Create session cookie
export async function createSession(user: SessionUser) {
  const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000 * 24);
  const session = await createSessionToken({
    user_id: user.id,
    nama: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set({
    name: "session",
    value: session,
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    secure: false,
    // expires: expiresAt,
    maxAge: 60 * 60 * 24, // 1 hari dalam detik
    sameSite: "lax",
    path: "/",
  });

  return session;
}

// Update session cookie
export async function updateSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    return null;
  }

  const payload = await verifySessionToken(sessionCookie.value);
  if (!payload) {
    return null;
  }

  // const expires = new Date(Date.now() + 1 * 60 * 60 * 1000);
  cookieStore.set({
    name: "session",
    value: sessionCookie.value,
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    secure: false,
    maxAge: 60 * 60 * 24, // 1 hari dalam detik
    sameSite: "lax",
    path: "/",
  });

  return sessionCookie.value;
}
