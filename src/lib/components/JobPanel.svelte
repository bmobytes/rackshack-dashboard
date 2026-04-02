<script lang="ts">
  import type { JobSummary } from '$lib/parsers/jobs';
  export let jobs: JobSummary | null;
</script>

<div class="card">
  <h2 class="text-sm font-bold text-rack-muted uppercase tracking-widest mb-3">💼 Job Search</h2>
  {#if jobs}
    <div class="grid grid-cols-2 gap-2">
      <div class="text-center">
        <div class="text-3xl font-bold text-blue-400">{jobs.applied}</div>
        <div class="text-xs text-rack-muted mt-1">Applied</div>
      </div>
      <div class="text-center">
        <div class="text-3xl font-bold text-yellow-400">{jobs.screening}</div>
        <div class="text-xs text-rack-muted mt-1">Screening</div>
      </div>
      <div class="text-center">
        <div class="text-3xl font-bold text-red-400">{jobs.rejected}</div>
        <div class="text-xs text-rack-muted mt-1">Rejected</div>
      </div>
      <div class="text-center">
        <div class="text-3xl font-bold text-green-400">{jobs.offer}</div>
        <div class="text-xs text-rack-muted mt-1">Offers</div>
      </div>
    </div>
    <div class="mt-3 pt-3 border-t border-rack-border text-xs text-rack-muted">
      {jobs.total} total tracked · {jobs.did_not_apply} skipped
    </div>
  {:else}
    <p class="text-rack-muted text-sm">No data</p>
  {/if}
</div>
