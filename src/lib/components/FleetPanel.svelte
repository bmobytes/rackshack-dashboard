<script lang="ts">
  import { onMount } from 'svelte';

  interface NodeStatus {
    hostname: string;
    lastSeen: string | null;
    online: boolean;
    alarms: number;
    cpuPercent: number | null;
  }

  interface FleetData {
    nodes: NodeStatus[];
    totalNodes: number;
    onlineNodes: number;
    activeAlarms: number;
    error?: string;
  }

  let fleet: FleetData | null = null;
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const res = await fetch('/api/fleet');
      fleet = await res.json();
      if (fleet?.error && !fleet.nodes?.length) {
        error = fleet.error;
      }
    } catch (e) {
      error = 'Failed to load fleet data';
    } finally {
      loading = false;
    }
  });
</script>

<div class="card">
  <div class="flex items-center justify-between mb-3">
    <h2 class="text-sm font-bold text-rack-muted uppercase tracking-widest">🖥️ Homelab Fleet</h2>
    {#if fleet}
      <span class="text-xs text-rack-muted">
        {fleet.onlineNodes}/{fleet.totalNodes} online
        {#if fleet.activeAlarms > 0}
          · <span class="text-red-400">⚠ {fleet.activeAlarms} alarms</span>
        {/if}
      </span>
    {/if}
  </div>

  {#if loading}
    <div class="flex items-center gap-2 text-rack-muted text-sm py-4">
      <span class="animate-spin">⟳</span> Loading fleet status...
    </div>
  {:else if error}
    <div class="text-red-400 text-sm py-2">
      {#if error.includes('INFLUX_TOKEN')}
        InfluxDB token not configured — set INFLUX_TOKEN env var
      {:else}
        {error}
      {/if}
    </div>
  {:else if fleet && fleet.nodes.length > 0}
    {#if fleet.activeAlarms > 0}
      <div class="mb-3 p-2 bg-red-900/30 border border-red-800 rounded text-red-300 text-xs">
        ⚠ {fleet.activeAlarms} active alarm{fleet.activeAlarms !== 1 ? 's' : ''} across fleet
      </div>
    {/if}
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
      {#each fleet.nodes as node}
        <div class="border rounded p-2 text-xs {node.online ? 'border-green-800 bg-green-900/20' : 'border-red-900 bg-red-900/20'}">
          <div class="flex items-center gap-1 mb-1">
            <span class="w-2 h-2 rounded-full {node.online ? 'bg-green-400' : 'bg-red-400'}"></span>
            <span class="text-white truncate font-mono" title={node.hostname}>
              {node.hostname.split('.')[0]}
            </span>
          </div>
          {#if node.cpuPercent !== null}
            <div class="text-rack-muted">CPU: {node.cpuPercent}%</div>
          {/if}
          {#if node.alarms > 0}
            <div class="text-yellow-400">⚠ {node.alarms}</div>
          {/if}
        </div>
      {/each}
    </div>
  {:else if fleet}
    <p class="text-rack-muted text-sm py-2">No nodes found in InfluxDB. Check that Netdata agents are reporting.</p>
  {/if}
</div>
