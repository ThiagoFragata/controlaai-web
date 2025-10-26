import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { serializeDecimal } from "@/lib/utils";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const contas = await prisma.contasMensais.findMany({
      where: { userId },
      orderBy: { vencimentoDia: "asc" },
    });
    return NextResponse.json(serializeDecimal(contas));
  } catch (error) {
    console.error("Erro ao buscar contas mensais:", error);
    return NextResponse.json(
      { error: "Erro ao buscar contas mensais" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await request.json();
    const conta = await prisma.contasMensais.create({
      data: { ...body, userId },
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
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    // Check if the record belongs to the user
    const existing = await prisma.contasMensais.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
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
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const id = request.nextUrl.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    // Check if the record belongs to the user
    const existing = await prisma.contasMensais.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

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
