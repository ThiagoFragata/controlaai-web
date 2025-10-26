import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const userId = session.user.id;
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  const [rendas, contas, parcelas, gastos] = await Promise.all([
    prisma.renda.findMany({
      where: {
        userId,
        dataRecebimento: { gte: new Date(y, m, 1), lt: new Date(y, m + 1, 1) },
      },
    }),
    prisma.contasMensais.findMany({ where: { userId } }),
    prisma.parcelas.findMany({
      where: {
        userId,
        vencimentoData: { gte: new Date(y, m, 1), lt: new Date(y, m + 1, 1) },
      },
    }),
    prisma.gastosVariaveis.findMany({
      where: {
        userId,
        data: { gte: new Date(y, m, 1), lt: new Date(y, m + 1, 1) },
      },
    }),
  ]);

  const rendaTotal = rendas.reduce((s, r) => s + Number(r.valor), 0);
  const contasTotal = contas.reduce((s, c) => s + Number(c.valor), 0);
  const parcelasTotal = parcelas.reduce(
    (s, p) => s + Number(p.valorParcela),
    0
  );
  const gastosTotal = gastos.reduce((s, g) => s + Number(g.valor), 0);
  const totalGastos = contasTotal + parcelasTotal + gastosTotal;
  const saldo = rendaTotal - totalGastos;

  const categorias: Record<string, number> = {};
  gastos.forEach((g) => {
    categorias[g.categoria || "Outros"] =
      (categorias[g.categoria || "Outros"] || 0) + Number(g.valor);
  });
  categorias["Contas Fixas"] = contasTotal;
  categorias["Parcelas"] = parcelasTotal;

  const chartData = Object.entries(categorias).map(([name, value]) => ({
    name,
    value,
  }));

  const maiorGasto = gastos.length
    ? gastos.reduce((a, b) => (Number(a.valor) > Number(b.valor) ? a : b))
    : null;

  const proximaParcela =
    parcelas
      .filter((p) => new Date(p.vencimentoData) >= now)
      .sort(
        (a, b) =>
          new Date(a.vencimentoData).getTime() -
          new Date(b.vencimentoData).getTime()
      )[0] || null;

  return NextResponse.json({
    rendaTotal,
    contasMensaisTotal: contasTotal,
    parcelasTotal,
    gastosVariaveisTotal: gastosTotal,
    totalGastos,
    saldo,
    chartData,
    qtdRendas: rendas.length,
    qtdContasMensais: contas.length,
    qtdParcelas: parcelas.length,
    qtdGastosVariaveis: gastos.length,
    mediaGastosVariaveis: gastos.length ? gastosTotal / gastos.length : 0,
    maiorGastoVariavel: maiorGasto && {
      descricao: maiorGasto.descricao,
      valor: Number(maiorGasto.valor),
    },
    proximaParcela: proximaParcela && {
      descricao: proximaParcela.descricao,
      valor: Number(proximaParcela.valorParcela),
      data: proximaParcela.vencimentoData,
    },
  });
}
