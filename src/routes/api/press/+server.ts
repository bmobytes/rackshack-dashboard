import { json } from '@sveltejs/kit';
import { readFileSync } from 'fs';
import { parsePressApplications } from '$lib/parsers/press';

const PRESS_PATH = process.env.PRESS_PATH || '/data/wallace/press-applications.md';

export async function GET() {
  try {
    const markdown = readFileSync(PRESS_PATH, 'utf-8');
    const data = parsePressApplications(markdown);
    return json(data);
  } catch (err) {
    console.error('Failed to read press applications:', err);
    return json({ error: 'Failed to load press applications', total: 0, drafting: 0, submitted: 0, approved: 0, denied: 0, no_response: 0, applications: [] }, { status: 500 });
  }
}
