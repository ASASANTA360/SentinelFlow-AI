import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Brain,
  ShieldCheck,
  Workflow,
  BarChart3,
  FileSearch,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Case Brain Agent",
    desc: "Coordinates every agent, decision, escalation, and resolution.",
  },
  {
    icon: FileSearch,
    title: "Document Intelligence",
    desc: "Analyzes invoices, emails, complaints, and business documents.",
  },
  {
    icon: ShieldCheck,
    title: "Risk & Exception Detection",
    desc: "Detects fraud, missing data, duplicate records, and policy violations.",
  },
  {
    icon: Workflow,
    title: "UiPath Maestro Ready",
    desc: "Designed for enterprise orchestration, human approvals, and automation.",
  },
  {
    icon: Bot,
    title: "Multi-Agent Workflow",
    desc: "Specialized agents collaborate across intake, review, resolution, and audit.",
  },
  {
    icon: BarChart3,
    title: "Operational Analytics",
    desc: "Track resolution rate, risk levels, agent performance, and audit history.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="text-xl font-bold">
          SentinelFlow <span className="gradient-text">AI</span>
        </div>

        <div className="hidden gap-6 text-sm text-slate-300 md:flex">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/cases">Cases</Link>
          <Link href="/analytics">Analytics</Link>
          <Link href="/about">About</Link>
        </div>

        <Link
          href="/dashboard"
          className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold hover:bg-blue-500"
        >
          Launch Demo
        </Link>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            UiPath AgentHack • Maestro Case • Enterprise AI
          </div>

          <h1 className="text-5xl font-black leading-tight md:text-7xl">
            Autonomous Enterprise{" "}
            <span className="gradient-text">Case Intelligence</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            SentinelFlow AI uses multi-agent intelligence, human approval,
            exception handling, and UiPath orchestration to resolve complex
            business cases end-to-end.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
            >
              Start Live Demo <ArrowRight size={18} />
            </Link>

            <Link
              href="/cases"
              className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-200 hover:bg-slate-900"
            >
              View Cases
            </Link>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 shadow-2xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Live Case</p>
              <h3 className="text-2xl font-bold">Invoice Exception Review</h3>
            </div>
            <span className="rounded-full bg-red-500/20 px-3 py-1 text-sm text-red-300">
              High Risk
            </span>
          </div>

          <div className="space-y-4">
            {[
              ["Case Brain Agent", "Coordinating workflow", "Active"],
              ["Document Agent", "Extracted invoice fields", "Done"],
              ["Risk Agent", "Generated risk score 86", "Done"],
              ["Exception Agent", "Duplicate invoice detected", "Warning"],
              ["Human Review", "Approval required", "Pending"],
            ].map(([agent, action, status]) => (
              <div
                key={agent}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{agent}</h4>
                  <span className="text-sm text-blue-300">{status}</span>
                </div>
                <p className="mt-1 text-sm text-slate-400">{action}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold md:text-5xl">
            Built for judging criteria
          </h2>
          <p className="mt-4 text-slate-400">
            Business impact, platform usage, technical execution, completeness,
            creativity, and presentation.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div key={feature.title} className="glass-card rounded-2xl p-6">
                <Icon className="mb-4 text-blue-400" size={32} />
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}