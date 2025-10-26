"use client";

import dynamic from "next/dynamic";

type DataItem = { name: string; value: number };

// carregar Recharts apenas no cliente
const DashboardCharts = dynamic(() => import("./DashboardCharts"), {
  ssr: false,
});

export function DashboardWrapper({ chartData }: { chartData: DataItem[] }) {
  return (
    <section>
      <h3 className="text-lg font-medium mb-4">Distribuição de Gastos</h3>
      <DashboardCharts chartData={chartData} />
    </section>
  );
}
