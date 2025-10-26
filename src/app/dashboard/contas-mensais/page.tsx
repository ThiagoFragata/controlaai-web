"use client";

import { useState } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { contaMensalSchema } from "@/lib/schemas";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { FloatingInput } from "@/components/floating-input"; // ✅ usando seu input flutuante

type ContaMensal = z.infer<typeof contaMensalSchema>;

async function fetchContasMensais() {
  const res = await fetch("/api/contas-mensais");
  if (!res.ok) throw new Error("Erro ao buscar contas");
  return res.json();
}

export default function ContasMensais() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ContaMensal | null>(null);

  const { data: contas = [] } = useQuery({
    queryKey: ["contas-mensais"],
    queryFn: fetchContasMensais,
  });

  const createMutation = useMutation({
    mutationFn: (values: ContaMensal) =>
      fetch("/api/contas-mensais", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contas-mensais"] });
      setOpen(false);
      setSelected(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: ContaMensal) =>
      fetch("/api/contas-mensais", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contas-mensais"] });
      setOpen(false);
      setSelected(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/contas-mensais/${id}`, { method: "DELETE" }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["contas-mensais"] }),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const payload: ContaMensal = {
      id: selected?.id,
      descricao: formData.get("descricao") as string,
      formaPagamento: formData.get("formaPagamento") as string,
      observacoes: formData.get("observacoes") as string,
      valor: Number(formData.get("valor")),
      vencimentoDia: Number(formData.get("vencimentoDia")),
    };

    return selected
      ? updateMutation.mutate(payload)
      : createMutation.mutate(payload);
  }

  return (
    <div className="w-full px-6 py-10 ">
      <div className="mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-semibold tracking-tight text-[#111]">
            Contas Mensais
          </h1>

          <Button
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
            className="button-ios button-ios-ripple bg-[#007AFF] hover:bg-[#0065d1] text-white px-4 py-2 rounded-lg"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Nova Conta
          </Button>
        </div>

        {/* TABELA */}
        <div className="rounded-2xl overflow-hidden border border-[#E5E7EB] bg-white/80 backdrop-blur-md shadow-[0_4px_14px_rgba(0,0,0,0.05)]">
          <table className="w-full text-sm">
            <thead className="bg-white/60">
              <tr className="text-left text-[#6B7280]">
                <th className="px-4 py-3">Descrição</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Vencimento</th>
                <th className="px-4 py-3">Forma de Pagamento</th>
                <th className="px-4 py-3">Observações</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>

            <tbody>
              {contas.map((conta: ContaMensal, index: number) => (
                <tr
                  key={conta.id || index}
                  className="table-row border-b border-[#E5E7EB]/60 text-[#111]"
                >
                  <td className="px-4 py-3">{conta.descricao}</td>
                  <td className="px-4 py-3">R$ {conta.valor.toFixed(2)}</td>
                  <td className="px-4 py-3">Dia {conta.vencimentoDia}</td>
                  <td className="px-4 py-3">{conta.formaPagamento}</td>
                  <td className="px-4 py-3">{conta.observacoes}</td>
                  <td className="px-4 py-3 text-right flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setSelected(conta);
                        setOpen(true);
                      }}
                      className="icon-ios text-[#007AFF]"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => deleteMutation.mutate(conta.id!)}
                      className="icon-ios text-[#E5484D]"
                    >
                      <Trash2 size={18} />
                    </button>
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
                {selected ? "Editar Conta" : "Nova Conta"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <FloatingInput
                label="Descrição"
                name="descricao"
                defaultValue={selected?.descricao}
              />

              <FloatingInput
                label="Valor"
                name="valor"
                type="number"
                step="0.01"
                defaultValue={selected?.valor}
              />

              <FloatingInput
                label="Dia do Vencimento"
                name="vencimentoDia"
                type="number"
                min="1"
                max="31"
                defaultValue={selected?.vencimentoDia}
              />

              <FloatingInput
                label="Forma de Pagamento"
                name="formaPagamento"
                defaultValue={selected?.formaPagamento}
              />

              <FloatingInput
                label="Observações"
                name="observacoes"
                defaultValue={selected?.observacoes || ""}
              />

              <Button
                type="submit"
                className="w-full button-ios button-ios-ripple bg-[#007AFF] hover:bg-[#0065d1] text-white"
              >
                Salvar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
