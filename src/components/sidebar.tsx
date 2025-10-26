"use client";

import { useState } from "react";
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
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  {
    title: "Contas Mensais",
    icon: CreditCard,
    href: "/dashboard/contas-mensais",
  },
  { title: "Parcelas", icon: ShoppingCart, href: "/dashboard/parcelas" },
  {
    title: "Gastos Variáveis",
    icon: TrendingDown,
    href: "/dashboard/gastos-variaveis",
  },
  { title: "Renda", icon: Wallet, href: "/dashboard/renda" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openMobile, setOpenMobile] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* BOTÃO MOBILE */}
      <button
        onClick={() => setOpenMobile(true)}
        className="fixed top-4 left-4 z-40 p-2 rounded-full bg-white/70 backdrop-blur-md border border-gray-200 shadow-md hover:scale-105 active:scale-95 transition-all lg:hidden"
      >
        <Menu className="w-5 h-5 text-[#007AFF]" />
      </button>

      {/* OVERLAY MOBILE */}
      {openMobile && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 animate-in fade-in duration-200 lg:hidden"
          onClick={() => setOpenMobile(false)}
        />
      )}

      {/* SIDEBAR - MODO APPLE GLASS 🍏 */}
      <aside
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className={cn(
          "apple-glass fixed top-0 left-0 h-full z-40 flex flex-col transition-all duration-300 ease-[cubic-bezier(.32,.72,0,1)] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-r border-white/30",
          expanded ? "w-64" : "w-[72px]",
          openMobile ? "translate-x-0" : "lg:translate-x-0 -translate-x-full"
        )}
      >
        {/* HEADER */}
        <div className="p-6 flex justify-between items-center">
          {expanded && (
            <div className="transition-opacity duration-300 ease-[cubic-bezier(.32,.72,0,1)]">
              <h1 className="text-lg font-semibold text-[#111] tracking-tight">
                ControlaAi
              </h1>
              <p className="text-xs text-[#6B7280]">Controle Financeiro</p>
            </div>
          )}

          <button
            onClick={() => setOpenMobile(false)}
            className="lg:hidden p-1 rounded-full hover:bg-white/40 transition-all"
          >
            <X className="w-5 h-5 text-[#007AFF]" />
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-3 space-y-1 overflow-hidden">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpenMobile(false)}
                className={cn(
                  "apple-hover flex items-center gap-3 px-3 py-2.5 rounded-lg select-none transition-all overflow-hidden text-sm group",
                  active
                    ? "bg-[#E8F0FF] text-[#007AFF]"
                    : "text-[#6B7280] hover:bg-white/40 hover:text-[#111]"
                )}
              >
                <Icon className="w-5 h-5 min-w-5 transition-transform duration-200 group-hover:scale-105" />
                {expanded && <span className="truncate">{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={() => signOut({ callbackUrl: "/signin" })}
            className="apple-hover flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-[#6B7280]"
          >
            <LogOut className="w-5 h-5 min-w-5" />
            {expanded && <span>Sair</span>}
          </button>

          {expanded && (
            <p className="text-xs text-[#9CA3AF] text-center mt-4">
              Versão 1.0.0
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
