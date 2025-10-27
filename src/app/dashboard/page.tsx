import type { Metadata } from "next";
import { DashboardWrapper } from "@/components/DashboardWrapper";
import { cookies } from "next/headers";
import { formatCurrency } from "@/utils/functions/handle-currency";

export const metadata: Metadata = {
  title: "Dashboard - ControlaAí",
};

// This route uses server-side cookies to fetch user-specific data.
// Force dynamic rendering to avoid static prerender errors.
export const dynamic = "force-dynamic";

async function getDashboard() {
  try {
    const cookieStore = await cookies(); // ✅ Cookies no servidor

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/dashboard`, {
      cache: "no-store",
      headers: {
        Cookie: cookieStore.toString(), // ✅ Envia cookie da sessão
      },
    });

    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.log("ERRO NO DASHBOARD FETCH:", err);
    return null;
  }
}

export default async function Home() {
  const data = await getDashboard();

  return (
    <div className="px-6 py-14 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* COLUNA PRINCIPAL */}
      <div className="col-span-2 space-y-6">
        {/* TÍTULO */}
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#111]">
          Resumo Mensal
        </h2>
        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Receitas",
              value: data?.rendaTotal,
              footer: `${data?.qtdRendas || 0} entradas`,
            },
            {
              label: "Contas Fixas",
              value: data?.contasMensaisTotal,
              footer: `${data?.qtdContasMensais || 0} contas`,
            },
            {
              label: "Parcelas",
              value: data?.parcelasTotal,
              footer: `${data?.qtdParcelas || 0} parcelas`,
            },
            {
              label: "Saldo",
              value: data?.saldo,
              footer: data?.saldo >= 0 ? "Positivo" : "Negativo",
              className: data?.saldo >= 0 ? "text-emerald-600" : "text-red-600",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200 shadow-sm hover:shadow-md transition"
            >
              <p className="text-sm text-slate-500">{item.label}</p>
              <p
                className={`mt-1 text-xl sm:text-2xl font-semibold ${
                  item.className || "text-[#111]"
                }`}
              >
                {data ? `${formatCurrency(item.value)}` : "-"}
              </p>
              <p className="text-xs text-slate-400 mt-1">{item.footer}</p>
            </div>
          ))}
        </div>

        {/* GRÁFICO */}
        <div className="rounded-2xl p-4 bg-white/70 backdrop-blur-md border border-slate-200 shadow-sm">
          <DashboardWrapper chartData={data?.chartData ?? []} />
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="col-span-2 md:col-span-1 space-y-4">
        <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200 shadow-sm">
          <h3 className="font-medium mb-2">Gastos Variáveis</h3>
          <p className="text-lg font-semibold text-[#111]">
            R$ {data?.gastosVariaveisTotal?.toFixed(2)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {data?.qtdGastosVariaveis || 0} registros • Média R${" "}
            {data?.mediaGastosVariaveis?.toFixed(2)}
          </p>
        </div>

        {data?.maiorGastoVariavel && (
          <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200 shadow-sm">
            <h3 className="font-medium mb-2">Maior Gasto</h3>
            <p className="text-sm text-slate-600">
              {data.maiorGastoVariavel.descricao}
            </p>
            <p className="text-lg font-bold text-red-600">
              R$ {data.maiorGastoVariavel.valor.toFixed(2)}
            </p>
          </div>
        )}

        {data?.proximaParcela && (
          <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200 shadow-sm">
            <h3 className="font-medium mb-2">Próxima Parcela</h3>
            <p className="text-sm text-slate-600">
              {data.proximaParcela.descricao}
            </p>
            <p className="text-sm text-slate-500">
              {new Date(data.proximaParcela.data).toLocaleDateString("pt-BR")}
            </p>
            <p className="text-lg font-bold text-orange-600">
              R$ {data.proximaParcela.valor.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
