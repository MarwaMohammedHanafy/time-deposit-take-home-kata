import { PrismaClient } from '@prisma/client'
import { GetTimeDepositsUseCase } from '../../../application/GetTimeDepositsUseCase.ts'
import { PrismaTimeDepositRepository } from '../../../infrastructure/PrismaTimeDepositRepository'
import { clearTestDb, setupTestDb } from './setupTestDb'

describe('GetTimeDepositsUseCase (integration)', () => {
  let prisma: PrismaClient

  beforeAll(() => {
    prisma = setupTestDb()
  })

  afterAll(async () => {
    if (prisma) await prisma.$disconnect()
  })

  beforeEach(async () => {
    await clearTestDb(prisma)
  })

  it('returns deposits with withdrawals', async () => {
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
