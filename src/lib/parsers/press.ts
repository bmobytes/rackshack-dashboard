/**
 * Parser for /data/wallace/press-applications.md
 * Format: ### heading sections with - **Key:** Value lines
 */

export interface PressApplication {
  name: string;
  eventDates: string;
  submitted: string | null;
  contact: string;
  status: 'drafting' | 'submitted' | 'approved' | 'denied' | 'no-response' | 'unknown';
  notes: string;
  coverageBlurb: string;
  section: 'active' | 'archive';
}

export interface PressSummary {
  total: number;
  drafting: number;
  submitted: number;
  approved: number;
  denied: number;
  no_response: number;
  applications: PressApplication[];
}

function parseStatusValue(raw: string): PressApplication['status'] {
  const s = raw.toLowerCase().trim();
  if (s === 'drafting') return 'drafting';
  if (s === 'submitted') return 'submitted';
  if (s === 'approved') return 'approved';
  if (s === 'denied') return 'denied';
  if (s === 'no-response' || s === 'no_response') return 'no-response';
  return 'unknown';
}

function extractField(lines: string[], key: string): string {
  const pattern = new RegExp(`^\\s*-\\s*\\*\\*${key}:\\*\\*\\s*(.*)`, 'i');
  for (const line of lines) {
    const m = line.match(pattern);
    if (m) return m[1].trim();
  }
  return '';
}

function extractMultilineField(lines: string[], key: string): string {
  const pattern = new RegExp(`^\\s*-\\s*\\*\\*${key}:\\*\\*\\s*(.*)`, 'i');
  let capturing = false;
  const parts: string[] = [];
  
  for (const line of lines) {
    if (!capturing) {
      const m = line.match(pattern);
      if (m) {
        capturing = true;
        if (m[1].trim()) parts.push(m[1].trim());
      }
    } else {
      // Stop at next field
      if (line.match(/^\s*-\s*\*\*\w/)) break;
      if (line.trim()) parts.push(line.trim());
    }
  }
  
  return parts.join(' ');
}

export function parsePressApplications(markdown: string): PressSummary {
  const applications: PressApplication[] = [];

  // Split into Active and Archive sections first
  let currentSection: 'active' | 'archive' = 'active';
  
  // Find all ### blocks
  const sections = markdown.split(/\n(?=###\s)/);
  
  for (const section of sections) {
    const lines = section.split('\n');
    const heading = lines[0];
    
    if (!heading.startsWith('### ')) continue;
    
    // Detect section context from content above
    const name = heading.replace(/^###\s+/, '').trim();
    
    // Determine if this is in archive based on what came before
    // Simple heuristic: if "## Archive" appears in the original markdown before this block
    const headingIndex = markdown.indexOf(heading);
    const beforeHeading = markdown.substring(0, headingIndex);
    if (beforeHeading.includes('## Archive')) {
      currentSection = 'archive';
    }

    const eventDates = extractField(lines, 'Event Dates');
    const submitted = extractField(lines, 'Submitted') || null;
    const contact = extractField(lines, 'Contact');
    const statusRaw = extractField(lines, 'Status');
    const notes = extractField(lines, 'Notes');
    const coverageBlurb = extractMultilineField(lines, 'Coverage Blurb');

    applications.push({
      name,
      eventDates,
      submitted: submitted && submitted !== '' ? submitted : null,
      contact,
      status: parseStatusValue(statusRaw),
      notes,
      coverageBlurb,
      section: currentSection,
    });
  }

  const summary: PressSummary = {
    total: applications.length,
    drafting: 0,
    submitted: 0,
    approved: 0,
    denied: 0,
    no_response: 0,
    applications,
  };

  for (const app of applications) {
    if (app.status === 'drafting') summary.drafting++;
    else if (app.status === 'submitted') summary.submitted++;
    else if (app.status === 'approved') summary.approved++;
    else if (app.status === 'denied') summary.denied++;
    else if (app.status === 'no-response') summary.no_response++;
  }

  return summary;
}
