// /lib/decimal.ts
import type { Decimal } from "@prisma/client/runtime/library";

export function serializeDecimal<T extends Record<string, unknown>>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_k, v) => (isPrismaDecimal(v) ? v.toString() : v))
  );
}

export function serializeDecimals<T>(data: T): T {
  if (Array.isArray(data)) return data.map(serializeDecimal) as unknown as T;
  if (data && typeof data === "object")
    return serializeDecimal(data as Record<string, unknown>) as T;
  return data;
}

function isPrismaDecimal(v: unknown): v is Decimal {
  return !!(
    v &&
    typeof v === "object" &&
    typeof (v as Record<string, unknown>).toFixed === "function" &&
    typeof (v as Record<string, unknown>).toString === "function"
  );
}
