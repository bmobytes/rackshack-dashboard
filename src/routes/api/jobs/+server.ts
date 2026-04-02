import { json } from '@sveltejs/kit';
import { readFileSync } from 'fs';
import { parseJobTracker } from '$lib/parsers/jobs';

const TRACKER_PATH = process.env.JOBS_TRACKER_PATH || '/data/vault/02_reference/job-search/tracker.md';

export async function GET() {
  try {
    const markdown = readFileSync(TRACKER_PATH, 'utf-8');
    const data = parseJobTracker(markdown);
    return json(data);
  } catch (err) {
    console.error('Failed to read job tracker:', err);
    return json({ error: 'Failed to load job tracker', total: 0, applied: 0, screening: 0, interview: 0, offer: 0, rejected: 0, withdrawn: 0, did_not_apply: 0, applications: [] }, { status: 500 });
  }
}
