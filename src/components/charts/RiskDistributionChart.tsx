"use client";

export default function RiskDistributionChart() {
  const risks = [
    { label: "Low", value: 45 },
    { label: "Medium", value: 30 },
    { label: "High", value: 18 },
    { label: "Critical", value: 7 },
  ];

  return (
    <div className="glass-card rounded-3xl p-6">
      <h2 className="text-xl font-bold">Risk Distribution</h2>

      <div className="mt-6 space-y-4">
        {risks.map((risk) => (
          <div key={risk.label}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-300">{risk.label}</span>
              <span className="text-slate-400">{risk.value}%</span>
            </div>

            <div className="h-3 rounded-full bg-slate-800">
              <div
                className="h-3 rounded-full bg-blue-500"
                style={{ width: `${risk.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}