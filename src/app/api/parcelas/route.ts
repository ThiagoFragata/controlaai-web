import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const parcelas = await prisma.parcelas.findMany({
      orderBy: { vencimentoData: "asc" },
    });
    return NextResponse.json(parcelas);
  } catch (error) {
    console.error("Erro ao buscar parcelas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar parcelas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parcela = await prisma.parcelas.create({
      data: body,
    });
    return NextResponse.json(parcela);
  } catch (error) {
    console.error("Erro ao criar parcela:", error);
    return NextResponse.json(
      { error: "Erro ao criar parcela" },
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
    const parcela = await prisma.parcelas.update({ where: { id }, data });
    return NextResponse.json(parcela);
  } catch (error) {
    console.error("Erro ao atualizar parcela:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar parcela" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    await prisma.parcelas.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir parcela:", error);
    return NextResponse.json(
      { error: "Erro ao excluir parcela" },
      { status: 500 }
    );
  }
}
