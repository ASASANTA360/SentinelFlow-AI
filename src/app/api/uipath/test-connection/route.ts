import { NextResponse } from "next/server";

type TokenResponse = {
  error?: string;
  error_description?: string;
  token_type?: string;
  expires_in?: number;
  scope?: string;
};

export async function POST() {
  // Wannan endpoint ɗin na local test kawai ne.
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production." }, { status: 404 });
  }

  const org = process.env.UIPATH_ORG;
  const clientId = process.env.UIPATH_APP_ID;
  const clientSecret = process.env.UIPATH_APP_SECRET;
  const scopes = process.env.UIPATH_SCOPES;

  if (!org || !clientId || !clientSecret || !scopes) {
    return NextResponse.json(
      {
        connected: false,
        error: "Missing UiPath environment variables.",
      },
      { status: 500 }
    );
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
    scope: scopes,
  });

  try {
    const response = await fetch(
      `https://cloud.uipath.com/${encodeURIComponent(org)}/identity_/connect/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
        cache: "no-store",
      }
    );

    const data = (await response.json().catch(() => ({}))) as TokenResponse;

    if (!response.ok) {
      return NextResponse.json(
        {
          connected: false,
          error: data.error ?? "token_request_failed",
          detail: data.error_description ?? "UiPath rejected the request.",
        },
        { status: response.status }
      );
    }

    // Ba ya dawo da token ko secret domin tsaro.
    return NextResponse.json({
      connected: true,
      tokenType: data.token_type ?? "Bearer",
      expiresInSeconds: data.expires_in ?? null,
      scopes: data.scope ?? scopes,
    });
  } catch {
    return NextResponse.json(
      {
        connected: false,
        error: "Unable to reach UiPath Identity Server.",
      },
      { status: 502 }
    );
  }
}