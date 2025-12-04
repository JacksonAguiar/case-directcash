import { z } from 'zod';

export const eventSchema = z.object({
  type: z.enum(['payment', 'upsell']),
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  age: z.number().int().min(0, 'Idade deve ser um número inteiro não negativo'),
  value: z.number().positive('Valor deve ser positivo'),
  timestamp: z.string().datetime().optional(),
});

export type EventInput = z.infer<typeof eventSchema>;
