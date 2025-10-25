"use client";

import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const COLORS = [
  "#4F46E5",
  "#06B6D4",
  "#F59E0B",
  "#EF4444",
  "#10B981",
  "#8B5CF6",
];

type DataItem = { name: string; value: number };

export default function DashboardCharts({
  chartData,
}: {
  chartData: DataItem[];
}) {
  if (!chartData || chartData.length === 0) {
    return <p className="text-sm text-slate-500">Nenhum dado para exibir.</p>;
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <div className="w-full h-56 bg-white rounded shadow p-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={4}
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <ReTooltip
              formatter={(value: number) => `R$ ${value.toFixed(2)}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full h-56 bg-white rounded shadow p-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
            <Bar dataKey="value" fill={COLORS[0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
