import type { PageServerLoad } from './$types';
import { readFileSync } from 'fs';
import { parseJobTracker } from '$lib/parsers/jobs';
import { parsePressApplications } from '$lib/parsers/press';
import { parseStratumData } from '$lib/parsers/stratum';

const VAULT = process.env.VAULT_PATH || '/data/vault';
const WALLACE = process.env.WALLACE_PATH || '/data/wallace';
const STRATUM_OPS = `${VAULT}/10_stratum/operations`;

function safeRead(path: string): string | null {
  try {
    return readFileSync(path, 'utf-8');
  } catch {
    return null;
  }
}

export const load: PageServerLoad = async () => {
  // Jobs
  const jobsMd = safeRead(`${VAULT}/02_reference/job-search/tracker.md`);
  const jobs = jobsMd ? parseJobTracker(jobsMd) : null;

  // Press
  const pressMd = safeRead(`${WALLACE}/press-applications.md`);
  const press = pressMd ? parsePressApplications(pressMd) : null;

  // Stratum
  const orderMd = safeRead(`${STRATUM_OPS}/order-tracker.md`);
  const queueMd = safeRead(`${STRATUM_OPS}/production-queue.md`);
  const filamentMd = safeRead(`${STRATUM_OPS}/filament-inventory.md`);
  const stratum = (orderMd && queueMd && filamentMd)
    ? parseStratumData(orderMd, queueMd, filamentMd)
    : null;

  return { jobs, press, stratum };
};
