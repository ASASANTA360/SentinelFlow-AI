"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Bot,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";

type CaseRecord = {
  _id: string;
  title: string;
  description: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  status:
    | "pending"
    | "in_progress"
    | "human_review"
    | "escalated"
    | "resolved"
    | "rejected";
  score: number;
  assignedAgent?: string;
  aiSummary?: string;
  recommendation?: string;
  priority?: string;
  lastUpdatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

type CaseEvent = {
  _id: string;
  type: string;
  message: string;
  actor: string;
  metadata?: unknown;
  createdAt?: string;
};

type AuditLog = {
  _id: string;
  action: string;
  actor: string;
  details?: unknown;
  createdAt?: string;
};

type CaseResponse = {
  case: CaseRecord;
  events: CaseEvent[];
  auditLogs: AuditLog[];
};

function formatLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(value?: string) {
  if (!value) {
    return "Not recorded";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function detailsText(value: unknown) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value);
}

export default function CaseDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [data, setData] = useState<CaseResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState("");
  const [error, setError] = useState("");
  const [missingCase, setMissingCase] = useState(false);

  const loadCase = useCallback(async () => {
    if (!id) {
      return;
    }

    setIsLoading(true);
    setError("");
    setMissingCase(false);

    try {
      const response = await fetch(`/api/cases/${id}`, {
        cache: "no-store",
      });
      const responseData = await response.json();

      if (response.status === 404) {
        setMissingCase(true);
        setData(null);
        return;
      }

      if (!response.ok) {
        throw new Error(responseData?.error ?? "Failed to load case.");
      }

      setData(responseData);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load case."
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let isActive = true;

    if (!id) {
      return () => {
        isActive = false;
      };
    }

    fetch(`/api/cases/${id}`, {
      cache: "no-store",
    })
      .then(async (response) => {
        const responseData = await response.json();

        if (response.status === 404) {
          if (isActive) {
            setMissingCase(true);
            setData(null);
          }

          return;
        }

        if (!response.ok) {
          throw new Error(responseData?.error ?? "Failed to load case.");
        }

        if (isActive) {
          setData(responseData);
        }
      })
      .catch((loadError) => {
        if (isActive) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load case."
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
  }, [id]);

  async function updateStatus(status: CaseRecord["status"]) {
    if (!id) {
      return;
    }

    setIsUpdating(status);
    setError("");

    try {
      const response = await fetch(`/api/cases/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData?.error ?? "Failed to update case.");
      }

      await loadCase();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update case."
      );
    } finally {
      setIsUpdating("");
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020617] p-8 text-white">
        <span className="inline-flex items-center gap-3 text-slate-300">
          <Loader2 className="animate-spin text-blue-400" />
          Loading case
        </span>
      </main>
    );
  }

  if (missingCase) {
    return (
      <main className="min-h-screen bg-[#020617] p-8 text-white">
        <Link
          href="/cases"
          className="mb-8 inline-flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200"
        >
          <ArrowLeft size={16} />
          Back to cases
        </Link>
        <section className="glass-card rounded-3xl p-8 text-center">
          <AlertCircle className="mx-auto mb-4 text-yellow-300" />
          <h1 className="text-3xl font-bold">Case not found</h1>
          <p className="mt-3 text-slate-400">
            The requested case does not exist in the database.
          </p>
        </section>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#020617] p-8 text-white">
        <section className="glass-card rounded-3xl p-8 text-center text-red-300">
          {error || "Unable to load case."}
        </section>
      </main>
    );
  }

  const caseRecord = data.case;

  return (
    <main className="min-h-screen bg-[#020617] p-8 text-white">
      <Link
        href="/cases"
        className="mb-8 inline-flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200"
      >
        <ArrowLeft size={16} />
        Back to cases
      </Link>

      <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="font-mono text-sm font-semibold text-blue-400">
            {caseRecord._id}
          </p>
          <h1 className="mt-2 text-4xl font-black">{caseRecord.title}</h1>
          <p className="mt-2 max-w-3xl text-slate-400">
            {caseRecord.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={Boolean(isUpdating)}
            onClick={() => updateStatus("human_review")}
            className="inline-flex items-center gap-2 rounded-2xl border border-purple-500/30 bg-purple-500/10 px-4 py-3 text-sm font-semibold text-purple-200 hover:bg-purple-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdating === "human_review" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Clock size={16} />
            )}
            Send to Human Review
          </button>

          <button
            type="button"
            disabled={Boolean(isUpdating)}
            onClick={() => updateStatus("resolved")}
            className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdating === "resolved" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CheckCircle2 size={16} />
            )}
            Resolve Case
          </button>

          <button
            type="button"
            disabled={Boolean(isUpdating)}
            onClick={() => updateStatus("rejected")}
            className="inline-flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdating === "rejected" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <XCircle size={16} />
            )}
            Reject Case
          </button>
        </div>
      </div>

      {error ? (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="glass-card rounded-3xl p-6">
          <ShieldCheck className="mb-4 text-blue-400" />
          <h2 className="text-xl font-bold">Risk Level</h2>
          <p className="mt-3 text-4xl font-black">
            {formatLabel(caseRecord.riskLevel)}
          </p>
          <p className="mt-2 text-slate-400">Score {caseRecord.score ?? 0}</p>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <Clock className="mb-4 text-yellow-400" />
          <h2 className="text-xl font-bold">Status</h2>
          <p className="mt-3 text-4xl font-black">
            {formatLabel(caseRecord.status)}
          </p>
          <p className="mt-2 text-slate-400">
            Updated {formatDate(caseRecord.updatedAt)}
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <Bot className="mb-4 text-emerald-400" />
          <h2 className="text-xl font-bold">Assigned Agent</h2>
          <p className="mt-3 text-3xl font-black">
            {caseRecord.assignedAgent || "Case Brain Agent"}
          </p>
          <p className="mt-2 text-slate-400">
            Priority {caseRecord.priority || "not set"}
          </p>
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="glass-card rounded-3xl p-6">
          <div className="mb-6 flex items-center gap-3">
            <Bot className="text-blue-400" />
            <h2 className="text-2xl font-bold">AI Summary</h2>
          </div>

          <p className="leading-7 text-slate-300">
            {caseRecord.aiSummary ||
              "No AI summary has been recorded for this case."}
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <div className="mb-6 flex items-center gap-3">
            <FileText className="text-purple-400" />
            <h2 className="text-2xl font-bold">Recommendation</h2>
          </div>

          <p className="leading-7 text-slate-300">
            {caseRecord.recommendation ||
              "No recommendation has been recorded for this case."}
          </p>
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="glass-card rounded-3xl p-6">
          <div className="mb-6 flex items-center gap-3">
            <CheckCircle2 className="text-emerald-400" />
            <h2 className="text-2xl font-bold">Events</h2>
          </div>

          <div className="space-y-4">
            {data.events.length === 0 ? (
              <p className="text-slate-400">No events recorded.</p>
            ) : (
              data.events.map((event) => (
                <div
                  key={event._id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">{event.message}</p>
                    <span className="text-xs text-slate-500">
                      {formatDate(event.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    {formatLabel(event.type)} by {event.actor}
                  </p>
                  {event.metadata ? (
                    <p className="mt-3 break-words rounded-xl bg-slate-900 p-3 font-mono text-xs text-slate-400">
                      {detailsText(event.metadata)}
                    </p>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <div className="mb-6 flex items-center gap-3">
            <FileText className="text-blue-400" />
            <h2 className="text-2xl font-bold">Audit Logs</h2>
          </div>

          <div className="space-y-4">
            {data.auditLogs.length === 0 ? (
              <p className="text-slate-400">No audit logs recorded.</p>
            ) : (
              data.auditLogs.map((log) => (
                <div
                  key={log._id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">{log.action}</p>
                    <span className="text-xs text-slate-500">
                      {formatDate(log.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">Actor {log.actor}</p>
                  {log.details ? (
                    <p className="mt-3 break-words rounded-xl bg-slate-900 p-3 font-mono text-xs text-slate-400">
                      {detailsText(log.details)}
                    </p>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
