"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Users,
} from "lucide-react";
import RiskDistributionChart from "../../components/charts/RiskDistributionChart";

type AnalyticsResponse = {
  totalCases: number;
  activeCases: number;
  highRiskCases: number;
  resolvedCases: number;
  humanReviewCases: number;
  resolutionRate: number;
  byStatus: Record<string, number>;
  byRiskLevel: Record<string, number>;
  error?: string;
};

function formatLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    fetch("/api/analytics", { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json()) as AnalyticsResponse;

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load analytics.");
        }

        if (isActive) {
          setAnalytics(data);
        }
      })
      .catch((loadError) => {
        if (isActive) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load analytics.",
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

  const metricCards = analytics
    ? [
        { label: "Total Cases", value: analytics.totalCases, icon: FileText },
        { label: "Active Cases", value: analytics.activeCases, icon: Clock },
        {
          label: "High Risk",
          value: analytics.highRiskCases,
          icon: AlertTriangle,
        },
        {
          label: "Human Reviews",
          value: analytics.humanReviewCases,
          icon: Users,
        },
      ]
    : [];

  return (
    <main className="min-h-screen bg-[#020617] p-8 text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-black">Analytics</h1>
        <p className="mt-2 text-slate-400">
          Enterprise risk, resolution, and case workflow insights.
        </p>
      </div>

      {isLoading ? (
        <section className="glass-card rounded-3xl p-8 text-center text-slate-300">
          <span className="inline-flex items-center gap-3">
            <Loader2 className="animate-spin text-blue-400" />
            Loading analytics
          </span>
        </section>
      ) : error ? (
        <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </section>
      ) : !analytics || analytics.totalCases === 0 ? (
        <section className="glass-card rounded-3xl p-8 text-center text-slate-400">
          No cases found for analytics.
        </section>
      ) : (
        <>
          <section className="mb-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {metricCards.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="glass-card rounded-3xl p-6">
                  <Icon className="mb-4 text-blue-400" />
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="mt-2 text-4xl font-black">
                    {item.value.toLocaleString()}
                  </p>
                </div>
              );
            })}
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <RiskDistributionChart
              counts={analytics.byRiskLevel}
              total={analytics.totalCases}
            />

            <div className="glass-card rounded-3xl p-6">
              <h2 className="text-xl font-bold">Resolution Performance</h2>
              <CheckCircle2 className="mt-6 text-emerald-400" />
              <p className="mt-4 text-5xl font-black">
                {analytics.resolutionRate}%
              </p>
              <p className="mt-2 text-slate-400">
                {analytics.resolvedCases.toLocaleString()} of{" "}
                {analytics.totalCases.toLocaleString()} cases resolved.
              </p>
            </div>
          </div>

          <section className="mt-6 glass-card rounded-3xl p-6">
            <h2 className="text-xl font-bold">Status Distribution</h2>
            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {Object.entries(analytics.byStatus).map(([status, count]) => (
                <div
                  key={status}
                  className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                >
                  <p className="text-sm text-slate-400">{formatLabel(status)}</p>
                  <p className="mt-2 text-2xl font-bold">
                    {count.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
