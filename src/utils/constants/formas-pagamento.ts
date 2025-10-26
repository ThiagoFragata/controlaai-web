import {
  Wallet,
  CreditCard,
  Banknote,
  Landmark,
  Smartphone,
  Barcode,
} from "lucide-react";

export const FORMAS_PAGAMENTO = [
  { label: "Pix", icon: Smartphone },
  { label: "Dinheiro", icon: Banknote },
  { label: "Crédito", icon: CreditCard },
  { label: "Débito", icon: CreditCard },
  { label: "Transferência", icon: Landmark },
  { label: "Boleto", icon: Barcode },
  { label: "Outro", icon: Wallet },
];
