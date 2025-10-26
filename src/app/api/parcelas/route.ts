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
    const parcelas = await prisma.parcelas.findMany({
      where: { userId },
      orderBy: { vencimentoData: "asc" },
    });
    return NextResponse.json(serializeDecimal(parcelas));
  } catch (error) {
    console.error("Erro ao buscar parcelas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar parcelas" },
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
    // Convert date string to full ISO string for Prisma
    const data = {
      ...body,
      userId,
      vencimentoData: body.vencimentoData
        ? new Date(body.vencimentoData).toISOString()
        : undefined,
    };
    const parcela = await prisma.parcelas.create({
      data,
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
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    // Check if the record belongs to the user
    const existing = await prisma.parcelas.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Convert date string to full ISO string for Prisma
    const data = {
      ...updateData,
      vencimentoData: updateData.vencimentoData
        ? new Date(updateData.vencimentoData).toISOString()
        : updateData.vencimentoData,
    };

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

// DELETE method removed from this file - will be handled by dynamic route
