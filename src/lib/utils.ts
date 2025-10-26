import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function serializeDecimal(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;

  if (obj instanceof Date) return obj;

  if (typeof obj === "object" && obj !== null && "toNumber" in obj) {
    return (obj as { toNumber: () => number }).toNumber();
  }

  if (Array.isArray(obj)) {
    return obj.map(serializeDecimal);
  }

  if (typeof obj === "object" && obj !== null) {
    const serialized: Record<string, unknown> = {};
    for (const key in obj) {
      serialized[key] = serializeDecimal((obj as Record<string, unknown>)[key]);
    }
    return serialized;
  }

  return obj;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR").format(dateObj);
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Erro desconhecido";
}

export function validateDateRange(startDate: string, endDate: string): boolean {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end;
}
