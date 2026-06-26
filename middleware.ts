import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import type { auth } from "@/lib/auth";

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest): Promise<NextResponse> {
  try {
    const { data: session } = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        baseURL: request.nextUrl.origin,
        headers: { cookie: request.headers.get("cookie") ?? "" },
      }
    );

    if (!session) {
      return NextResponse.redirect(new URL("/authenticate", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/authenticate", request.url));
  }
}

export const config = {
  matcher: ["/recipes", "/recipes/:path*"],
};
