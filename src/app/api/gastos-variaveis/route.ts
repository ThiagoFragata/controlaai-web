import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const gastos = await prisma.gastosVariaveis.findMany({
      orderBy: { data: "desc" },
    });
    return NextResponse.json(gastos);
  } catch (error) {
    console.error("Erro ao buscar gastos variáveis:", error);
    return NextResponse.json(
      { error: "Erro ao buscar gastos variáveis" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const gasto = await prisma.gastosVariaveis.create({
      data: body,
    });
    return NextResponse.json(gasto);
  } catch (error) {
    console.error("Erro ao criar gasto variável:", error);
    return NextResponse.json(
      { error: "Erro ao criar gasto variável" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id)
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    const gasto = await prisma.gastosVariaveis.update({ where: { id }, data });
    return NextResponse.json(gasto);
  } catch (error) {
    console.error("Erro ao atualizar gasto variável:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar gasto variável" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    await prisma.gastosVariaveis.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir gasto variável:", error);
    return NextResponse.json(
      { error: "Erro ao excluir gasto variável" },
      { status: 500 }
    );
  }
}
