<script lang="ts">
  import type { PressSummary, PressApplication } from '$lib/parsers/press';
  export let press: PressSummary;

  const statusColors: Record<string, string> = {
    drafting: 'bg-blue-600 text-blue-100',
    submitted: 'bg-yellow-600 text-yellow-100',
    approved: 'bg-green-600 text-green-100',
    denied: 'bg-red-600 text-red-100',
    'no-response': 'bg-gray-600 text-gray-100',
    unknown: 'bg-gray-700 text-gray-100',
  };
</script>

<div class="card">
  <h2 class="text-sm font-bold text-rack-muted uppercase tracking-widest mb-3">🎵 Press Applications</h2>
  
  {#if press.applications.length === 0}
    <p class="text-rack-muted text-sm">No applications tracked yet.</p>
  {:else}
    <div class="space-y-3">
      {#each press.applications as app}
        <div class="border border-rack-border rounded p-3 bg-rack-bg/50">
          <div class="flex items-start justify-between gap-2">
            <div>
              <h3 class="text-white text-sm font-semibold">{app.name}</h3>
              {#if app.eventDates}
                <p class="text-rack-muted text-xs mt-0.5">📅 {app.eventDates}</p>
              {/if}
              {#if app.contact}
                <p class="text-rack-muted text-xs">👤 {app.contact}</p>
              {/if}
              {#if app.submitted}
                <p class="text-rack-muted text-xs">📤 Submitted {app.submitted}</p>
              {/if}
            </div>
            <span class="badge {statusColors[app.status] || statusColors.unknown} shrink-0">
              {app.status}
            </span>
          </div>
          {#if app.notes}
            <p class="text-rack-muted text-xs mt-2 line-clamp-2">{app.notes}</p>
          {/if}
          {#if app.section === 'archive'}
            <p class="text-rack-muted text-xs mt-1 italic">archived</p>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
