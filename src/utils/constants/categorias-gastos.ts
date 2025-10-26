import {
  ShoppingCart,
  Utensils,
  Bus,
  Car,
  Home,
  Stethoscope,
  Gamepad2,
  Shirt,
  Gift,
  Dumbbell,
  PawPrint,
  BookOpen,
  Plane,
} from "lucide-react";

export const CATEGORIAS_GASTOS = [
  { label: "Alimentação", icon: Utensils },
  { label: "Mercado", icon: ShoppingCart },
  { label: "Transporte", icon: Bus },
  { label: "Combustível", icon: Car },
  { label: "Casa", icon: Home },
  { label: "Saúde", icon: Stethoscope },
  { label: "Lazer / Jogos", icon: Gamepad2 },
  { label: "Roupas", icon: Shirt },
  { label: "Presentes", icon: Gift },
  { label: "Academia / Esporte", icon: Dumbbell },
  { label: "Pet", icon: PawPrint },
  { label: "Educação", icon: BookOpen },
  { label: "Viagem", icon: Plane },
  { label: "Outros", icon: Home }, // fallback
];
