"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Loader2 } from "lucide-react";

type PopulatedCase = {
  _id: string;
  caseId?: string | null;
  title?: string | null;
};

type TimelineEvent = {
  _id: string;
  caseId?: PopulatedCase | string | null;
  type: string;
  message: string;
  actor: string;
  createdAt?: string | null;
};

type TimelineResponse = {
  events?: TimelineEvent[];
  error?: string;
};

function formatLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

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

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    fetch("/api/timeline", { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json()) as TimelineResponse;

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load timeline.");
        }

        if (isActive) {
          setEvents(data.events ?? []);
        }
      })
      .catch((loadError) => {
        if (isActive) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load timeline.",
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
        <h1 className="text-4xl font-bold">Timeline</h1>
        <p className="mt-2 text-slate-400">
          Case events recorded by SentinelFlow workflows.
        </p>
      </div>

      {isLoading ? (
        <section className="glass-card rounded-3xl p-8 text-center text-slate-300">
          <span className="inline-flex items-center gap-3">
            <Loader2 className="animate-spin text-blue-400" />
            Loading timeline
          </span>
        </section>
      ) : error ? (
        <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </section>
      ) : events.length === 0 ? (
        <section className="glass-card rounded-3xl p-8 text-center text-slate-400">
          No case events recorded.
        </section>
      ) : (
        <div className="space-y-5">
          {events.map((event) => {
            const linkedCase = populatedCase(event.caseId);

            return (
              <div key={event._id} className="glass-card rounded-2xl p-5">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                        {formatLabel(event.type)}
                      </span>
                      <span className="text-sm text-slate-500">
                        Actor {event.actor}
                      </span>
                    </div>
                    <p className="mt-3 text-lg font-semibold">
                      {event.message}
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
                    {formatDate(event.createdAt)}
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
