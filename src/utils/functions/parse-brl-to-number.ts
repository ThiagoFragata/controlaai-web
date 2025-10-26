export function parseBRLToNumber(value: string | null): number {
  if (!value) return 0;

  return Number(
    value
      .replace(/\s/g, "") // remove espaços
      .replace("R$", "") // remove R$
      .replace(/\./g, "") // remove separador de milhar
      .replace(",", ".") // vírgula -> ponto decimal
  );
}
