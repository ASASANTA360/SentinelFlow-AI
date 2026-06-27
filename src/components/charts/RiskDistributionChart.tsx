"use client";

type RiskDistributionChartProps = {
  counts: Record<string, number>;
  total: number;
};

function formatLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function RiskDistributionChart({
  counts,
  total,
}: RiskDistributionChartProps) {
  const risks = Object.entries(counts);

  return (
    <div className="glass-card rounded-3xl p-6">
      <h2 className="text-xl font-bold">Risk Distribution</h2>

      <div className="mt-6 space-y-4">
        {risks.map(([risk, count]) => {
          const percentage = total === 0 ? 0 : Math.round((count / total) * 100);

          return (
            <div key={risk}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-300">{formatLabel(risk)}</span>
                <span className="text-slate-400">
                  {count} ({percentage}%)
                </span>
              </div>

              <div className="h-3 rounded-full bg-slate-800">
                <div
                  className="h-3 rounded-full bg-blue-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
