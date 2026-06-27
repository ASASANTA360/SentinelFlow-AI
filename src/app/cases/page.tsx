"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Loader2, Plus, Search } from "lucide-react";

type RiskLevel = "low" | "medium" | "high" | "critical";
type CaseStatus =
  | "pending"
  | "in_progress"
  | "human_review"
  | "escalated"
  | "resolved"
  | "rejected";

type CaseRecord = {
  _id: string;
  title?: string | null;
  description?: string | null;
  riskLevel?: RiskLevel | null;
  status?: CaseStatus | null;
  score?: number | null;
  priority?: string | null;
  assignedAgent?: string | null;
  createdAt?: string | null;
};

const riskLevels = ["low", "medium", "high", "critical"] as const;

function formatLabel(value?: string | null) {
  if (!value) {
    return "Not set";
  }

  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function riskClass(risk?: RiskLevel | null) {
  const classes = {
    low: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    medium: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
    high: "bg-orange-500/10 text-orange-300 border-orange-500/30",
    critical: "bg-red-500/10 text-red-300 border-red-500/30",
  };

  return risk
    ? classes[risk]
    : "bg-slate-500/10 text-slate-300 border-slate-500/30";
}

function statusClass(status?: CaseStatus | null) {
  const classes = {
    pending: "bg-slate-500/10 text-slate-300 border-slate-500/30",
    in_progress: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    human_review: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    escalated: "bg-red-500/10 text-red-300 border-red-500/30",
    resolved: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    rejected: "bg-zinc-500/10 text-zinc-300 border-zinc-500/30",
  };

  return status
    ? classes[status]
    : "bg-slate-500/10 text-slate-300 border-slate-500/30";
}

export default function CasesPage() {
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("low");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  async function loadCases(query = search) {
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (query.trim()) {
        params.set("q", query.trim());
      }

      const response = await fetch(`/api/cases?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "Failed to load cases.");
      }

      setCases(data.cases ?? []);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load cases."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isActive = true;

    fetch("/api/cases?", {
      cache: "no-store",
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error ?? "Failed to load cases.");
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
              : "Failed to load cases."
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

  async function handleCreateCase(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setIsCreating(true);

    try {
      const response = await fetch("/api/cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          priority,
          riskLevel,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "Failed to create case.");
      }

      setTitle("");
      setDescription("");
      setPriority("");
      setRiskLevel("low");
      await loadCases(search);
    } catch (createError) {
      setFormError(
        createError instanceof Error
          ? createError.message
          : "Failed to create case."
      );
    } finally {
      setIsCreating(false);
    }
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loadCases(search);
  }

  return (
    <main className="min-h-screen bg-[#020617] p-8 text-white">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Cases</h1>
          <p className="mt-2 text-slate-400">
            Enterprise case management backed by live case records.
          </p>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3"
        >
          <Search size={18} className="text-slate-400" />
          <input
            className="w-72 bg-transparent text-sm outline-none placeholder:text-slate-500"
            placeholder="Search title or case ID"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
          >
            Search
          </button>
        </form>
      </div>

      <section className="mb-8 glass-card rounded-3xl p-6">
        <div className="mb-5 flex items-center gap-3">
          <Plus className="text-blue-400" size={20} />
          <h2 className="text-2xl font-bold">Create Case</h2>
        </div>

        <form onSubmit={handleCreateCase} className="grid gap-4 lg:grid-cols-4">
          <input
            className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-blue-500"
            placeholder="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />

          <input
            className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-blue-500 lg:col-span-2"
            placeholder="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />

          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-4">
            <input
              className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-blue-500"
              placeholder="Priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            />

            <select
              className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-blue-500"
              value={riskLevel}
              onChange={(event) =>
                setRiskLevel(event.target.value as RiskLevel)
              }
            >
              {riskLevels.map((risk) => (
                <option key={risk} value={risk}>
                  {formatLabel(risk)}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={isCreating}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreating ? <Loader2 size={16} className="animate-spin" /> : null}
              Create Case
            </button>
          </div>
        </form>

        {formError ? (
          <p className="mt-4 flex items-center gap-2 text-sm text-red-300">
            <AlertCircle size={16} />
            {formError}
          </p>
        ) : null}
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-800">
        <table className="w-full min-w-[820px]">
          <thead className="bg-slate-950 text-slate-400">
            <tr>
              <th className="p-5 text-left">Case ID</th>
              <th className="p-5 text-left">Title</th>
              <th className="p-5 text-left">Risk</th>
              <th className="p-5 text-left">Status</th>
              <th className="p-5 text-left">Score</th>
              <th className="p-5 text-left">Priority</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  <span className="inline-flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    Loading cases
                  </span>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-red-300">
                  {error}
                </td>
              </tr>
            ) : cases.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  No cases found.
                </td>
              </tr>
            ) : (
              cases.map((item) => (
                <tr key={item._id} className="border-t border-slate-800">
                  <td className="p-5 font-mono text-sm text-blue-400">
                    {item._id}
                  </td>

                  <td className="p-5">
                    <Link
                      href={`/cases/${item._id}`}
                      className="font-semibold text-blue-400 hover:text-blue-300"
                    >
                      {item.title || "Untitled case"}
                    </Link>
                    <p className="mt-1 line-clamp-1 max-w-md text-sm text-slate-500">
                      {item.description || "No description provided."}
                    </p>
                  </td>

                  <td className="p-5">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${riskClass(
                        item.riskLevel
                      )}`}
                    >
                      {formatLabel(item.riskLevel)}
                    </span>
                  </td>

                  <td className="p-5">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(
                        item.status
                      )}`}
                    >
                      {formatLabel(item.status)}
                    </span>
                  </td>

                  <td className="p-5 text-slate-300">{item.score ?? 0}</td>
                  <td className="p-5 text-slate-300">
                    {item.priority || "Not set"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
