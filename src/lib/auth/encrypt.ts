import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { User, Role } from "@/types/interfaces";

const secretKey = process.env.SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

export interface SessionPayload extends JWTPayload {
  user_id: User["id"];
  expiresAt: Date;
  nama: User["nama"];
  email: User["email"];
  role: Role;
}

// create session token
export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(encodedKey);
}

// verify session token
export async function verifySessionToken(session: string | undefined = "") {
  try {
    if (!session) {
      console.log("[!] Session token tidak ada");
      return null;
    }
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload;
  } catch (error) {
    console.error("[!] Error verifying session token:", error);
    return null;
  }
}
