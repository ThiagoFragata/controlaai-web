"use client";

import React from "react";
import { useForm, FieldValues, DefaultValues } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

interface FormDialogProps<T extends FieldValues = FieldValues> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  defaultValues?: DefaultValues<T>;
  onSubmit: (values: T) => Promise<void>;
  isSubmitting?: boolean;
  children: React.ReactNode;
}

export function FormDialog<T extends FieldValues = FieldValues>({
  open,
  onOpenChange,
  title,
  defaultValues,
  onSubmit,
  isSubmitting = false,
  children,
}: FormDialogProps<T>) {
  const form = useForm<T>({
    defaultValues,
  });

  async function handleSubmit(values: T) {
    try {
      await onSubmit(values);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {children}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
