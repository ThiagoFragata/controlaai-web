"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CreditCard,
  ShoppingCart,
  TrendingDown,
  Wallet,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Contas Mensais",
    icon: CreditCard,
    href: "/dashboard/contas-mensais",
  },
  {
    title: "Parcelas",
    icon: ShoppingCart,
    href: "/dashboard/parcelas",
  },
  {
    title: "Gastos Variáveis",
    icon: TrendingDown,
    href: "/dashboard/gastos-variaveis",
  },
  {
    title: "Renda",
    icon: Wallet,
    href: "/dashboard/renda",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-slate-900 text-white fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">ControlaAí</h1>
        <p className="text-sm text-slate-400 mt-1">Controle Financeiro</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700 space-y-2">
        <button
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-slate-300 hover:bg-slate-800 hover:text-white w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
        <p className="text-xs text-slate-400 text-center">Versão 1.0.0</p>
      </div>
    </div>
  );
}
