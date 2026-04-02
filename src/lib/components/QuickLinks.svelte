<script lang="ts">
  const links = [
    { label: 'Grafana', url: 'http://192.168.148.185:3001', emoji: '📊' },
    { label: 'InfluxDB', url: 'http://192.168.148.185:8086', emoji: '📈' },
    { label: 'Status Page', url: 'http://192.168.148.185:8080', emoji: '🟢' },
    { label: 'WP Admin', url: 'https://darkroommusic.com/wp-admin', emoji: '📝' },
    { label: 'Etsy Shop', url: 'https://stratumcraftco.etsy.com', emoji: '🛒' },
    { label: 'GitHub (BMO)', url: 'https://github.com/bmobytes', emoji: '🐙' },
    { label: 'GitHub (djbartos93)', url: 'https://github.com/djbartos93', emoji: '🐙' },
    { label: 'Darkroom Music', url: 'https://darkroommusic.com', emoji: '🎵' },
  ];
</script>

<div class="card">
  <h2 class="text-sm font-bold text-rack-muted uppercase tracking-widest mb-3">🔗 Quick Links</h2>
  <div class="flex flex-wrap gap-2">
    {#each links as link}
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-1.5 px-3 py-1.5 bg-rack-bg border border-rack-border rounded hover:border-blue-500 transition-colors text-sm text-white hover:text-blue-300"
      >
        <span>{link.emoji}</span>
        <span>{link.label}</span>
      </a>
    {/each}
  </div>
</div>
