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
    const gastos = await prisma.gastosVariaveis.findMany({
      where: { userId },
      orderBy: { data: "desc" },
    });
    return NextResponse.json(serializeDecimal(gastos));
  } catch (error) {
    console.error("Erro ao buscar gastos variáveis:", error);
    return NextResponse.json(
      { error: "Erro ao buscar gastos variáveis" },
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
      data: body.data ? new Date(body.data).toISOString() : undefined,
    };
    const gasto = await prisma.gastosVariaveis.create({
      data,
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
    const existing = await prisma.gastosVariaveis.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Convert date string to full ISO string for Prisma
    const data = {
      ...updateData,
      data: updateData.data
        ? new Date(updateData.data).toISOString()
        : updateData.data,
    };

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

// DELETE method removed from this file - will be handled by dynamic route
