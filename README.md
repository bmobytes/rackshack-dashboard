# Rackshack Command Center

Unified dashboard for homelab status, job search, press applications, and Stratum Craft Co. operations.

## Stack

- SvelteKit + Tailwind CSS
- Docker / docker-compose
- InfluxDB (for homelab fleet metrics)
- No database — reads markdown files directly from mounted volumes

## Development

```bash
npm install
npm run dev
```

Set env vars (copy `.env.example` to `.env`):
```
INFLUX_TOKEN=...
```

For local dev, data paths default to `/data/vault` etc. Override with env vars:
```
VAULT_PATH=/mnt/rackshack/wish/workspace/rackshack
WALLACE_PATH=/mnt/rackshack/wallace/workspace
```

## Deploy (bmo-deploy)

```bash
# Build and push image
docker build -t bmobytes/rackshack-dashboard:latest .
docker push bmobytes/rackshack-dashboard:latest

# On bmo-deploy
ssh bmo-deploy
cd ~/projects/rackshack-dashboard
cp .env.example .env  # fill in INFLUX_TOKEN
docker-compose up -d
```

Dashboard available at `http://192.168.148.185:3000`

## Data Sources

| Panel | Source File |
|-------|------------|
| Job Search | `/data/vault/02_reference/job-search/tracker.md` |
| Press Apps | `/data/wallace/press-applications.md` |
| Stratum Orders | `/data/vault/10_stratum/operations/order-tracker.md` |
| Stratum Filament | `/data/vault/10_stratum/operations/filament-inventory.md` |
| Fleet Health | InfluxDB `bartos/netdata` |
