import { NextResponse } from "next/server";

type TokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type UiPathJob = {
  Id?: number;
  State?: string;
  CreationTime?: string;
  StartTime?: string | null;
  EndTime?: string | null;
  Info?: string | null;
  ReleaseName?: string | null;
  Release?: {
    Name?: string | null;
  };
};

export async function GET() {
  // Local test kawai saboda kada job details su zama public.
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production." }, { status: 404 });
  }

  const org = process.env.UIPATH_ORG;
  const clientId = process.env.UIPATH_APP_ID;
  const clientSecret = process.env.UIPATH_APP_SECRET;
  const scopes = process.env.UIPATH_SCOPES;
  const orchestratorUrl = process.env.UIPATH_ORCHESTRATOR_URL;
  const folderId = process.env.UIPATH_FOLDER_ID;

  if (
    !org ||
    !clientId ||
    !clientSecret ||
    !scopes ||
    !orchestratorUrl ||
    !folderId
  ) {
    return NextResponse.json(
      { connected: false, error: "Missing UiPath environment variables." },
      { status: 500 }
    );
  }

  try {
    const tokenBody = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: scopes,
    });

    const tokenResponse = await fetch(
      `https://cloud.uipath.com/${encodeURIComponent(org)}/identity_/connect/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: tokenBody,
        cache: "no-store",
      }
    );

    const tokenData = (await tokenResponse.json().catch(() => ({}))) as TokenResponse;

    if (!tokenResponse.ok || !tokenData.access_token) {
      return NextResponse.json(
        {
          connected: false,
          stage: "token",
          error: tokenData.error ?? "token_request_failed",
          detail: tokenData.error_description ?? "UiPath rejected the token request.",
        },
        { status: tokenResponse.status || 400 }
      );
    }

    const jobsUrl = new URL(
      `${orchestratorUrl.replace(/\/$/, "")}/odata/Jobs`
    );

    jobsUrl.searchParams.set("$top", "10");
    jobsUrl.searchParams.set("$orderby", "CreationTime desc");
    jobsUrl.searchParams.set("$expand", "Release");

    const jobsResponse = await fetch(jobsUrl.toString(), {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/json",
        "X-UIPATH-OrganizationUnitId": folderId,
      },
      cache: "no-store",
    });

    const jobsData = (await jobsResponse.json().catch(() => ({}))) as {
      value?: UiPathJob[];
      message?: string;
    };

    if (!jobsResponse.ok) {
      return NextResponse.json(
        {
          connected: false,
          stage: "jobs",
          error: "jobs_request_failed",
          detail: jobsData.message ?? "UiPath rejected the Jobs request.",
        },
        { status: jobsResponse.status }
      );
    }

    const jobs = (jobsData.value ?? []).map((job) => ({
      id: job.Id ?? null,
      process: job.Release?.Name ?? job.ReleaseName ?? "Unknown",
      state: job.State ?? "Unknown",
      createdAt: job.CreationTime ?? null,
      startedAt: job.StartTime ?? null,
      endedAt: job.EndTime ?? null,
      info: job.Info ?? null,
    }));

    return NextResponse.json({
      connected: true,
      count: jobs.length,
      jobs,
    });
  } catch {
    return NextResponse.json(
      {
        connected: false,
        error: "Unable to reach UiPath Orchestrator.",
      },
      { status: 502 }
    );
  }
}