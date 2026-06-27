"use client";

import { useCallback, useEffect, useState } from "react";

type UiPathJob = {
  process: string;
  state: string;
  createdAt: string | null;
  startedAt: string | null;
  endedAt: string | null;
};

type JobsResponse = {
  connected: boolean;
  generatedAt: string;
  count: number;
  jobs: UiPathJob[];
  error?: string;
};

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function stateStyle(state: string) {
  const normalized = state.toLowerCase();

  if (normalized === "running") {
    return "border-blue-500/30 bg-blue-500/10 text-blue-300";
  }

  if (normalized === "successful") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  }

  if (normalized === "faulted" || normalized === "failed") {
    return "border-red-500/30 bg-red-500/10 text-red-300";
  }

  return "border-slate-500/30 bg-slate-500/10 text-slate-300";
}

export default function UiPathJobsPanel() {
  const [data, setData] = useState<JobsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadJobs = useCallback(async (manual = false) => {
    try {
      if (manual) setRefreshing(true);

      const response = await fetch("/api/uipath/jobs", {
        cache: "no-store",
      });

      const result = (await response.json()) as JobsResponse;

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to retrieve UiPath jobs.");
      }

      setData(result);
    } catch (error) {
      setData({
        connected: false,
        generatedAt: new Date().toISOString(),
        count: 0,
        jobs: [],
        error:
          error instanceof Error
            ? error.message
            : "Unable to retrieve UiPath jobs.",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();

    const interval = setInterval(() => {
      loadJobs();
    }, 20000);

    return () => clearInterval(interval);
  }, [loadJobs]);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-blue-300">UiPath Orchestrator</p>
          <h2 className="text-xl font-semibold text-white">Live Automation Jobs</h2>
          <p className="mt-1 text-sm text-slate-400">
            Latest workflow activity from SentinelFlow Maestro.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadJobs(true)}
          disabled={refreshing}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-slate-400">
          Loading UiPath jobs...
        </p>
      ) : data?.error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          UiPath status is temporarily unavailable: {data.error}
        </div>
      ) : data?.jobs.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="border-b border-slate-800 text-slate-400">
              <tr>
                <th className="px-3 py-3 font-medium">Process</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Started</th>
                <th className="px-3 py-3 font-medium">Ended</th>
              </tr>
            </thead>
            <tbody>
              {data.jobs.map((job, index) => (
                <tr key={`${job.process}-${job.createdAt}-${index}`} className="border-b border-slate-900">
                  <td className="px-3 py-4 font-medium text-white">
                    {job.process}
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${stateStyle(
                        job.state
                      )}`}
                    >
                      {job.state}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-slate-300">
                    {formatDate(job.startedAt)}
                  </td>
                  <td className="px-3 py-4 text-slate-300">
                    {formatDate(job.endedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-slate-400">
          No UiPath jobs found in this folder.
        </p>
      )}

      {data?.generatedAt && !data.error && (
        <p className="mt-4 text-xs text-slate-500">
          Last updated: {formatDate(data.generatedAt)} · {data.count} job(s)
        </p>
      )}
    </section>
  );
}