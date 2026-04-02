<script lang="ts">
  import type { PageData } from './$types';
  import JobPanel from '$lib/components/JobPanel.svelte';
  import PressPanel from '$lib/components/PressPanel.svelte';
  import StratumPanel from '$lib/components/StratumPanel.svelte';
  import FleetPanel from '$lib/components/FleetPanel.svelte';
  import QuickLinks from '$lib/components/QuickLinks.svelte';
  import JobTable from '$lib/components/JobTable.svelte';
  import PressCards from '$lib/components/PressCards.svelte';

  export let data: PageData;

  let lastRefresh = new Date().toLocaleTimeString();

  function refresh() {
    window.location.reload();
  }
</script>

<svelte:head>
  <title>🏠 Rackshack Command Center</title>
</svelte:head>

<div class="min-h-screen bg-rack-bg text-white p-4 font-mono">
  <!-- Header -->
  <header class="flex items-center justify-between mb-6 border-b border-rack-border pb-4">
    <div>
      <h1 class="text-2xl font-bold text-white">🏠 Rackshack Command Center</h1>
      <p class="text-rack-muted text-sm mt-1">Last refreshed: {lastRefresh}</p>
    </div>
    <button
      on:click={refresh}
      class="px-4 py-2 bg-rack-surface border border-rack-border rounded hover:border-blue-500 transition-colors text-sm"
    >
      ↻ Refresh
    </button>
  </header>

  <!-- Summary Row -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <JobPanel jobs={data.jobs} />
    <PressPanel press={data.press} />
    <StratumPanel stratum={data.stratum} />
  </div>

  <!-- Job Table -->
  {#if data.jobs}
    <section class="mb-6">
      <JobTable jobs={data.jobs} />
    </section>
  {/if}

  <!-- Press Cards + Stratum Board -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    {#if data.press}
      <PressCards press={data.press} />
    {/if}
    {#if data.stratum}
      <div class="card">
        <h2 class="text-sm font-bold text-rack-muted uppercase tracking-widest mb-3">📦 Stratum Filament</h2>
        <div class="space-y-1">
          {#each data.stratum.filament as spool}
            <div class="flex items-center justify-between text-sm">
              <span class="text-white">{spool.color} <span class="text-rack-muted">({spool.material})</span></span>
              <span class:text-yellow-400={spool.low} class:text-green-400={!spool.low}>
                {spool.estRemaining || spool.qtyInStock}
              </span>
            </div>
          {/each}
          {#if data.stratum.filament.length === 0}
            <p class="text-rack-muted text-sm">No inventory data</p>
          {/if}
        </div>
        {#if data.stratum.lowStockSpools > 0}
          <div class="mt-3 text-yellow-400 text-xs">⚠ {data.stratum.lowStockSpools} spool(s) low</div>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Fleet Status -->
  <section class="mb-6">
    <FleetPanel />
  </section>

  <!-- Quick Links -->
  <QuickLinks />
</div>

<style>
  :global(body) {
    background-color: #0d0d14;
  }
</style>
