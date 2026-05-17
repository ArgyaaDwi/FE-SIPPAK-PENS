import { SessionPayload } from "./encrypt";

export async function getClientSession() {
  try {
    const response = await fetch("/api/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch session: ${response.status} - ${response.statusText}`,
      );
    }
    const data = await response.json();
    const session: SessionPayload = data.payload;
    return session;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
}
