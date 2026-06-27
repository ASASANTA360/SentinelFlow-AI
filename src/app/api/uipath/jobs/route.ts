import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type TokenResponse = {
  access_token?: string;
};

type UiPathJob = {
  Id?: number;
  State?: string;
  CreationTime?: string;
  StartTime?: string | null;
  EndTime?: string | null;
  ReleaseName?: string | null;
  Release?: {
    Name?: string | null;
  };
};

export async function GET() {
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
      { error: "UiPath configuration is incomplete." },
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

    const tokenData = (await tokenResponse.json()) as TokenResponse;

    if (!tokenResponse.ok || !tokenData.access_token) {
      return NextResponse.json(
        { error: "Unable to authenticate with UiPath." },
        { status: 502 }
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
    };

    if (!jobsResponse.ok) {
      return NextResponse.json(
        { error: "Unable to retrieve UiPath jobs." },
        { status: 502 }
      );
    }

    const jobs = (jobsData.value ?? []).map((job) => ({
      id: job.Id ?? null,
      process: job.Release?.Name ?? job.ReleaseName ?? "Unknown process",
      state: job.State ?? "Unknown",
      createdAt: job.CreationTime ?? null,
      startedAt: job.StartTime ?? null,
      endedAt: job.EndTime ?? null,
    }));

    return NextResponse.json(
      {
        connected: true,
        generatedAt: new Date().toISOString(),
        count: jobs.length,
        jobs,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to reach UiPath Orchestrator." },
      { status: 502 }
    );
  }
}