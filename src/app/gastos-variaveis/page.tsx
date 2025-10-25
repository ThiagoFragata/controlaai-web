"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/data-table";
import { FormDialog } from "@/components/form-dialog";
import { gastoVariavelSchema } from "@/lib/schemas";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

type Gasto = z.infer<typeof gastoVariavelSchema>;

const columns: Column<Gasto>[] = [
  { header: "Descrição", accessorKey: "descricao" as keyof Gasto },
  {
    header: "Valor",
    accessorKey: "valor" as keyof Gasto,
    cell: (r) => `R$ ${r.valor.toFixed(2)}`,
  },
  { header: "Data", accessorKey: "data" as keyof Gasto },
  { header: "Categoria", accessorKey: "categoria" as keyof Gasto },
];

async function fetchGastos() {
  const res = await fetch("/api/gastos-variaveis");
  if (!res.ok) throw new Error("Falha ao buscar gastos");
  return res.json();
}

export default function GastosVariaveisPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Gasto | null>(null);
  const queryClient = useQueryClient();

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
      }).then((r) => {
        if (!r.ok) throw new Error("Falha");
        return r.json();
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["gastos-variaveis"] }),
  });

  const updateMutation = useMutation({
    mutationFn: (values: Gasto) =>
      fetch("/api/gastos-variaveis", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }).then((r) => {
        if (!r.ok) throw new Error("Falha");
        return r.json();
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["gastos-variaveis"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/gastos-variaveis/${id}`, { method: "DELETE" }).then((r) => {
        if (!r.ok) throw new Error("Falha");
        return r.json();
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["gastos-variaveis"] }),
  });

  async function onSubmit(values: Gasto) {
    if (selected && selected.id) {
      await updateMutation.mutateAsync({ ...values, id: selected.id });
    } else {
      await createMutation.mutateAsync(values);
    }
    setOpen(false);
    setSelected(null);
  }

  function onDelete(row: Gasto) {
    if (!row.id) return;
    deleteMutation.mutate(Number(row.id));
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Gastos Variáveis</h1>
        <Button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Gasto
        </Button>
      </div>

      <DataTable
        data={gastos}
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
        title={selected ? "Editar Gasto" : "Novo Gasto"}
        schema={gastoVariavelSchema}
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
          name="valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
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
          name="data"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
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
