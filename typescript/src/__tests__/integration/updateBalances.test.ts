import { PrismaClient } from '@prisma/client'
import { UpdateTimeDepositsUseCase } from '../../application/UpdateTimeDepositsUseCase'
import { TimeDepositCalculator } from '../../domain/TimeDepositCalculator'
import { PrismaTimeDepositRepository } from '../../infrastructure/PrismaTimeDepositRepository'
import { clearTestDb, setupTestDb } from './setupTestDb'

describe('UpdateTimeDepositsUseCase (integration)', () => {
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

  it('updates balance using repository, calculator, and use case', async () => {
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
