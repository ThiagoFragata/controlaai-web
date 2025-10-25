"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/data-table";
import { FormDialog } from "@/components/form-dialog";
import { contaFuturaSchema } from "@/lib/schemas";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

type ContaFutura = z.infer<typeof contaFuturaSchema>;

const columns: Column<ContaFutura>[] = [
  { header: "Descrição", accessorKey: "descricao" as keyof ContaFutura },
  {
    header: "Valor Estimado",
    accessorKey: "valorEstimado" as keyof ContaFutura,
    cell: (r) => `R$ ${r.valorEstimado.toFixed(2)}`,
  },
  { header: "Previsão", accessorKey: "previsaoPagamento" as keyof ContaFutura },
  { header: "Categoria", accessorKey: "categoria" as keyof ContaFutura },
];

async function fetchContasFuturas() {
  const res = await fetch("/api/contas-futuras");
  if (!res.ok) throw new Error("Falha ao buscar contas futuras");
  return res.json();
}

export default function ContasFuturasPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ContaFutura | null>(null);
  const queryClient = useQueryClient();

  const { data: contas = [] } = useQuery({
    queryKey: ["contas-futuras"],
    queryFn: fetchContasFuturas,
  });

  const createMutation = useMutation({
    mutationFn: (values: ContaFutura) =>
      fetch("/api/contas-futuras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }).then((r) => {
        if (!r.ok) throw new Error("Falha");
        return r.json();
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["contas-futuras"] }),
  });

  const updateMutation = useMutation({
    mutationFn: (values: ContaFutura) =>
      fetch("/api/contas-futuras", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }).then((r) => {
        if (!r.ok) throw new Error("Falha");
        return r.json();
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["contas-futuras"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/contas-futuras/${id}`, { method: "DELETE" }).then((r) => {
        if (!r.ok) throw new Error("Falha");
        return r.json();
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["contas-futuras"] }),
  });

  async function onSubmit(values: ContaFutura) {
    if (selected && selected.id) {
      await updateMutation.mutateAsync({ ...values, id: selected.id });
    } else {
      await createMutation.mutateAsync(values);
    }
    setOpen(false);
    setSelected(null);
  }

  function onDelete(row: ContaFutura) {
    if (!row.id) return;
    deleteMutation.mutate(Number(row.id));
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Contas Futuras</h1>
        <Button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Conta Futura
        </Button>
      </div>

      <DataTable
        data={contas}
        columns={columns}
        onEdit={(r) => {
          setSelected(r);
          setOpen(true);
        }}
        onDelete={onDelete}
      />

      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title={selected ? "Editar Conta Futura" : "Nova Conta Futura"}
        schema={contaFuturaSchema}
        defaultValues={selected || undefined}
        onSubmit={onSubmit}
      >
        <FormField
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="valorEstimado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Estimado</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="previsaoPagamento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Previsão de Pagamento</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormDialog>
    </div>
  );
}
