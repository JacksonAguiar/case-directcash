import { z } from 'zod';

export const eventSchema = z.object({
  type: z.enum(['payment', 'upsell']),
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  value: z.number().positive('Valor deve ser positivo'),
  timestamp: z.string().datetime().optional(),
});

export type EventInput = z.infer<typeof eventSchema>;
