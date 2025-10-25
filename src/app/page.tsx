import type { Metadata } from "next";
import type { ReactElement } from "react";
import { DashboardWrapper } from "@/components/DashboardWrapper";

export const metadata: Metadata = {
  title: "Dashboard - ControlaAí",
  description: "Resumo financeiro mensal e gráficos",
};

type DashboardResponse = {
  rendaTotal: number;
  contasMensaisTotal: number;
  parcelasTotal: number;
  gastosVariaveisTotal: number;
  totalGastos: number;
  saldo: number;
  chartData: { name: string; value: number }[];
};

async function getDashboardData(): Promise<DashboardResponse | null> {
  try {
    const res = await fetch("/api/dashboard", { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as DashboardResponse;
  } catch (err) {
    console.error("Erro ao buscar dados do dashboard", err);
    return null;
  }
}

export default async function Home(): Promise<ReactElement> {
  const data = await getDashboardData();

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Resumo Mensal</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 bg-white rounded shadow">
              <p className="text-sm text-slate-500">Receitas</p>
              <p className="mt-2 text-xl font-bold">
                {data ? `R$ ${data.rendaTotal.toFixed(2)}` : "-"}
              </p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <p className="text-sm text-slate-500">Gastos Fixos</p>
              <p className="mt-2 text-xl font-bold">
                {data ? `R$ ${data.contasMensaisTotal.toFixed(2)}` : "-"}
              </p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <p className="text-sm text-slate-500">Parcelas</p>
              <p className="mt-2 text-xl font-bold">
                {data ? `R$ ${data.parcelasTotal.toFixed(2)}` : "-"}
              </p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <p className="text-sm text-slate-500">Saldo</p>
              <p className="mt-2 text-xl font-bold text-emerald-600">
                {data ? `R$ ${data.saldo.toFixed(2)}` : "-"}
              </p>
            </div>
          </div>

          {/* componente wrapper cliente que carrega Recharts */}
          <DashboardWrapper chartData={data?.chartData ?? []} />
        </div>

        <aside className="col-span-1">
          <div className="p-4 bg-white rounded shadow">
            <h3 className="text-lg font-medium mb-2">Detalhes</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>
                Gastos Variáveis:{" "}
                {data ? `R$ ${data.gastosVariaveisTotal.toFixed(2)}` : "-"}
              </li>
              <li>
                Total Gastos: {data ? `R$ ${data.totalGastos.toFixed(2)}` : "-"}
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
