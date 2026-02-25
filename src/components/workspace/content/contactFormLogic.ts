import { z } from 'zod';

export const SUBMISSION_COOLDOWN_MS = 8000;

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'Please enter at least 2 characters for your name.'),
  email: z.email('Please enter a valid email address.'),
  message: z
    .string()
    .trim()
    .min(10, 'Please share at least a short message (10+ characters).')
    .max(1000, 'Message is too long. Keep it under 1000 characters.'),
  company: z.string().trim().max(0).optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export function shouldThrottleSubmission(lastSubmitAt: number, now = Date.now()) {
  return now - lastSubmitAt < SUBMISSION_COOLDOWN_MS;
}

export function buildContactPayload(values: Pick<ContactFormValues, 'name' | 'email' | 'message'>) {
  return {
    name: values.name,
    email: values.email,
    message: values.message,
    _subject: `Portfolio inquiry from ${values.name}`,
    _captcha: 'false',
    _template: 'table',
  };
}
