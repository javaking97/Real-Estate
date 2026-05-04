import { z } from 'zod';

const envSchema = z.object({
  API_BASE_URL: z.string().url(),
});

const parsedEnv = envSchema.parse({
  API_BASE_URL:
    import.meta.env.API_BASE_URL ??
    (import.meta.env.MODE === 'test' ? 'http://localhost:8080' : undefined),
});

export const env = {
  apiBaseUrl: parsedEnv.API_BASE_URL,
};
