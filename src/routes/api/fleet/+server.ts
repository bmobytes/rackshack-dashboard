import { json } from '@sveltejs/kit';
import { InfluxDB } from '@influxdata/influxdb-client';

const INFLUX_URL = process.env.INFLUX_URL || 'http://localhost:8086';
const INFLUX_TOKEN = process.env.INFLUX_TOKEN || '';
const INFLUX_ORG = process.env.INFLUX_ORG || 'bartos';
const INFLUX_BUCKET = process.env.INFLUX_BUCKET || 'netdata';

export interface NodeStatus {
  hostname: string;
  lastSeen: string | null;
  online: boolean;
  alarms: number;
  cpuPercent: number | null;
  ramPercent: number | null;
  diskPercent: number | null;
}

export async function GET() {
  if (!INFLUX_TOKEN) {
    return json({ error: 'INFLUX_TOKEN not set', nodes: [], totalNodes: 0, onlineNodes: 0, activeAlarms: 0 });
  }

  try {
    const client = new InfluxDB({ url: INFLUX_URL, token: INFLUX_TOKEN });
    const queryApi = client.getQueryApi(INFLUX_ORG);

    // Query: get last seen timestamp per host from system.cpu or similar measurement
    // and alarm counts
    const fluxQuery = `
from(bucket: "${INFLUX_BUCKET}")
  |> range(start: -30m)
  |> filter(fn: (r) => r._measurement == "system.cpu" and r._field == "user")
  |> group(columns: ["host"])
  |> last()
  |> keep(columns: ["host", "_time", "_value"])
`;

    const alarmQuery = `
from(bucket: "${INFLUX_BUCKET}")
  |> range(start: -30m)
  |> filter(fn: (r) => r._measurement == "netdata.alarms" and r._field == "status")
  |> filter(fn: (r) => r._value == 1.0)
  |> group(columns: ["host"])
  |> count()
`;

    const nodes: Record<string, NodeStatus> = {};
    const now = Date.now();

    await new Promise<void>((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const obj = tableMeta.toObject(row);
          const host = obj['host'] as string;
          const lastSeen = obj['_time'] as string;
          const lastSeenMs = new Date(lastSeen).getTime();
          const online = now - lastSeenMs < 5 * 60 * 1000; // 5 min threshold
          
          nodes[host] = {
            hostname: host,
            lastSeen,
            online,
            alarms: 0,
            cpuPercent: typeof obj['_value'] === 'number' ? Math.round(obj['_value'] as number) : null,
            ramPercent: null,
            diskPercent: null,
          };
        },
        error: reject,
        complete: resolve,
      });
    });

    // Query alarm counts
    await new Promise<void>((resolve, reject) => {
      queryApi.queryRows(alarmQuery, {
        next(row, tableMeta) {
          const obj = tableMeta.toObject(row);
          const host = obj['host'] as string;
          if (nodes[host]) {
            nodes[host].alarms = typeof obj['_value'] === 'number' ? obj['_value'] as number : 0;
          }
        },
        error: (_err) => resolve(), // Don't fail on alarm query error
        complete: resolve,
      });
    });

    const nodeList = Object.values(nodes).sort((a, b) => a.hostname.localeCompare(b.hostname));
    const onlineNodes = nodeList.filter(n => n.online).length;
    const activeAlarms = nodeList.reduce((sum, n) => sum + n.alarms, 0);

    return json({
      nodes: nodeList,
      totalNodes: nodeList.length,
      onlineNodes,
      activeAlarms,
    });
  } catch (err) {
    console.error('InfluxDB query failed:', err);
    return json({ error: 'InfluxDB query failed', nodes: [], totalNodes: 0, onlineNodes: 0, activeAlarms: 0 }, { status: 500 });
  }
}
