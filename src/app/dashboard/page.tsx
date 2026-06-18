import Link from "next/link";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Clock,
  FileText,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

const metrics = [
  {
    label: "Total Cases",
    value: "1,248",
    change: "+18%",
    icon: FileText,
  },
  {
    label: "Active Cases",
    value: "84",
    change: "+7%",
    icon: Clock,
  },
  {
    label: "High Risk",
    value: "19",
    change: "-4%",
    icon: AlertTriangle,
  },
  {
    label: "AI Accuracy",
    value: "98%",
    change: "+2%",
    icon: TrendingUp,
  },
];

const agents = [
  ["Case Brain Agent", "Coordinating enterprise workflow", "Active"],
  ["Document Agent", "Parsing invoices and business records", "Active"],
  ["Risk Agent", "Calculating risk and confidence score", "Active"],
  ["Exception Agent", "Detecting duplicates and policy violations", "Warning"],
  ["Human Review Agent", "Waiting for manual approval", "Pending"],
];

const cases = [
  ["CASE-001", "Invoice Exception Review", "High", "Human Review"],
  ["CASE-002", "Customer Complaint Resolution", "Medium", "In Progress"],
  ["CASE-003", "KYC Verification Case", "Low", "Resolved"],
  ["CASE-004", "Procurement Approval", "Critical", "Escalated"],
];

export default function DashboardPage() {
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
                <span className="text-sm text-emerald-400">{item.change}</span>
              </div>

              <p className="mt-5 text-sm text-slate-400">{item.label}</p>
              <h2 className="mt-2 text-4xl font-black">{item.value}</h2>
            </div>
          );
        })}
      </section>

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
                {cases.map(([id, title, risk, status]) => (
                  <tr key={id} className="border-t border-slate-800">
                    <td className="p-4 font-semibold text-blue-300">{id}</td>
                    <td className="p-4">{title}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-300">
                        {risk}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{status}</td>
                  </tr>
                ))}
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

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="glass-card rounded-3xl p-6">
          <CheckCircle2 className="mb-4 text-emerald-400" />
          <h3 className="text-xl font-bold">Resolution Rate</h3>
          <p className="mt-3 text-4xl font-black">91%</p>
          <p className="mt-2 text-sm text-slate-400">
            Cases resolved through AI + human collaboration.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <Users className="mb-4 text-purple-400" />
          <h3 className="text-xl font-bold">Human Reviews</h3>
          <p className="mt-3 text-4xl font-black">27</p>
          <p className="mt-2 text-sm text-slate-400">
            High-impact cases routed to human reviewers.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <AlertTriangle className="mb-4 text-red-400" />
          <h3 className="text-xl font-bold">Exceptions Detected</h3>
          <p className="mt-3 text-4xl font-black">43</p>
          <p className="mt-2 text-sm text-slate-400">
            Duplicate, missing data, fraud, and policy issues.
          </p>
        </div>
      </section>
    </main>
  );
}