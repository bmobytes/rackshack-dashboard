/**
 * Parser for /data/vault/02_reference/job-search/tracker.md
 * Markdown table: Job Title | Company | Source | Applied | Via | Resume | Type | Status
 */

export interface JobApplication {
  title: string;
  company: string;
  source: string;
  applied: string | null;
  via: string;
  resume: string;
  type: string;
  status: string;
  statusCategory: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'withdrawn' | 'did_not_apply' | 'unknown';
}

export interface JobSummary {
  total: number;
  applied: number;
  screening: number;
  interview: number;
  offer: number;
  rejected: number;
  withdrawn: number;
  did_not_apply: number;
  applications: JobApplication[];
}

function categorizeStatus(raw: string): JobApplication['statusCategory'] {
  const s = raw.toLowerCase();
  if (s.includes('did not apply')) return 'did_not_apply';
  if (s.includes('rejected')) return 'rejected';
  if (s.includes('withdrawn')) return 'withdrawn';
  if (s.includes('offer')) return 'offer';
  if (s.includes('interview')) return 'interview';
  if (s.includes('screening') || s.includes('phone screen')) return 'screening';
  if (s.includes('applied')) return 'applied';
  return 'unknown';
}

function parseTableRow(row: string, headers: string[]): Record<string, string> {
  const cells = row.split('|').map(c => c.trim()).filter((_, i, a) => i > 0 && i < a.length - 1);
  const obj: Record<string, string> = {};
  headers.forEach((h, i) => {
    obj[h] = cells[i] ?? '';
  });
  return obj;
}

export function parseJobTracker(markdown: string): JobSummary {
  const lines = markdown.split('\n');
  
  // Find the table — look for a line with "Job Title" header
  let tableStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('| Job Title') || lines[i].includes('Job Title')) {
      tableStart = i;
      break;
    }
  }

  if (tableStart === -1) {
    return { total: 0, applied: 0, screening: 0, interview: 0, offer: 0, rejected: 0, withdrawn: 0, did_not_apply: 0, applications: [] };
  }

  // Parse header row
  const headerRow = lines[tableStart];
  const headers = headerRow.split('|').map(h => h.trim().toLowerCase().replace(/\s+/g, '_')).filter(h => h !== '');

  const applications: JobApplication[] = [];

  // Skip separator row (tableStart + 1), then parse data rows
  for (let i = tableStart + 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith('|')) break;
    
    const row = parseTableRow(line, headers);
    const rawStatus = row['status'] || '';
    
    // Skip placeholder rows (all dashes)
    if (row['job_title'] === '—' || row['job_title'] === '' || !row['job_title']) continue;

    const applied = row['applied'] && row['applied'] !== '—' ? row['applied'] : null;

    applications.push({
      title: row['job_title'] || '',
      company: row['company'] || '',
      source: row['source'] !== '—' ? row['source'] : '',
      applied,
      via: row['via'] !== '—' ? row['via'] : '',
      resume: row['resume'] !== '—' ? row['resume'] : '',
      type: row['type'] !== '—' ? row['type'] : '',
      status: rawStatus,
      statusCategory: categorizeStatus(rawStatus),
    });
  }

  const summary: JobSummary = {
    total: applications.length,
    applied: 0, screening: 0, interview: 0, offer: 0, rejected: 0, withdrawn: 0, did_not_apply: 0,
    applications,
  };

  for (const app of applications) {
    const cat = app.statusCategory;
    if (cat === 'applied' || cat === 'unknown') summary.applied++;
    else if (cat === 'screening') summary.screening++;
    else if (cat === 'interview') summary.interview++;
    else if (cat === 'offer') summary.offer++;
    else if (cat === 'rejected') summary.rejected++;
    else if (cat === 'withdrawn') summary.withdrawn++;
    else if (cat === 'did_not_apply') summary.did_not_apply++;
  }

  return summary;
}
