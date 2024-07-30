'use server'

import { z } from 'zod';
import pool from '@/lib/db';

const schema = z.object({
  winner: z.enum(['trieve', 'algolia']),
  query: z.string().min(1),
  fingerprint: z.string(),
});

export type LogState = {
  message: string;
  success: boolean;
};

export async function logPreference(prevState: LogState, formData: FormData): Promise<LogState> {
  const parsedData = schema.safeParse({
    winner: formData.get('winner'),
    query: formData.get('query'),
    fingerprint: formData.get('fingerprint'),
  });

  if (!parsedData.success) {
    return { success: false, message: 'Invalid form data' };
  }

  const { winner, query, fingerprint } = parsedData.data;

  try {
    const client = await pool.connect();
    try {
      await client.query(
        'INSERT INTO search_preferences (winner, query, fingerprint, created_at) VALUES ($1, $2, $3, NOW())',
        [winner, query, fingerprint]
      );
      return { success: true, message: 'Preference logged successfully' };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error logging preference:', error);
    return { success: false, message: 'Error logging preference' };
  }
}