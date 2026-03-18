# To run the code

## Architecture

The application follows a hexagonal architecture with a clear separation between domain, application, and infrastructure layers.

The persistence layer is abstracted via a repository pattern, making the system database-agnostic and allowing easy migration to PostgreSQL with Testcontainers if needed.

## Installation

### Install nvm (optional)

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

Running the above command downloads a script and runs it. The script clones the nvm repository to `~/.nvm`, and attempts to add the source lines from the snippet below to the correct profile file (`~/.bash_profile`, `~/.zshrc`, `~/.profile`, or `~/.bashrc`).

```sh
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

This is optional you can choose to directly install node directly (node >= 16.0.0)

### Install node using nvm

`nvm install 16.16.0`

### Install yarn (optional)

`npm install --global yarn`

This is optional, you can choose to use `npm` itself.

### Install node dependencies

`yarn install` or `npm install`

## Run the server

### Dev server while watching

`yarn dev`

### Test suite while watching

`yarn test`

### Run server

`yarn start`

## Database (Prisma)

The project uses [Prisma](https://www.prisma.io/) with SQLite by default.

### Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` (default: `file:./prisma/dev.db`).
2. Run migrations: `npm run db:migrate` (or `yarn db:migrate`).
3. Generate the client after schema changes: `npm run db:generate`.

### Scripts

| Script | Description |
|--------|-------------|
| `npm run db:generate` | Generate Prisma Client from schema |
| `npm run db:migrate` | Create and apply migrations (dev) |
| `npm run db:migrate:deploy` | Apply existing migrations (e.g. in CI/production) |
| `npm run db:push` | Push schema to DB without creating a migration |
| `npm run db:studio` | Open Prisma Studio to inspect/edit data |

### Using the repository

```ts
import { PrismaTimeDepositRepository } from './infrastructure/PrismaTimeDepositRepository'
import { TimeDepositCalculator } from './domain/TimeDepositCalculator'

const repo = new PrismaTimeDepositRepository()
const deposits = await repo.findAll()
const calc = new TimeDepositCalculator()
calc.updateBalance(deposits)
await repo.saveAll(deposits)
await repo.disconnect()
```

## Integration Testing

Integration tests are implemented using SQLite with Prisma.

- A dedicated test database is used (`prisma/test.db`)
- Migrations are applied before test execution
- Tests run sequentially (`--runInBand`) to avoid SQLite file conflicts
- Database is cleared before each test to ensure isolation

Run integration tests:

```bash
npm run test:integration
```
