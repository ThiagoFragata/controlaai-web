"use client";

import { useState } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { z } from "zod";
import { rendaSchema } from "@/lib/schemas";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FloatingInput } from "@/components/floating-input";
import { FloatingDatePicker } from "@/components/floating-date-picker";
import { handleCurrency } from "@/utils/functions/handle-currency";

type Renda = z.infer<typeof rendaSchema>;

async function fetchRendas() {
  const res = await fetch("/api/renda");
  if (!res.ok) throw new Error("Falha ao buscar rendas");
  return res.json();
}

export default function RendaPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Renda | null>(null);

  const { data: rendas = [] } = useQuery({
    queryKey: ["renda"],
    queryFn: fetchRendas,
  });

  const createMutation = useMutation({
    mutationFn: (values: Renda) =>
      fetch("/api/renda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["renda"] });
      setOpen(false);
      setSelected(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: Renda) =>
      fetch("/api/renda", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["renda"] });
      setOpen(false);
      setSelected(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/renda/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["renda"] }),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = new FormData(e.currentTarget as HTMLFormElement);

    const payload: Renda = {
      id: selected?.id,
      descricao: data.get("descricao") as string,
      valor: Number(data.get("valor")),
      dataRecebimento: data.get("dataRecebimento") as string,
      fonte: data.get("fonte") as string,
      observacoes: data.get("observacoes") as string,
    };

    return selected
      ? updateMutation.mutate(payload)
      : createMutation.mutate(payload);
  }

  return (
    <div className="px-6 py-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-semibold text-[#111]">Renda</h1>

        <Button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          className="button-ios button-ios-ripple bg-[#007AFF] hover:bg-[#0065d1] text-white px-4 py-2 rounded-lg"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Nova Renda
        </Button>
      </div>

      {/* TABELA APPLE GLASS */}
      <div className="rounded-2xl overflow-hidden border border-[#E5E7EB] bg-white/80 backdrop-blur-md shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
        <table className="w-full text-sm">
          <thead className="bg-white/60 backdrop-blur-sm">
            <tr className="text-left text-[#6B7280] select-none">
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Descrição</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3">Fonte</th>
              <th className="px-4 py-3">Observações</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>

          <tbody>
            {rendas.map((r: Renda, i: number) => (
              <tr
                key={r.id || i}
                className={`transition-all ${
                  i % 2 === 0 ? "bg-white/60" : "bg-white/30"
                } hover:bg-[#E8F1FF]/80`}
              >
                <td className="px-4 py-3">
                  {r.dataRecebimento
                    ? new Date(r.dataRecebimento).toLocaleDateString("pt-BR")
                    : ""}
                </td>
                <td className="px-4 py-3">{r.descricao}</td>
                <td className="px-4 py-3 font-medium">
                  R$ {r.valor.toFixed(2)}
                </td>
                <td className="px-4 py-3">{r.fonte}</td>
                <td className="px-4 py-3">{r.observacoes}</td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setSelected({
                          ...r,
                          dataRecebimento: r.dataRecebimento
                            ? r.dataRecebimento.split("T")[0]
                            : "",
                        });
                        setOpen(true);
                      }}
                      className="icon-ios text-[#007AFF]"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => deleteMutation.mutate(r.id!)}
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
              {selected ? "Editar Renda" : "Nova Renda"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <FloatingDatePicker
              label="Data de Recebimento"
              name="dataRecebimento"
              defaultValue={selected?.dataRecebimento}
            />

            <FloatingInput
              label="Descrição"
              name="descricao"
              defaultValue={selected?.descricao}
            />

            <FloatingInput
              label="Valor"
              name="valor"
              type="text"
              defaultValue={selected?.valor}
              onChange={handleCurrency}
              inputMode="decimal"
            />

            <FloatingInput
              label="Fonte"
              name="fonte"
              defaultValue={selected?.fonte}
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
