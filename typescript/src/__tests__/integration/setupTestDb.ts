import { PrismaClient } from '@prisma/client'

/**
 * Set DATABASE_URL for tests and create a PrismaClient that uses it.
 * Must be called before any code that uses Prisma. Clears existing data.
 * Run with DATABASE_URL=file:./prisma/test.db (e.g. via npm run test:integration) so migrations are applied first.
 */
export function setupTestDb(): PrismaClient {
  process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'file:./prisma/test.db'
  const prisma = new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL },
    },
  })
  return prisma
}

/**
 * Clear all data from timeDeposit and withdrawal tables.
 * Call in beforeEach for test isolation.
 */
export async function clearTestDb(prisma: PrismaClient): Promise<void> {
  await prisma.withdrawal.deleteMany()
  await prisma.timeDeposit.deleteMany()
}
