import { describe, expect, it } from 'vitest';
import { createCaseSchema, contactRequestSchema } from '@/lib/validators';

describe('validators', () => {
  it('accepts valid case payload', () => {
    const payload = {
      full_name: 'Maria Silva',
      age: 32,
      gender: 'F',
      last_seen_location: 'Lisboa',
      last_seen_date: '2024-01-01',
      description: 'Descrição curta',
      contact_phone: '+351900000000',
      contact_email: 'maria@example.com',
      consent: true
    };

    expect(() => createCaseSchema.parse(payload)).not.toThrow();
  });

  it('rejects contact request without contacto', () => {
    const payload = {
      case_id: crypto.randomUUID(),
      requester_name: 'João',
      requester_email: '',
      requester_phone: '',
      message: 'Preciso de falar com a equipa.'
    };

    const result = contactRequestSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
});
