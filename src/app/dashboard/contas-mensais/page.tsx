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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { FloatingInput } from "@/components/floating-input"; // ✅ usando seu input flutuante
import { parseBRLToNumber } from "@/utils/functions/parse-brl-to-number";
import { handleCurrency } from "@/utils/functions/handle-currency";

import { FORMAS_PAGAMENTO } from "@/utils/constants/formas-pagamento";
import { FloatingSelect } from "@/components/floating-select";
import { FloatingDateDayPicker } from "@/components/floating-date-day-picker";

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
      valor: parseBRLToNumber(formData.get("valor") as string),
      vencimentoDia: Number(formData.get("vencimentoDia")),
    };

    const result = contaMensalSchema.safeParse(payload);

    if (!result.success) {
      alert("Preencha todos os campos obrigatórios corretamente.");
      return;
    }

    // ✅ Se estiver editando → update
    return selected
      ? updateMutation.mutate(result.data)
      : createMutation.mutate(result.data);
  }

  return (
    <div className="w-full px-6 py-14">
      <div className="mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#111]">
            Contas Mensais
          </h1>

          <Button
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
            className="button-ios button-ios-ripple bg-[#007AFF] hover:bg-[#0065d1] text-white px-4 py-2 rounded-lg w-full sm:w-auto"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Nova Conta
          </Button>
        </div>

        {/* TABELA RESPONSIVA */}
        <div className="rounded-2xl overflow-hidden border border-[#E5E7EB] bg-white/80 backdrop-blur-md shadow-[0_4px_14px_rgba(0,0,0,0.05)]">
          {/* Desktop Table */}
          <div className="hidden sm:block">
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

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-4 p-4">
            {contas.map((conta: ContaMensal, index: number) => (
              <div
                key={conta.id || index}
                className="bg-white rounded-lg border border-[#E5E7EB] p-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-[#111]">{conta.descricao}</h3>
                  <div className="flex gap-2">
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
                  </div>
                </div>
                <div className="space-y-1 text-sm text-[#6B7280]">
                  <p>
                    <span className="font-medium">Valor:</span> R${" "}
                    {conta.valor.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-medium">Vencimento:</span> Dia{" "}
                    {conta.vencimentoDia}
                  </p>
                  <p>
                    <span className="font-medium">Forma de Pagamento:</span>{" "}
                    {conta.formaPagamento}
                  </p>
                  {conta.observacoes && (
                    <p>
                      <span className="font-medium">Observações:</span>{" "}
                      {conta.observacoes}
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
                {selected ? "Editar Conta" : "Nova Conta"}
              </DialogTitle>

              <DialogDescription className="text-center text-sm text-muted-foreground">
                {selected
                  ? "Atualize os dados da conta abaixo."
                  : "Preencha os dados para cadastrar uma nova conta."}
              </DialogDescription>
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
                type="text"
                defaultValue={selected?.valor}
                onChange={handleCurrency}
                inputMode="decimal"
              />

              <FloatingDateDayPicker
                label="Dia do Vencimento"
                name="vencimentoDia"
                defaultDay={selected?.vencimentoDia}
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
