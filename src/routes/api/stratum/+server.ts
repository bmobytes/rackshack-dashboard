import { json } from '@sveltejs/kit';
import { readFileSync } from 'fs';
import { parseStratumData } from '$lib/parsers/stratum';

const VAULT = process.env.STRATUM_VAULT_PATH || '/data/vault/10_stratum/operations';

export async function GET() {
  try {
    const orderMd = readFileSync(`${VAULT}/order-tracker.md`, 'utf-8');
    const queueMd = readFileSync(`${VAULT}/production-queue.md`, 'utf-8');
    const filamentMd = readFileSync(`${VAULT}/filament-inventory.md`, 'utf-8');
    const data = parseStratumData(orderMd, queueMd, filamentMd);
    return json(data);
  } catch (err) {
    console.error('Failed to read Stratum data:', err);
    return json({ error: 'Failed to load Stratum data', activeOrders: [], completedOrders: [], filament: [], totalSpools: 0, lowStockSpools: 0 }, { status: 500 });
  }
}
