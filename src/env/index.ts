import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  AUTH_TOKEN: z.string(),
  CLIENT_ID: z.string(),
  CLIENT_SECRET: z.string(),
});

const envParsed = envSchema.safeParse(process.env);

if (envParsed.success === false) {
  console.log('Missing env variables', envParsed.error.format());

  throw new Error('Missing env variables');
}

export const env = envParsed.data;