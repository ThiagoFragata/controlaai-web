import { z } from "zod";

export const contaMensalSchema = z.object({
  id: z.string().optional(),
  descricao: z.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
  valor: z.number().min(0.01, "Valor deve ser maior que zero"),
  vencimentoDia: z
    .number()
    .min(1, "Dia de vencimento inválido")
    .max(31, "Dia de vencimento inválido"),
  formaPagamento: z
    .string()
    .min(2, "Forma de pagamento deve ter pelo menos 2 caracteres"),
  observacoes: z.string().optional(),
});

export const parcelaSchema = z.object({
  id: z.string().optional(),
  descricao: z.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
  valorTotal: z.number().min(0.01, "Valor total deve ser maior que zero"),
  qtdParcelas: z
    .number()
    .min(1, "Quantidade de parcelas deve ser pelo menos 1"),
  parcelaAtual: z.number().min(1, "Parcela atual deve ser pelo menos 1"),
  valorParcela: z
    .number()
    .min(0.01, "Valor da parcela deve ser maior que zero"),
  vencimentoData: z.string(), // ISO date string
  observacoes: z.string().optional(),
});

export const gastoVariavelSchema = z.object({
  id: z.string().optional(),
  data: z.string(), // ISO date
  descricao: z.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
  categoria: z.string().min(2, "Categoria deve ter pelo menos 2 caracteres"),
  valor: z.number().min(0.01, "Valor deve ser maior que zero"),
  formaPagamento: z
    .string()
    .min(2, "Forma de pagamento deve ter pelo menos 2 caracteres"),
  observacoes: z.string().optional(),
});

export const rendaSchema = z.object({
  id: z.string().optional(),
  dataRecebimento: z.string(), // ISO date
  descricao: z.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
  valor: z.number().min(0.01, "Valor deve ser maior que zero"),
  fonte: z.string().min(2, "Fonte deve ter pelo menos 2 caracteres"),
  observacoes: z.string().optional(),
});

export const contaFuturaSchema = z.object({
  id: z.string().optional(),
  descricao: z
    .string()
    .min(3, "Descrição deve ter pelo menos 3 caracteres")
    .max(100, "Descrição deve ter no máximo 100 caracteres")
    .trim()
    .transform((str) => str.replace(/\0/g, "")),
  valorEstimado: z
    .number()
    .min(0.01, "Valor estimado deve ser maior que zero")
    .max(999999.99, "Valor estimado deve ser menor que R$ 1.000.000,00"),
  previsaoPagamento: z
    .string()
    .transform((str) => str.replace(/\0/g, ""))
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Data de previsão inválida",
    })
    // Allow today or future dates: compare against the start of today
    .refine(
      (date) => {
        const parsed = new Date(date);
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        return parsed >= todayStart;
      },
      {
        message: "Data de previsão deve ser hoje ou futura",
      }
    ),
  prioridade: z
    .string()
    .min(1, "Prioridade deve ter pelo menos 1 caracter")
    .max(50, "Prioridade deve ter no máximo 50 caracteres")
    .trim()
    .transform((str) => str.replace(/\0/g, "")),
  observacoes: z
    .string()
    .max(500, "Observações devem ter no máximo 500 caracteres")
    .optional()
    .or(z.literal(""))
    .transform((str) => str?.replace(/\0/g, "")),
});
