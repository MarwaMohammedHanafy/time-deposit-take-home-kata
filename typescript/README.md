# Time Deposit System

A TypeScript/Node.js backend for managing time deposit accounts. It calculates interest by plan type, exposes a REST API, and persists data via Prisma with SQLite or PostgreSQL.

---

## Features

**Interest plans**

- **Basic:** 1% monthly interest after 30 days.
- **Student:** 3% monthly after 30 days; no interest after 365 days.
- **Premium:** 5% monthly; interest applies only after 45 days.

**Stack and quality**

- REST API (Express) with two endpoints.
- SQLite (default) and PostgreSQL support via Prisma.
- Unit and integration tests (SQLite and PostgreSQL with Testcontainers).
- OpenAPI/Swagger documentation at `/api-docs`.
- Hexagonal (ports and adapters) architecture.

---

## Architecture

The project uses **Hexagonal Architecture**: domain and application stay free of frameworks and infrastructure; adapters (API, persistence) depend inward.

**Layers**

| Layer | Role |
|-------|------|
| **Domain** | Entities (`TimeDeposit`, `Withdrawal`), repository interface, interest strategies. |
| **Application** | Use cases only (`GetTimeDepositsUseCase`, `UpdateTimeDepositsUseCase`). |
| **Infrastructure** | Prisma repository, single Prisma client creation. |
| **API** | Express routes and Swagger; delegates to use cases. |

**Patterns**

- **Strategy:** Interest logic per plan (`BasicInterestStrategy`, `StudentInterestStrategy`, `PremiumInterestStrategy`) selected by a factory.
- **Repository:** Persistence behind `TimeDepositRepository`; implementation is injectable.
- **Dependency injection:** Use cases and repository receive dependencies in the composition root (`src/index.ts`).

---

## Project Structure

```
typescript/
  src/
    domain/
    application/
    infrastructure/
    api/
    tests/
    __tests__/
      integration/
        sqlite/
        postgres/
  prisma/
  test-api.cjs
  package.json
```

---

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` in the `typescript` folder:

   ```env
   DATABASE_URL="file:./prisma/dev.db"
   ```

3. Generate Prisma client and run migrations:

   ```bash
   npx prisma generate
   npm run db:migrate
   ```

4. (Optional) Seed data:

   ```bash
   npx prisma db seed
   ```

---

## Run Application

```bash
npm run dev
```

Server runs at **http://localhost:3000**.

---

## Swagger Instructions (Required for Submission)

1. Start the app (`npm run dev`), then open in a browser:

   **http://localhost:3000/api-docs**

2. **GET /time-deposits**
   - Expand **GET /time-deposits**.
   - Click **Try it out**.
   - Click **Execute**.
   - **Expected:** Status **200** and a JSON array of time deposits (each with `id`, `planType`, `balance`, `days`, `withdrawals`).

3. **POST /time-deposits/update-balances**
   - Expand **POST /time-deposits/update-balances**.
   - Click **Try it out**.
   - Click **Execute** (no body).
   - **Expected:** Status **204** (no content). After this, run **GET /time-deposits** again to see updated balances (interest applied).

---

## Testing

**Unit tests**

```bash
npm test
```

**SQLite integration tests**

```bash
npm run test:integration:sqlite
```

**PostgreSQL integration tests** (requires Docker)

```bash
npm run test:integration:postgres
```

**Run all tests** (unit, then both integration suites)

```bash
npm test
npm run test:integration:sqlite
npm run test:integration:postgres
```

- PostgreSQL tests use Testcontainers; they are skipped if Docker is unavailable.
- Each integration run uses an isolated database (test DB for SQLite; ephemeral Postgres container).

---

## API Test Script

From the `typescript` folder:

```bash
node test-api.cjs
```

The script calls **GET /time-deposits**, then **POST /time-deposits/update-balances**, and reports status codes. Use it to confirm the server responds with 200 and 204. For a full flow, run GET once, then POST, then GET again to see updated balances.

---

## Database

**TimeDeposit**

- `id` (PK), `planType`, `balance`, `days`.
- One-to-many with `Withdrawal`.

**Withdrawal**

- `id` (PK), `timeDepositId` (FK to `TimeDeposit`), `amount`, `date`.
- Cascade delete when a time deposit is removed.

---

## Notes

- No interest is applied before 30 days for any plan.
- Premium interest applies only after 45 days.
- Student interest stops after 365 days.
- Interest is rounded to two decimal places.
- After running PostgreSQL integration tests, run `npx prisma generate` (no schema flag) before starting the app so the Prisma client matches the default SQLite schema.

---

## Status

- All assignment requirements are implemented.
- Unit and integration tests are in place and passing.
- API is documented via Swagger and ready for submission.
