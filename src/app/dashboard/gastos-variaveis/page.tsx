"use client";

import { useState } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { z } from "zod";
import { gastoVariavelSchema } from "@/lib/schemas";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FloatingInput } from "@/components/floating-input";
import { FloatingDatePicker } from "@/components/floating-date-picker";
import { FloatingSelect } from "@/components/floating-select";
import { FORMAS_PAGAMENTO } from "@/utils/constants/formas-pagamento";
import { handleCurrency } from "@/utils/functions/handle-currency";
import { CATEGORIAS_GASTOS } from "@/utils/constants/categorias-gastos";
import { parseBRLToNumber } from "@/utils/functions/parse-brl-to-number";
import { toast } from "sonner";

type Gasto = z.infer<typeof gastoVariavelSchema>;

async function fetchGastos() {
  const res = await fetch("/api/gastos-variaveis");
  if (!res.ok) throw new Error("Falha ao buscar gastos");
  return res.json();
}

export default function GastosVariaveisPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Gasto | null>(null);

  const { data: gastos = [] } = useQuery({
    queryKey: ["gastos-variaveis"],
    queryFn: fetchGastos,
  });

  const createMutation = useMutation({
    mutationFn: (values: Gasto) =>
      fetch("/api/gastos-variaveis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gastos-variaveis"] });
      setOpen(false);
      setSelected(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: Gasto) =>
      fetch("/api/gastos-variaveis", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gastos-variaveis"] });
      setOpen(false);
      setSelected(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/gastos-variaveis/${id}`, { method: "DELETE" }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["gastos-variaveis"] }),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = new FormData(e.currentTarget as HTMLFormElement);

    const payload: Gasto = {
      id: selected?.id,
      descricao: data.get("descricao") as string,
      categoria: data.get("categoria") as string,
      formaPagamento: data.get("formaPagamento") as string,
      observacoes: data.get("observacoes") as string,
      valor: parseBRLToNumber(data.get("valor") as string),
      data: data.get("data") as string,
    };

    // Validações apenas no cadastro (criação)
    if (!selected) {
      const result = gastoVariavelSchema.safeParse(payload);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          toast.error(issue.message);
        });
        return;
      }
    }

    return selected
      ? updateMutation.mutate(payload)
      : createMutation.mutate(payload);
  }

  return (
    <div className="w-full px-6 py-14">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#111]">
          Gastos Variáveis
        </h1>

        <Button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          className="button-ios button-ios-ripple bg-[#007AFF] hover:bg-[#0065d1] text-white px-4 py-2 rounded-lg w-full sm:w-auto"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Novo Gasto
        </Button>
      </div>

      {/* TABELA RESPONSIVA */}
      <div className="rounded-2xl overflow-hidden border border-[#E5E7EB] bg-white/80 backdrop-blur-md shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
        {/* Desktop Table */}
        <div className="hidden sm:block">
          <table className="w-full text-sm">
            <thead className="bg-white/60 backdrop-blur-sm">
              <tr className="text-left text-[#6B7280] select-none">
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Descrição</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Forma de Pagamento</th>
                <th className="px-4 py-3">Observações</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {gastos.map((g: Gasto, i: number) => (
                <tr
                  key={g.id || i}
                  className={`transition-all ${
                    i % 2 === 0 ? "bg-white/60" : "bg-white/30"
                  } hover:bg-[#E8F1FF]/80`}
                >
                  <td className="px-4 py-3">
                    {g.data ? new Date(g.data).toLocaleDateString("pt-BR") : ""}
                  </td>
                  <td className="px-4 py-3">{g.descricao}</td>
                  <td className="px-4 py-3">{g.categoria}</td>
                  <td className="px-4 py-3 font-medium">
                    R$ {g.valor.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">{g.formaPagamento}</td>
                  <td className="px-4 py-3">{g.observacoes}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => {
                          setSelected({
                            ...g,
                            data: g.data ? g.data.split("T")[0] : "",
                          });
                          setOpen(true);
                        }}
                        className="icon-ios text-[#007AFF]"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(g.id!)}
                        className="icon-ios text-[#E5484D]"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-4 p-4">
          {gastos.map((g: Gasto, i: number) => (
            <div
              key={g.id || i}
              className="bg-white rounded-lg border border-[#E5E7EB] p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-[#111]">{g.descricao}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelected({
                        ...g,
                        data: g.data ? g.data.split("T")[0] : "",
                      });
                      setOpen(true);
                    }}
                    className="icon-ios text-[#007AFF]"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(g.id!)}
                    className="icon-ios text-[#E5484D]"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="space-y-1 text-sm text-[#6B7280]">
                <p>
                  <span className="font-medium">Data:</span>{" "}
                  {g.data ? new Date(g.data).toLocaleDateString("pt-BR") : ""}
                </p>
                <p>
                  <span className="font-medium">Categoria:</span> {g.categoria}
                </p>
                <p>
                  <span className="font-medium">Valor:</span> R${" "}
                  {g.valor.toFixed(2)}
                </p>
                <p>
                  <span className="font-medium">Forma de Pagamento:</span>{" "}
                  {g.formaPagamento}
                </p>
                {g.observacoes && (
                  <p>
                    <span className="font-medium">Observações:</span>{" "}
                    {g.observacoes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-medium">
              {selected ? "Editar Gasto" : "Nova Gasto"}
            </DialogTitle>

            <DialogDescription className="text-center text-sm text-muted-foreground">
              {selected
                ? "Atualize os dados da gasto abaixo."
                : "Preencha os dados para cadastrar uma nova gasto."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <FloatingDatePicker
              label="Data"
              name="data"
              defaultValue={selected?.data}
            />

            <FloatingInput
              label="Descrição"
              name="descricao"
              defaultValue={selected?.descricao}
            />

            <FloatingSelect
              label="Categoria"
              name="categoria"
              defaultValue={selected?.categoria}
              options={CATEGORIAS_GASTOS}
            />

            <FloatingInput
              label="Valor"
              name="valor"
              type="text"
              defaultValue={selected?.valor}
              onChange={handleCurrency}
              inputMode="decimal"
            />

            <FloatingSelect
              label="Forma de Pagamento"
              name="formaPagamento"
              defaultValue={selected?.formaPagamento}
              options={FORMAS_PAGAMENTO}
            />

            <FloatingInput
              label="Observações"
              name="observacoes"
              defaultValue={selected?.observacoes || ""}
            />

            <Button className="w-full button-ios button-ios-ripple bg-[#007AFF] hover:bg-[#0065d1] text-white">
              Salvar
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
