/**
 * Parsers for Stratum Craft Co. operations files
 */

export interface Order {
  orderNum: string;
  etsyOrderId: string;
  items: string;
  tier: string;
  color: string;
  qty: string;
  orderDate: string | null;
  printStatus: string;
  finishStatus: string;
  shipStatus: string;
  trackingNum: string;
  notes: string;
  stage: 'queued' | 'printing' | 'finishing' | 'shipped' | 'delivered' | 'unknown';
}

export interface FilamentSpool {
  num: string;
  color: string;
  material: string;
  brand: string;
  unit: string;
  condition: string;
  qtyInStock: string;
  estRemaining: string;
  notes: string;
  low: boolean;
}

export interface StratumData {
  activeOrders: Order[];
  completedOrders: Order[];
  filament: FilamentSpool[];
  totalSpools: number;
  lowStockSpools: number;
}

function parseMarkdownTable(markdown: string, sectionHeader?: string): Record<string, string>[] {
  const lines = markdown.split('\n');
  
  let inTargetSection = !sectionHeader;
  let tableStart = -1;
  let headers: string[] = [];
  const rows: Record<string, string>[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Track section context
    if (sectionHeader && line.includes(sectionHeader)) {
      inTargetSection = true;
      continue;
    }
    
    // If we hit another ## section, stop
    if (sectionHeader && inTargetSection && tableStart !== -1 && line.match(/^## /) && !line.includes(sectionHeader)) {
      break;
    }
    
    if (!inTargetSection) continue;
    
    if (line.startsWith('|') && tableStart === -1) {
      // This is the header row
      headers = line.split('|').map(h => h.trim().toLowerCase().replace(/[\s#*]+/g, '_')).filter(h => h !== '');
      tableStart = i;
      continue;
    }
    
    if (tableStart !== -1 && line.match(/^\|[\s-|]+\|$/)) {
      // Separator row, skip
      continue;
    }
    
    if (tableStart !== -1 && line.startsWith('|')) {
      const cells = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      
      // Skip placeholder rows
      if (cells.every(c => c === '—' || c === '' || c === '-')) continue;
      
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = cells[idx] ?? '';
      });
      rows.push(row);
    } else if (tableStart !== -1 && !line.startsWith('|') && line.trim() !== '') {
      // Exited table
      if (sectionHeader) break;
    }
  }
  
  return rows;
}

function mapOrderStage(order: Record<string, string>): Order['stage'] {
  const ship = (order['ship_status'] || '').toLowerCase();
  const print = (order['print_status'] || '').toLowerCase();
  const finish = (order['finish_status'] || '').toLowerCase();
  
  if (ship.includes('delivered')) return 'delivered';
  if (ship.includes('shipped') || ship.includes('label')) return 'shipped';
  if (finish.includes('progress') || finish.includes('done')) return 'finishing';
  if (print.includes('printing')) return 'printing';
  if (print.includes('queued') || print.includes('done')) return 'queued';
  return 'unknown';
}

export function parseStratumData(orderMd: string, _queueMd: string, filamentMd: string): StratumData {
  // Parse active orders
  const activeRows = parseMarkdownTable(orderMd, 'Active Orders');
  const completedRows = parseMarkdownTable(orderMd, 'Completed Orders');
  
  const mapOrder = (r: Record<string, string>): Order => ({
    orderNum: r['order_#'] || r['order_num'] || '',
    etsyOrderId: r['etsy_order_id'] || '',
    items: r['item(s)'] || r['items'] || '',
    tier: r['tier'] || '',
    color: r['color'] || '',
    qty: r['qty'] || '',
    orderDate: r['order_date'] && r['order_date'] !== '—' ? r['order_date'] : null,
    printStatus: r['print_status'] || '',
    finishStatus: r['finish_status'] || '',
    shipStatus: r['ship_status'] || '',
    trackingNum: r['tracking_#'] || r['tracking_num'] || '',
    notes: r['notes'] || '',
    stage: mapOrderStage(r),
  });

  // Parse filament
  const filamentRows = parseMarkdownTable(filamentMd);
  const filament: FilamentSpool[] = filamentRows.map(r => {
    const est = (r['est._remaining'] || r['est_remaining'] || '').toLowerCase();
    const low = est.includes('low') || est.includes('25%') || est.includes('reorder');
    return {
      num: r['#'] || '',
      color: r['color'] || '',
      material: r['material'] || '',
      brand: r['brand'] || '',
      unit: r['unit'] || '',
      condition: r['condition'] || '',
      qtyInStock: r['qty_in_stock'] || '0',
      estRemaining: r['est._remaining'] || r['est_remaining'] || '',
      notes: r['notes'] || '',
      low,
    };
  });

  return {
    activeOrders: activeRows.map(mapOrder),
    completedOrders: completedRows.map(mapOrder),
    filament,
    totalSpools: filament.reduce((sum, s) => sum + (parseFloat(s.qtyInStock) || 0), 0),
    lowStockSpools: filament.filter(s => s.low).length,
  };
}
