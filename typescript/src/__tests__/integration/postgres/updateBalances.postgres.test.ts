import { PrismaClient } from '@prisma/client'
import { UpdateTimeDepositsUseCase } from '../../../application/UpdateTimeDepositsUseCase'
import { TimeDepositCalculator } from '../../../domain/TimeDepositCalculator'
import { PrismaTimeDepositRepository } from '../../../infrastructure/PrismaTimeDepositRepository'
import {
  clearTestDb,
  setupPostgresTestDb,
  teardownPostgresTestDb,
} from './setupPostgresTestDb'

describe('UpdateTimeDepositsUseCase (PostgreSQL integration)', () => {
  let prisma: PrismaClient | undefined
  let container: Awaited<ReturnType<typeof setupPostgresTestDb>>['container'] | undefined

  beforeAll(async () => {
    try {
      const env = await setupPostgresTestDb()
      prisma = env.prisma
      container = env.container
    } catch (err) {
      const msg = (err as Error)?.message ?? ''
      if (msg.includes('container runtime') || msg.includes('Could not find')) {
        return // Docker not available, skip suite
      }
      throw err
    }
  })

  afterAll(async () => {
    if (prisma && container) await teardownPostgresTestDb(prisma, container)
  })

  beforeEach(async () => {
    if (!prisma) return
    await clearTestDb(prisma)
  })

  it('updates balance using repository, calculator, and use case', async () => {
    if (!prisma) return
    await prisma.timeDeposit.create({
      data: {
        planType: 'basic',
        balance: 1000,
        days: 45,
      },
    })

    const repository = new PrismaTimeDepositRepository(prisma)
    const calculator = new TimeDepositCalculator()
    const useCase = new UpdateTimeDepositsUseCase(repository, calculator)

    await useCase.execute()

    const updated = await prisma.timeDeposit.findFirst()
    expect(updated).not.toBeNull()
    expect(updated!.balance).toBe(1000.83)
  })
})
