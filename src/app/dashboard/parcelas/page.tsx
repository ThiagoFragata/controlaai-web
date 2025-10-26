"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/data-table";
import { FormDialog } from "@/components/form-dialog";
import { parcelaSchema } from "@/lib/schemas";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

type Parcela = z.infer<typeof parcelaSchema>;

const columns: Column<Parcela>[] = [
  { header: "Descrição", accessorKey: "descricao" as keyof Parcela },
  {
    header: "Valor Total",
    accessorKey: "valorTotal" as keyof Parcela,
    cell: (r) => `R$ ${(r.valorTotal || 0).toFixed(2)}`,
  },
  {
    header: "Qtd Parcelas",
    accessorKey: "qtdParcelas" as keyof Parcela,
  },
  {
    header: "Parcela Atual",
    accessorKey: "parcelaAtual" as keyof Parcela,
  },
  {
    header: "Valor Parcela",
    accessorKey: "valorParcela" as keyof Parcela,
    cell: (r) => `R$ ${(r.valorParcela || 0).toFixed(2)}`,
  },
  {
    header: "Vencimento",
    accessorKey: "vencimentoData" as keyof Parcela,
    cell: (r) =>
      r.vencimentoData ? new Date(r.vencimentoData).toLocaleDateString() : "",
  },
  { header: "Observações", accessorKey: "observacoes" as keyof Parcela },
];

async function fetchParcelas() {
  const res = await fetch("/api/parcelas");
  if (!res.ok) throw new Error("Falha ao buscar parcelas");
  return res.json();
}

export default function ParcelasPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Parcela | null>(null);
  const queryClient = useQueryClient();

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
      }).then((r) => {
        if (!r.ok) throw new Error("Falha");
        return r.json();
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["parcelas"] }),
  });

  const updateMutation = useMutation({
    mutationFn: (values: Parcela) =>
      fetch("/api/parcelas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }).then((r) => {
        if (!r.ok) throw new Error("Falha");
        return r.json();
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["parcelas"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/parcelas/${id}`, { method: "DELETE" }).then((r) => {
        if (!r.ok) throw new Error("Falha");
        return r.json();
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["parcelas"] }),
  });

  async function onSubmit(values: Parcela) {
    if (selected && selected.id) {
      await updateMutation.mutateAsync({ ...values, id: selected.id });
    } else {
      await createMutation.mutateAsync(values);
    }
    setOpen(false);
    setSelected(null);
  }

  function onDelete(row: Parcela) {
    if (!row.id) return;
    deleteMutation.mutate(Number(row.id));
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Parcelas</h1>
        <Button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Parcela
        </Button>
      </div>

      <DataTable
        data={parcelas}
        columns={columns}
        onEdit={(r) => {
          setSelected({
            ...r,
            vencimentoData: r.vencimentoData
              ? new Date(r.vencimentoData).toISOString().split("T")[0]
              : "",
          });
          setOpen(true);
        }}
        onDelete={onDelete}
      />

      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title={selected ? "Editar Parcela" : "Nova Parcela"}
        defaultValues={selected || undefined}
        onSubmit={onSubmit}
        isSubmitting={
          createMutation.status === "pending" ||
          updateMutation.status === "pending"
        }
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
          name="valorTotal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Total</FormLabel>
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
          name="qtdParcelas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade de Parcelas</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="parcelaAtual"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parcela Atual</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="valorParcela"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor da Parcela</FormLabel>
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
          name="vencimentoData"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Vencimento</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
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
