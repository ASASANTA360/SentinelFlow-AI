"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import UiPathJobsPanel from "../../components/UiPathJobsPanel";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  ShieldCheck,
  Users,
} from "lucide-react";

type RiskLevel = "low" | "medium" | "high" | "critical";

type CaseRecord = {
  _id: string;
  caseId?: string | null;
  title?: string | null;
  riskLevel?: string | null;
  status?: string | null;
};

type CasesResponse = {
  cases?: CaseRecord[];
  error?: string;
};

const agents = [
  ["Case Brain Agent", "Coordinating enterprise workflow", "Active"],
  ["Document Agent", "Parsing invoices and business records", "Active"],
  ["Risk Agent", "Calculating risk and confidence score", "Active"],
  ["Exception Agent", "Detecting duplicates and policy violations", "Warning"],
  ["Human Review Agent", "Waiting for manual approval", "Pending"],
];

function formatLabel(value?: string | null) {
  if (!value) {
    return "Not set";
  }

  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function isRiskLevel(value?: string | null): value is RiskLevel {
  return (
    value === "low" ||
    value === "medium" ||
    value === "high" ||
    value === "critical"
  );
}

function riskClass(risk?: string | null) {
  const classes = {
    low: "bg-emerald-500/10 text-emerald-300",
    medium: "bg-yellow-500/10 text-yellow-300",
    high: "bg-orange-500/10 text-orange-300",
    critical: "bg-red-500/10 text-red-300",
  };

  return isRiskLevel(risk) ? classes[risk] : "bg-slate-500/10 text-slate-300";
}

export default function DashboardPage() {
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    fetch("/api/cases", { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json()) as CasesResponse;

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load dashboard data.");
        }

        if (isActive) {
          setCases(data.cases ?? []);
        }
      })
      .catch((loadError) => {
        if (isActive) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load dashboard data.",
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

  const summary = useMemo(() => {
    const totalCases = cases.length;
    const activeCases = cases.filter(
      (item) => item.status !== "resolved" && item.status !== "rejected",
    ).length;
    const highRiskCases = cases.filter(
      (item) => item.riskLevel === "high" || item.riskLevel === "critical",
    ).length;
    const resolvedCases = cases.filter(
      (item) => item.status === "resolved",
    ).length;
    const humanReviewCases = cases.filter(
      (item) => item.status === "human_review",
    ).length;
    const resolutionRate =
      totalCases === 0 ? 0 : Math.round((resolvedCases / totalCases) * 100);

    return {
      totalCases,
      activeCases,
      highRiskCases,
      resolvedCases,
      humanReviewCases,
      resolutionRate,
    };
  }, [cases]);

  const metrics = [
    {
      label: "Total Cases",
      value: summary.totalCases.toLocaleString(),
      icon: FileText,
    },
    {
      label: "Active Cases",
      value: summary.activeCases.toLocaleString(),
      icon: Clock,
    },
    {
      label: "High Risk",
      value: summary.highRiskCases.toLocaleString(),
      icon: AlertTriangle,
    },
    {
      label: "Resolution Rate",
      value: `${summary.resolutionRate}%`,
      icon: CheckCircle2,
    },
  ];

  return (
    <main className="min-h-screen bg-[#020617] p-8 text-white">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold text-blue-400">
            SentinelFlow AI Command Center
          </p>
          <h1 className="mt-2 text-4xl font-black">Dashboard</h1>
          <p className="mt-2 text-slate-400">
            Enterprise case intelligence, agent orchestration, and human review.
          </p>
        </div>

        <Link
          href="/cases"
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-500"
        >
          Review Cases
        </Link>
      </div>

      {error ? (
        <section className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </section>
      ) : null}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="glass-card rounded-3xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-400">
                  <Icon size={24} />
                </div>
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin text-slate-500" />
                ) : null}
              </div>

              <p className="mt-5 text-sm text-slate-400">{item.label}</p>
              <h2 className="mt-2 text-4xl font-black">
                {isLoading ? "..." : item.value}
              </h2>
            </div>
          );
        })}
      </section>
      <div className="mt-8">
      <UiPathJobsPanel />
    </div>
      <section className="mt-8 grid gap-6 xl:grid-cols-3">
        
        <div className="glass-card rounded-3xl p-6 xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Recent Enterprise Cases</h2>
              <p className="text-sm text-slate-400">
                Real-time case status across AI and human workflows.
              </p>
            </div>
            <ShieldCheck className="text-blue-400" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400">
                <tr>
                  <th className="p-4">Case ID</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Risk</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400">
                      <span className="inline-flex items-center gap-2">
                        <Loader2 size={18} className="animate-spin" />
                        Loading cases
                      </span>
                    </td>
                  </tr>
                ) : cases.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400">
                      No cases found.
                    </td>
                  </tr>
                ) : (
                  cases.slice(0, 6).map((item) => (
                    <tr key={item._id} className="border-t border-slate-800">
                      <td className="p-4 font-semibold text-blue-300">
                        <Link href={`/cases/${item._id}`}>
                          {item.caseId || item._id}
                        </Link>
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/cases/${item._id}`}
                          className="hover:text-blue-300"
                        >
                          {item.title || "Untitled case"}
                        </Link>
                      </td>
                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs ${riskClass(
                            item.riskLevel,
                          )}`}
                        >
                          {formatLabel(item.riskLevel)}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">
                        {formatLabel(item.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <div className="mb-6 flex items-center gap-3">
            <Bot className="text-blue-400" />
            <div>
              <h2 className="text-2xl font-bold">Agent Status</h2>
              <p className="text-sm text-slate-400">Multi-agent engine</p>
            </div>
          </div>

          <div className="space-y-4">
            {agents.map(([name, task, status]) => (
              <div
                key={name}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{name}</h3>
                  <span className="text-xs text-blue-300">{status}</span>
                </div>
                <p className="mt-1 text-sm text-slate-400">{task}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-3xl p-6">
          <Users className="mb-4 text-purple-400" />
          <h3 className="text-xl font-bold">Human Reviews</h3>
          <p className="mt-3 text-4xl font-black">
            {isLoading ? "..." : summary.humanReviewCases.toLocaleString()}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Cases currently routed to human reviewers.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <CheckCircle2 className="mb-4 text-emerald-400" />
          <h3 className="text-xl font-bold">Resolved Cases</h3>
          <p className="mt-3 text-4xl font-black">
            {isLoading ? "..." : summary.resolvedCases.toLocaleString()}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Cases marked resolved in the case database.
          </p>
        </div>
      </section>
    </main>
  );
}
