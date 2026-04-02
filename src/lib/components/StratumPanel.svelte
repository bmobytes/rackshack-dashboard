<script lang="ts">
  import type { StratumData } from '$lib/parsers/stratum';
  export let stratum: StratumData | null;
</script>

<div class="card">
  <h2 class="text-sm font-bold text-rack-muted uppercase tracking-widest mb-3">🎲 Stratum Craft Co.</h2>
  {#if stratum}
    <div class="grid grid-cols-3 gap-2">
      <div class="text-center">
        <div class="text-3xl font-bold text-purple-400">{stratum.activeOrders.length}</div>
        <div class="text-xs text-rack-muted mt-1">Active Orders</div>
      </div>
      <div class="text-center">
        <div class="text-3xl font-bold text-white">{stratum.totalSpools}</div>
        <div class="text-xs text-rack-muted mt-1">Spools</div>
      </div>
      <div class="text-center">
        <div class="text-3xl font-bold" class:text-yellow-400={stratum.lowStockSpools > 0} class:text-green-400={stratum.lowStockSpools === 0}>
          {stratum.lowStockSpools}
        </div>
        <div class="text-xs text-rack-muted mt-1">Low Stock</div>
      </div>
    </div>
    <div class="mt-3 pt-3 border-t border-rack-border text-xs text-rack-muted">
      {#if stratum.activeOrders.length === 0}
        Pre-launch — no active orders
      {:else}
        {stratum.completedOrders.length} completed
      {/if}
    </div>
  {:else}
    <p class="text-rack-muted text-sm">No data</p>
  {/if}
</div>
