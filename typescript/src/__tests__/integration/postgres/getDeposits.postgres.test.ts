import { PrismaClient } from '@prisma/client'
import { GetTimeDepositsUseCase } from '../../../application/GetTimeDepositsUseCase'
import { PrismaTimeDepositRepository } from '../../../infrastructure/PrismaTimeDepositRepository'
import {
  clearTestDb,
  setupPostgresTestDb,
  teardownPostgresTestDb,
} from './setupPostgresTestDb'

describe('GetTimeDepositsUseCase (PostgreSQL integration)', () => {
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

  it('returns deposits with withdrawals', async () => {
    if (!prisma) return
    await prisma.timeDeposit.create({
      data: {
        planType: 'basic',
        balance: 500,
        days: 30,
        withdrawals: {
          create: {
            amount: 100,
            date: new Date('2024-01-15'),
          },
        },
      },
    })

    const repository = new PrismaTimeDepositRepository(prisma)
    const useCase = new GetTimeDepositsUseCase(repository)

    const deposits = await useCase.execute()

    expect(deposits).toHaveLength(1)
    expect(deposits[0].withdrawals).toHaveLength(1)
    expect(deposits[0].withdrawals[0].amount).toBe(100)
  })
})
