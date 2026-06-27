"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, FileText, Loader2 } from "lucide-react";

type PopulatedCase = {
  _id: string;
  caseId?: string | null;
  title?: string | null;
};

type AuditEntry = {
  _id: string;
  caseId?: PopulatedCase | string | null;
  action: string;
  actor?: string | null;
  performedBy?: string | null;
  createdAt?: string | null;
};

type AuditResponse = {
  logs?: AuditEntry[];
  error?: string;
};

function formatDate(value?: string | null) {
  if (!value) {
    return "Not recorded";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function populatedCase(value?: PopulatedCase | string | null) {
  return value && typeof value === "object" ? value : null;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    fetch("/api/audit", { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json()) as AuditResponse;

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load audit logs.");
        }

        if (isActive) {
          setLogs(data.logs ?? []);
        }
      })
      .catch((loadError) => {
        if (isActive) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load audit logs.",
          );
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#020617] p-8 text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Audit Logs</h1>
        <p className="mt-2 text-slate-400">
          Recorded audit entries from case workflow actions.
        </p>
      </div>

      {isLoading ? (
        <section className="glass-card rounded-3xl p-8 text-center text-slate-300">
          <span className="inline-flex items-center gap-3">
            <Loader2 className="animate-spin text-blue-400" />
            Loading audit logs
          </span>
        </section>
      ) : error ? (
        <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </section>
      ) : logs.length === 0 ? (
        <section className="glass-card rounded-3xl p-8 text-center text-slate-400">
          No audit entries recorded.
        </section>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => {
            const linkedCase = populatedCase(log.caseId);
            const actor = log.actor || log.performedBy || "system";

            return (
              <div key={log._id} className="glass-card rounded-2xl p-5">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <FileText size={18} className="text-blue-400" />
                      <p className="font-semibold">{log.action}</p>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">
                      Actor {actor}
                    </p>
                    {linkedCase ? (
                      <Link
                        href={`/cases/${linkedCase._id}`}
                        className="mt-2 inline-block text-sm text-blue-300 hover:text-blue-200"
                      >
                        {linkedCase.caseId || linkedCase._id} ·{" "}
                        {linkedCase.title || "Untitled case"}
                      </Link>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">
                        No linked case details available.
                      </p>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm text-slate-400">
                    <Clock size={16} />
                    {formatDate(log.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
