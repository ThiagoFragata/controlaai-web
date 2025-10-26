"use client";

import { useState } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { z } from "zod";
import { parcelaSchema } from "@/lib/schemas";
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
import { handleCurrency } from "@/utils/functions/handle-currency";
import { FloatingDatePicker } from "@/components/floating-date-picker";

type Parcela = z.infer<typeof parcelaSchema>;

async function fetchParcelas() {
  const res = await fetch("/api/parcelas");
  if (!res.ok) throw new Error("Falha ao buscar parcelas");
  return res.json();
}

export default function ParcelasPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Parcela | null>(null);

  // ESTADOS CONTROLADOS PARA CÁLCULO AUTOMÁTICO
  const [valorTotal, setValorTotal] = useState(0);
  const [qtdParcelas, setQtdParcelas] = useState(1);

  const valorParcela = qtdParcelas > 0 ? valorTotal / qtdParcelas : 0;

  const { data: parcelas = [] } = useQuery({
    queryKey: ["parcelas"],
    queryFn: fetchParcelas,
  });

  const createMutation = useMutation({
    mutationFn: (values: Parcela) =>
      fetch("/api/parcelas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parcelas"] });
      setOpen(false);
      setSelected(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: Parcela) =>
      fetch("/api/parcelas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parcelas"] });
      setOpen(false);
      setSelected(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/parcelas/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["parcelas"] }),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);

    const payload: Parcela = {
      id: selected?.id,
      descricao: data.get("descricao") as string,
      valorTotal,
      qtdParcelas,
      parcelaAtual: Number(data.get("parcelaAtual")),
      valorParcela,
      vencimentoData: data.get("vencimentoData") as string,
      observacoes: data.get("observacoes") as string,
    };

    return selected
      ? updateMutation.mutate(payload)
      : createMutation.mutate(payload);
  }

  return (
    <div className="px-6 py-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-semibold text-[#111]">Parcelas</h1>

        <Button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          className="button-ios button-ios-ripple bg-[#007AFF] hover:bg-[#0065d1] text-white px-4 py-2 rounded-lg"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Nova Parcela
        </Button>
      </div>

      {/* TABELA APPLE GLASS */}
      <div className="rounded-2xl overflow-hidden border border-[#E5E7EB] bg-white/80 backdrop-blur-md shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
        <table className="w-full text-sm">
          <thead className="bg-white/60 backdrop-blur-sm">
            <tr className="text-left text-[#6B7280] select-none">
              <th className="px-4 py-3">Descrição</th>
              <th className="px-4 py-3">Valor Total</th>
              <th className="px-4 py-3">Qtd Parcelas</th>
              <th className="px-4 py-3">Parcela Atual</th>
              <th className="px-4 py-3">Valor Parcela</th>
              <th className="px-4 py-3">Vencimento</th>
              <th className="px-4 py-3">Observações</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>

          <tbody>
            {parcelas.map((p: Parcela, i: number) => (
              <tr
                key={p.id || i}
                className={`transition-all ${
                  i % 2 === 0 ? "bg-white/60" : "bg-white/30"
                } hover:bg-[#E8F1FF]/80`}
              >
                <td className="px-4 py-3">{p.descricao}</td>
                <td className="px-4 py-3">R$ {p.valorTotal.toFixed(2)}</td>
                <td className="px-4 py-3">{p.qtdParcelas}</td>
                <td className="px-4 py-3">{p.parcelaAtual}</td>
                <td className="px-4 py-3">R$ {p.valorParcela.toFixed(2)}</td>
                <td className="px-4 py-3">
                  {p.vencimentoData
                    ? new Date(p.vencimentoData).toLocaleDateString("pt-BR")
                    : ""}
                </td>
                <td className="px-4 py-3">{p.observacoes}</td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setSelected({
                          ...p,
                          vencimentoData: p.vencimentoData
                            ? p.vencimentoData.split("T")[0]
                            : "",
                        });
                        setOpen(true);
                      }}
                      className="icon-ios text-[#007AFF]"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => deleteMutation.mutate(p.id!)}
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

      {/* MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-medium">
              {selected ? "Editar Parcela" : "Nova Parcela"}
            </DialogTitle>

            <DialogDescription className="text-center text-sm text-muted-foreground">
              {selected
                ? "Atualize os dados da parcela abaixo."
                : "Preencha os dados para cadastrar uma nova parcela."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <FloatingInput
              label="Descrição"
              name="descricao"
              defaultValue={selected?.descricao}
            />

            <FloatingInput
              label="Valor Total"
              type="text"
              inputMode="decimal"
              onChange={(e) => setValorTotal(handleCurrency(e))}
              defaultValue={selected?.valorTotal}
            />

            <FloatingInput
              label="Quantidade de Parcelas"
              type="number"
              min="1"
              value={qtdParcelas}
              onChange={(e) => setQtdParcelas(Number(e.target.value))}
            />

            <FloatingInput
              label="Parcela Atual"
              name="parcelaAtual"
              type="number"
              min="1"
              defaultValue={selected?.parcelaAtual}
            />

            <FloatingInput
              label="Valor da Parcela"
              name="valorParcela"
              type="text"
              value={valorParcela.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
              readOnly
            />

            <FloatingDatePicker
              label="Data de Vencimento"
              name="vencimentoData"
              defaultValue={selected?.vencimentoData}
            />

            <FloatingInput
              label="Observações"
              name="observacoes"
              defaultValue={selected?.observacoes || ""}
            />

            <Button className="w-full button-ios bg-[#007AFF] hover:bg-[#0065d1] text-white">
              Salvar
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
