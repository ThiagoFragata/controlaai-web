"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/data-table";
import { FormDialog } from "@/components/form-dialog";
import { rendaSchema } from "@/lib/schemas";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

type Renda = z.infer<typeof rendaSchema>;

const columns: Column<Renda>[] = [
  { header: "Descrição", accessorKey: "descricao" as keyof Renda },
  {
    header: "Valor",
    accessorKey: "valor" as keyof Renda,
    cell: (r) => `R$ ${r.valor.toFixed(2)}`,
  },
  { header: "Data Recebimento", accessorKey: "dataRecebimento" as keyof Renda },
  { header: "Fonte", accessorKey: "fonte" as keyof Renda },
];

async function fetchRendas() {
  const res = await fetch("/api/renda");
  if (!res.ok) throw new Error("Falha ao buscar rendas");
  return res.json();
}

export default function RendaPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Renda | null>(null);
  const queryClient = useQueryClient();

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
      }).then((r) => {
        if (!r.ok) throw new Error("Falha");
        return r.json();
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["renda"] }),
  });

  const updateMutation = useMutation({
    mutationFn: (values: Renda) =>
      fetch("/api/renda", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }).then((r) => {
        if (!r.ok) throw new Error("Falha");
        return r.json();
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["renda"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/renda/${id}`, { method: "DELETE" }).then((r) => {
        if (!r.ok) throw new Error("Falha");
        return r.json();
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["renda"] }),
  });

  async function onSubmit(values: Renda) {
    if (selected && selected.id) {
      await updateMutation.mutateAsync({ ...values, id: selected.id });
    } else {
      await createMutation.mutateAsync(values);
    }
    setOpen(false);
    setSelected(null);
  }

  function onDelete(row: Renda) {
    if (!row.id) return;
    deleteMutation.mutate(Number(row.id));
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Renda</h1>
        <Button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Renda
        </Button>
      </div>

      <DataTable
        data={rendas}
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
        title={selected ? "Editar Renda" : "Nova Renda"}
        schema={rendaSchema}
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
          name="dataRecebimento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Recebimento</FormLabel>
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
