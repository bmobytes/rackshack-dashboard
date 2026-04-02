<script lang="ts">
  import type { PressSummary } from '$lib/parsers/press';
  export let press: PressSummary | null;
</script>

<div class="card">
  <h2 class="text-sm font-bold text-rack-muted uppercase tracking-widest mb-3">🎵 Press Applications</h2>
  {#if press}
    <div class="grid grid-cols-3 gap-2">
      <div class="text-center">
        <div class="text-3xl font-bold text-yellow-400">{press.submitted}</div>
        <div class="text-xs text-rack-muted mt-1">Submitted</div>
      </div>
      <div class="text-center">
        <div class="text-3xl font-bold text-green-400">{press.approved}</div>
        <div class="text-xs text-rack-muted mt-1">Approved</div>
      </div>
      <div class="text-center">
        <div class="text-3xl font-bold text-blue-400">{press.drafting}</div>
        <div class="text-xs text-rack-muted mt-1">Drafting</div>
      </div>
    </div>
    <div class="mt-3 pt-3 border-t border-rack-border text-xs text-rack-muted">
      {press.total} total · {press.denied} denied · {press.no_response} no response
    </div>
  {:else}
    <p class="text-rack-muted text-sm">No data</p>
  {/if}
</div>
