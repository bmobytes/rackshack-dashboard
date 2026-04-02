<script lang="ts">
  import type { JobSummary, JobApplication } from '$lib/parsers/jobs';
  export let jobs: JobSummary;

  const statusColors: Record<string, string> = {
    applied: 'bg-blue-500',
    screening: 'bg-yellow-500',
    interview: 'bg-orange-500',
    offer: 'bg-green-500',
    rejected: 'bg-red-500',
    withdrawn: 'bg-gray-500',
    did_not_apply: 'bg-gray-700',
    unknown: 'bg-gray-600',
  };

  const statusLabels: Record<string, string> = {
    applied: 'Applied',
    screening: 'Screening',
    interview: 'Interview',
    offer: 'Offer',
    rejected: 'Rejected',
    withdrawn: 'Withdrawn',
    did_not_apply: 'Skipped',
    unknown: '?',
  };

  // Filter out "did not apply" by default
  let showSkipped = false;
  $: displayed = showSkipped ? jobs.applications : jobs.applications.filter(a => a.statusCategory !== 'did_not_apply');
</script>

<div class="card">
  <div class="flex items-center justify-between mb-3">
    <h2 class="text-sm font-bold text-rack-muted uppercase tracking-widest">📋 Applications</h2>
    <label class="flex items-center gap-2 text-xs text-rack-muted cursor-pointer">
      <input type="checkbox" bind:checked={showSkipped} class="rounded" />
      Show skipped
    </label>
  </div>

  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="text-rack-muted text-xs uppercase border-b border-rack-border">
          <th class="text-left py-2 pr-4">Status</th>
          <th class="text-left py-2 pr-4">Role</th>
          <th class="text-left py-2 pr-4">Company</th>
          <th class="text-left py-2 pr-4">Type</th>
          <th class="text-left py-2">Applied</th>
        </tr>
      </thead>
      <tbody>
        {#each displayed as app (app.title + app.company)}
          <tr class="border-b border-rack-border/50 hover:bg-rack-surface/50">
            <td class="py-2 pr-4">
              <span class="flex items-center gap-2">
                <span class="status-dot {statusColors[app.statusCategory] || 'bg-gray-500'}"></span>
                <span class="text-xs text-rack-muted">{statusLabels[app.statusCategory]}</span>
              </span>
            </td>
            <td class="py-2 pr-4 text-white">{app.title}</td>
            <td class="py-2 pr-4 text-rack-muted">{app.company || '—'}</td>
            <td class="py-2 pr-4 text-rack-muted text-xs">{app.type || '—'}</td>
            <td class="py-2 text-rack-muted text-xs">{app.applied || '—'}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
