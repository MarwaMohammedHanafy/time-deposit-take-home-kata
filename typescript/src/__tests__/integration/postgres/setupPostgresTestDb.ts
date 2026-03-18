import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql'

/** PostgreSQL container and Prisma client for teardown */
export type PostgresTestEnv = {
  prisma: PrismaClient
  container: StartedPostgreSqlContainer
}

/**
 * Start a PostgreSQL container, set DATABASE_URL, push schema, and return PrismaClient.
 * Call this in beforeAll. Env must be set BEFORE PrismaClient is created.
 */
export async function setupPostgresTestDb(): Promise<PostgresTestEnv> {
  const container = await new PostgreSqlContainer('postgres:15-alpine').start()
  const connectionUri = container.getConnectionUri()
  process.env.DATABASE_URL = connectionUri

  execSync('npx prisma db push --schema=prisma/schema.postgres.prisma', {
    stdio: 'inherit',
    env: process.env,
  })

  const prisma = new PrismaClient({
    datasources: {
      db: { url: connectionUri },
    },
  })

  return { prisma, container }
}

/**
 * Disconnect Prisma and stop the container. Call in afterAll.
 */
export async function teardownPostgresTestDb(
  prisma: PrismaClient,
  container: StartedPostgreSqlContainer
): Promise<void> {
  if (prisma) await prisma.$disconnect()
  await container.stop()
}

/**
 * Clear all data from withdrawal and timeDeposit tables (referential integrity).
 * Call in beforeEach for test isolation.
 */
export async function clearTestDb(prisma: PrismaClient): Promise<void> {
  await prisma.withdrawal.deleteMany()
  await prisma.timeDeposit.deleteMany()
}
