"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/data-table";
import { FormDialog } from "@/components/form-dialog";
import { contaMensalSchema } from "@/lib/schemas";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type ContaMensal = z.infer<typeof contaMensalSchema>;

const columns: Column<ContaMensal>[] = [
  { header: "Descrição", accessorKey: "descricao" },
  {
    header: "Valor",
    accessorKey: "valor",
    cell: (row) => `R$ ${(row.valor || 0).toFixed(2)}`,
  },
  {
    header: "Vencimento",
    accessorKey: "vencimentoDia",
    cell: (row) => `Dia ${row.vencimentoDia}`,
  },
  { header: "Forma de Pagamento", accessorKey: "formaPagamento" },
  { header: "Observações", accessorKey: "observacoes" },
];

async function fetchContasMensais() {
  const response = await fetch("/api/contas-mensais");
  if (!response.ok) throw new Error("Falha ao buscar contas mensais");
  return response.json();
}

export default function ContasMensais() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedConta, setSelectedConta] = useState<ContaMensal | null>(null);
  const isEditing = !!selectedConta;

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
      }).then((res) => {
        if (!res.ok) throw new Error("Falha ao criar conta mensal");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contas-mensais"] });
      setOpen(false);
      setSelectedConta(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: ContaMensal) =>
      fetch("/api/contas-mensais", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }).then((res) => {
        if (!res.ok) throw new Error("Falha ao atualizar conta mensal");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contas-mensais"] });
      setOpen(false);
      setSelectedConta(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/contas-mensais/${id}`, { method: "DELETE" }).then((res) => {
        if (!res.ok) throw new Error("Falha ao excluir conta mensal");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contas-mensais"] });
    },
  });

  async function onSubmit(values: ContaMensal) {
    // ✅ Garante que o ID sempre vai no PUT
    const payload = isEditing ? { ...values, id: selectedConta?.id } : values;

    if (isEditing) {
      await updateMutation.mutateAsync(payload as ContaMensal);
    } else {
      await createMutation.mutateAsync(payload as ContaMensal);
    }
  }

  function onDelete(conta: ContaMensal) {
    if (!conta.id) return;
    deleteMutation.mutate(conta.id);
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Contas Mensais</h1>
        <Button
          onClick={() => {
            setSelectedConta(null);
            setOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Conta
        </Button>
      </div>

      <DataTable
        data={contas}
        columns={columns}
        onEdit={(conta) => {
          console.log("Editando conta:", conta); // 👀 confirmar id
          setSelectedConta(conta);
          setOpen(true);
        }}
        onDelete={onDelete}
      />

      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title={isEditing ? "Editar Conta Mensal" : "Nova Conta Mensal"}
        defaultValues={selectedConta || undefined}
        onSubmit={onSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      >
        {/* ✅ Campo oculto garantindo o id no submit */}
        {isEditing && (
          <FormField
            name="id"
            render={({ field }) => <input type="hidden" {...field} />}
          />
        )}

        <FormField
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Digite a descrição" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="vencimentoDia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dia do Vencimento</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  placeholder="Dia"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="formaPagamento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Forma de Pagamento</FormLabel>
              <FormControl>
                <Input placeholder="Digite a forma de pagamento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Input placeholder="Digite observações (opcional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormDialog>
    </div>
  );
}
