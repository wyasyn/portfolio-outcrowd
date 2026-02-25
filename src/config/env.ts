import { z } from 'zod';

const httpUrlSchema = z
  .string()
  .trim()
  .url()
  .refine((value) => value.startsWith('https://'), {
    message: 'must be an https URL',
  });

const envSchema = z.object({
  VITE_SITE_URL: z.string().trim().optional(),
  VITE_CONTACT_EMAIL: z.string().trim().email().optional(),
  VITE_CONTACT_PHONE_DISPLAY: z.string().trim().optional(),
  VITE_CONTACT_WHATSAPP: z.string().trim().optional(),
  VITE_CONTACT_LOCATION_LABEL: z.string().trim().optional(),
  VITE_CONTACT_LOCATION_QUERY: z.string().trim().optional(),
  VITE_CONTACT_FORM_ENDPOINT: z.string().trim().optional(),
});

const parsedEnv = envSchema.parse(import.meta.env);

const DEFAULTS = {
  siteUrl: 'https://example.com',
  contactEmail: 'yasinwalum@gmail.com',
  contactPhoneDisplay: '+256 700 000000',
  contactWhatsapp: '256700000000',
  contactLocationLabel: 'Kampala, Uganda',
  contactLocationQuery: 'Kampala, Uganda',
} as const;

function normalizeSiteUrl(siteUrl: string | undefined): string {
  if (!siteUrl) return DEFAULTS.siteUrl;
  const result = httpUrlSchema.safeParse(siteUrl);
  if (!result.success) return DEFAULTS.siteUrl;
  return result.data.replace(/\/$/, '');
}

export const appEnv = {
  siteUrl: normalizeSiteUrl(parsedEnv.VITE_SITE_URL),
  contactEmail: parsedEnv.VITE_CONTACT_EMAIL ?? DEFAULTS.contactEmail,
  contactPhoneDisplay: parsedEnv.VITE_CONTACT_PHONE_DISPLAY ?? DEFAULTS.contactPhoneDisplay,
  contactWhatsapp: parsedEnv.VITE_CONTACT_WHATSAPP ?? DEFAULTS.contactWhatsapp,
  contactLocationLabel: parsedEnv.VITE_CONTACT_LOCATION_LABEL ?? DEFAULTS.contactLocationLabel,
  contactLocationQuery: parsedEnv.VITE_CONTACT_LOCATION_QUERY ?? DEFAULTS.contactLocationQuery,
  contactFormEndpoint: parsedEnv.VITE_CONTACT_FORM_ENDPOINT,
} as const;
