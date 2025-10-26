import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type {
  Renda,
  ContasMensais,
  Parcelas,
  GastosVariaveis,
} from "@prisma/client";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Buscar todas as rendas do mês atual
    const rendas: Renda[] = await prisma.renda.findMany({
      where: {
        userId,
        dataRecebimento: {
          gte: new Date(currentYear, currentMonth, 1),
          lt: new Date(currentYear, currentMonth + 1, 1),
        },
      },
    });

    // Buscar todas as contas mensais
    const contasMensais: ContasMensais[] = await prisma.contasMensais.findMany({
      where: { userId },
    });

    // Buscar parcelas do mês atual
    const parcelas: Parcelas[] = await prisma.parcelas.findMany({
      where: {
        userId,
        vencimentoData: {
          gte: new Date(currentYear, currentMonth, 1),
          lt: new Date(currentYear, currentMonth + 1, 1),
        },
      },
    });

    // Buscar gastos variáveis do mês atual
    const gastosVariaveis: GastosVariaveis[] =
      await prisma.gastosVariaveis.findMany({
        where: {
          userId,
          data: {
            gte: new Date(currentYear, currentMonth, 1),
            lt: new Date(currentYear, currentMonth + 1, 1),
          },
        },
      });

    // Calcular totais
    const rendaTotal = rendas.reduce(
      (sum: number, renda: Renda) => sum + Number(renda.valor),
      0
    );

    const contasMensaisTotal = contasMensais.reduce(
      (sum: number, conta: ContasMensais) => sum + Number(conta.valor),
      0
    );

    const parcelasTotal = parcelas.reduce(
      (sum: number, parcela: Parcelas) => sum + Number(parcela.valorParcela),
      0
    );

    const gastosVariaveisTotal = gastosVariaveis.reduce(
      (sum: number, gasto: GastosVariaveis) => sum + Number(gasto.valor),
      0
    );

    const totalGastos =
      contasMensaisTotal + parcelasTotal + gastosVariaveisTotal;
    const saldo = rendaTotal - totalGastos;

    // Agrupar gastos por categoria
    const gastosPorCategoria = gastosVariaveis.reduce(
      (acc: Record<string, number>, gasto: GastosVariaveis) => {
        const categoria = gasto.categoria ?? "Sem Categoria";
        if (!acc[categoria]) {
          acc[categoria] = 0;
        }
        acc[categoria] += Number(gasto.valor);
        return acc;
      },
      {} as Record<string, number>
    );

    // Adicionar categorias fixas
    if (contasMensaisTotal > 0) {
      gastosPorCategoria["Contas Fixas"] = contasMensaisTotal;
    }
    if (parcelasTotal > 0) {
      gastosPorCategoria["Parcelas"] = parcelasTotal;
    }

    // Formatar para o gráfico
    const chartData = Object.entries(gastosPorCategoria).map(
      ([name, value]: [string, number]) => ({
        name,
        value: Number(value.toFixed(2)),
      })
    );

    return NextResponse.json({
      rendaTotal: Number(rendaTotal.toFixed(2)),
      contasMensaisTotal: Number(contasMensaisTotal.toFixed(2)),
      parcelasTotal: Number(parcelasTotal.toFixed(2)),
      gastosVariaveisTotal: Number(gastosVariaveisTotal.toFixed(2)),
      totalGastos: Number(totalGastos.toFixed(2)),
      saldo: Number(saldo.toFixed(2)),
      chartData,
    });
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados do dashboard" },
      { status: 500 }
    );
  }
}
