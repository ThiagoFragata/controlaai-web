import { z } from "zod";

export const contaMensalSchema = z.object({
  id: z.string().optional(),
  descricao: z.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
  valor: z.number().min(0.01, "Valor deve ser maior que zero"),
  vencimento: z
    .number()
    .min(1, "Dia de vencimento inválido")
    .max(31, "Dia de vencimento inválido"),
  status: z.enum(["ATIVO", "INATIVO"]).default("ATIVO"),
  categoria: z.string().min(2, "Categoria deve ter pelo menos 2 caracteres"),
});

export const parcelaSchema = z.object({
  id: z.string().optional(),
  descricao: z.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
  valorParcela: z.number().min(0.01, "Valor deve ser maior que zero"),
  vencimentoData: z.string().optional(), // ISO date string
  numeroParcelas: z.number().min(1).optional(),
  status: z.enum(["PENDENTE", "PAGO"]).default("PENDENTE"),
  categoria: z.string().min(2).optional(),
});

export const gastoVariavelSchema = z.object({
  id: z.string().optional(),
  descricao: z.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
  valor: z.number().min(0.01, "Valor deve ser maior que zero"),
  data: z.string(), // ISO date
  categoria: z.string().min(2, "Categoria deve ter pelo menos 2 caracteres"),
});

export const rendaSchema = z.object({
  id: z.string().optional(),
  descricao: z.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
  valor: z.number().min(0.01, "Valor deve ser maior que zero"),
  dataRecebimento: z.string(), // ISO date
  fonte: z.string().min(2).optional(),
});

export const contaFuturaSchema = z.object({
  id: z.string().optional(),
  descricao: z.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
  valorEstimado: z.number().min(0.01, "Valor deve ser maior que zero"),
  previsaoPagamento: z.string(), // ISO date
  categoria: z.string().min(2).optional(),
});
