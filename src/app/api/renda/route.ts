import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rendas = await prisma.renda.findMany({
      orderBy: { dataRecebimento: "desc" },
    });
    return NextResponse.json(rendas);
  } catch (error) {
    console.error("Erro ao buscar rendas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar rendas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const renda = await prisma.renda.create({
      data: body,
    });
    return NextResponse.json(renda);
  } catch (error) {
    console.error("Erro ao criar renda:", error);
    return NextResponse.json({ error: "Erro ao criar renda" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id)
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    const renda = await prisma.renda.update({ where: { id }, data });
    return NextResponse.json(renda);
  } catch (error) {
    console.error("Erro ao atualizar renda:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar renda" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    await prisma.renda.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir renda:", error);
    return NextResponse.json(
      { error: "Erro ao excluir renda" },
      { status: 500 }
    );
  }
}
