import { z } from 'zod';

export const caseStatusEnum = z.enum([
  'pending_review',
  'approved',
  'rejected',
  'closed'
]);

export const createCaseSchema = z
  .object({
    full_name: z.string().min(3).max(120),
    age: z
      .number({ invalid_type_error: 'Idade deve ser numérica' })
      .int()
      .min(0)
      .max(120)
      .optional()
      .nullable(),
    gender: z.enum(['M', 'F', 'Outro']).optional().nullable(),
    last_seen_location: z.string().min(3).max(200),
    last_seen_date: z
      .string()
      .optional()
      .nullable()
      .refine((val) => !val || !Number.isNaN(Date.parse(val)), 'Data inválida'),
    description: z.string().max(1000).optional().nullable(),
    contact_phone: z.string().min(6).max(50),
    contact_email: z.string().email(),
    consent: z.literal(true),
    photos: z
      .array(
        z.object({
          file: z.instanceof(File).optional(),
          url: z.string().optional(),
          is_primary: z.boolean().optional()
        })
      )
      .optional()
  })
  .strict();

export const updateCaseSchema = createCaseSchema
  .omit({ consent: true })
  .partial()
  .extend({
    consent: z.boolean().optional(),
    status: caseStatusEnum.optional()
  });

export const contactRequestSchema = z
  .object({
    case_id: z.string().uuid(),
    requester_name: z.string().min(2).max(120),
    requester_email: z.string().email().optional().or(z.literal('').transform(() => undefined)),
    requester_phone: z.string().min(6).max(50).optional().or(z.literal('').transform(() => undefined)),
    message: z.string().min(5).max(500)
  })
  .refine(
    (data) => data.requester_email || data.requester_phone,
    {
      message: 'Informe email ou telefone para contacto',
      path: ['requester_email']
    }
  );

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(50).default(24)
});

export type CreateCaseInput = z.infer<typeof createCaseSchema>;
export type UpdateCaseInput = z.infer<typeof updateCaseSchema>;
export type ContactRequestInput = z.infer<typeof contactRequestSchema>;
