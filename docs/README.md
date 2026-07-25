# Documentation

```text
docs/
├── 00-architecture/     # Architecture Version 1.1 (canonical)
├── 01-epics/
├── 02-adr/              # Includes ADR-001 (NestJS + Next.js split)
└── 03-assets/
```

- **00-architecture/** — architecture source of truth (Version 1.1)
- **01-epics/** — implementation epics
- **02-adr/** — architecture decision records
- **03-assets/** — diagrams and shared assets

## Canonical runtime shape

- `apps/web` — Next.js App Router UI only
- `server` — NestJS REST API + NestJS Workers (BullMQ)
- `packages` — shared, types, sdk
