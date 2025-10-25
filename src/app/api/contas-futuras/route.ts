import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contas = await prisma.contasFuturas.findMany({
      orderBy: { previsaoPagamento: "asc" },
    });
    return NextResponse.json(contas);
  } catch (error) {
    console.error("Erro ao buscar contas futuras:", error);
    return NextResponse.json(
      { error: "Erro ao buscar contas futuras" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const conta = await prisma.contasFuturas.create({
      data: body,
    });
    return NextResponse.json(conta);
  } catch (error) {
    console.error("Erro ao criar conta futura:", error);
    return NextResponse.json(
      { error: "Erro ao criar conta futura" },
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
    const conta = await prisma.contasFuturas.update({ where: { id }, data });
    return NextResponse.json(conta);
  } catch (error) {
    console.error("Erro ao atualizar conta futura:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar conta futura" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    await prisma.contasFuturas.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir conta futura:", error);
    return NextResponse.json(
      { error: "Erro ao excluir conta futura" },
      { status: 500 }
    );
  }
}
