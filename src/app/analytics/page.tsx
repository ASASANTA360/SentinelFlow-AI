import RiskDistributionChart from "../../components/charts/RiskDistributionChart";

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-[#020617] p-8 text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-black">Analytics</h1>
        <p className="mt-2 text-slate-400">
          Enterprise risk, resolution, and agent performance insights.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RiskDistributionChart />

        <div className="glass-card rounded-3xl p-6">
          <h2 className="text-xl font-bold">Resolution Performance</h2>
          <p className="mt-6 text-5xl font-black">91%</p>
          <p className="mt-2 text-slate-400">
            Cases resolved through AI-assisted workflows.
          </p>
        </div>
      </div>
    </main>
  );
}