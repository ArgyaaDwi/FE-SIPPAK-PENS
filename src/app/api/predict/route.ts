import { NextResponse } from "next/server";
import { getBackendPredictUrl } from "@/lib/env";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const backendPredictUrl = getBackendPredictUrl();

    const backendResponse = await fetch(backendPredictUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const responseText = await backendResponse.text();

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          message: `Backend prediction failed (HTTP ${backendResponse.status})`,
          detail: responseText,
        },
        { status: backendResponse.status },
      );
    }

    try {
      const jsonData = JSON.parse(responseText);
      return NextResponse.json(jsonData, { status: 200 });
    } catch {
      return NextResponse.json(
        {
          message: "Backend returned non-JSON response",
          detail: responseText,
        },
        { status: 502 },
      );
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to connect to prediction backend";

    return NextResponse.json(
      {
        message,
      },
      { status: 500 },
    );
  }
}
