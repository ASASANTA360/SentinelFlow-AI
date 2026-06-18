"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Low", value: 45 },
  { name: "Medium", value: 30 },
  { name: "High", value: 18 },
  { name: "Critical", value: 7 },
];

const COLORS = [
  "#10B981",
  "#FACC15",
  "#F97316",
  "#EF4444",
];

export default function RiskDistributionChart() {
  return (
    <div className="glass-card rounded-3xl p-6">
      <h2 className="mb-5 text-xl font-bold">
        Risk Distribution
      </h2>

      <div className="h-[300px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={100}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}