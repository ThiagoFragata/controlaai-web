import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contas = await prisma.contasMensais.findMany({
      orderBy: { vencimentoDia: "asc" },
    });
    return NextResponse.json(contas);
  } catch (error) {
    console.error("Erro ao buscar contas mensais:", error);
    return NextResponse.json(
      { error: "Erro ao buscar contas mensais" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const conta = await prisma.contasMensais.create({
      data: body,
    });
    return NextResponse.json(conta);
  } catch (error) {
    console.error("Erro ao criar conta mensal:", error);
    return NextResponse.json(
      { error: "Erro ao criar conta mensal" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    const conta = await prisma.contasMensais.update({
      where: { id },
      data,
    });

    return NextResponse.json(conta);
  } catch (error) {
    console.error("Erro ao atualizar conta mensal:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar conta mensal" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    await prisma.contasMensais.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir conta mensal:", error);
    return NextResponse.json(
      { error: "Erro ao excluir conta mensal" },
      { status: 500 }
    );
  }
}
