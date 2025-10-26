export function handleCurrency(e: React.ChangeEvent<HTMLInputElement>) {
  const value = e.target.value.replace(/\D/g, "");

  const numeric = Number(value) / 100;

  e.target.value = numeric.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return numeric; // ← RETORNA o valor como número
}
