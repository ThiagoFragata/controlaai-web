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
    const rendas = await prisma.renda.findMany({
      where: { userId },
      orderBy: { dataRecebimento: "desc" },
    });
    return NextResponse.json(serializeDecimal(rendas));
  } catch (error) {
    console.error("Erro ao buscar rendas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar rendas" },
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
      dataRecebimento: body.dataRecebimento
        ? new Date(body.dataRecebimento).toISOString()
        : undefined,
    };
    const renda = await prisma.renda.create({
      data,
    });
    return NextResponse.json(renda);
  } catch (error) {
    console.error("Erro ao criar renda:", error);
    return NextResponse.json({ error: "Erro ao criar renda" }, { status: 500 });
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
    const existing = await prisma.renda.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Convert date string to full ISO string for Prisma
    const data = {
      ...updateData,
      dataRecebimento: updateData.dataRecebimento
        ? new Date(updateData.dataRecebimento).toISOString()
        : updateData.dataRecebimento,
    };

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
    const existing = await prisma.renda.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

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
