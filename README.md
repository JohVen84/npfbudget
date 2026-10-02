# NPF Budget App

Hushållsapp för att dela upp räkningar. Byggd med Next.js, SQLite (better-sqlite3) och Drizzle.

## Krav

- Node.js 22 (eller senare) och npm
- Byggverktyg för native-moduler om better-sqlite3 saknar färdig binär för din plattform
  (Linux: `build-essential` och `python3`; macOS: Xcode Command Line Tools; Windows: Visual Studio Build Tools)

## Kom igång

```bash
npm ci
cp .env.example .env   # valfritt – standardvärdena fungerar utan .env
```

### Utveckling

```bash
npm run dev
```

Öppna http://localhost:3000.

### Produktion

```bash
npm run build
npm start
```

Eller allt i ett steg: `scripts/run.sh`.

Servern lyssnar på port 3000 på alla nätverksgränssnitt.

## Databas

Databasen är en SQLite-fil, som standard `data/npf-budget.db`. Sökvägen kan ändras med
`SQLITE_PATH` i `.env`. Mappen skapas automatiskt, och migreringar körs automatiskt före
`npm run dev` och `npm run build` (manuellt: `npm run db:migrate`).

Mappen `data/` ingår inte i git. Säkerhetskopiera den om du vill behålla datan.

## Övrigt

- `npm test` – kör enhetstester (Vitest)
- `npm run lint` – kör ESLint
- `npm run db:generate` – skapar en ny migrering efter ändringar i `src/server/db/schema.ts`
