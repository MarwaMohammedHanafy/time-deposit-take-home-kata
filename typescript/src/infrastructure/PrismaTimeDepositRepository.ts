import { PrismaClient } from '@prisma/client'
import { TimeDeposit } from '../domain/TimeDeposit'
import { Withdrawal } from '../domain/Withdrawal'
import { TimeDepositRepository } from '../domain/TimeDepositRepository'
import { prisma } from './prisma'

export class PrismaTimeDepositRepository implements TimeDepositRepository {
  constructor(private readonly prisma: PrismaClient = prisma) {}

  async findAll(): Promise<TimeDeposit[]> {
    const rows = await this.prisma.timeDeposit.findMany({
      include: { withdrawals: true },
      orderBy: { id: 'asc' },
    })
    return rows.map((row) => this.toDomain(row))
  }

  async saveAll(deposits: TimeDeposit[]): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      for (const deposit of deposits) {
        const { withdrawals } = this.toPrisma(deposit)
        const payload = {
          planType: deposit.planType,
          balance: deposit.balance,
          days: deposit.days,
          withdrawals: { create: withdrawals },
        }
        if (deposit.id > 0) {
          const existing = await tx.timeDeposit.findUnique({
            where: { id: deposit.id },
          })
          if (existing) {
            await tx.withdrawal.deleteMany({
              where: { timeDepositId: deposit.id },
            })
            await tx.timeDeposit.update({
              where: { id: deposit.id },
              data: {
                planType: deposit.planType,
                balance: deposit.balance,
                days: deposit.days,
                withdrawals: { create: withdrawals },
              },
            })
            continue
          }
        }
        await tx.timeDeposit.create({ data: payload })
      }
    })
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect()
  }

  private toDomain(row: {
    id: number
    planType: string
    balance: number
    days: number
    withdrawals: { id: number; timeDepositId: number; amount: number; date: Date }[]
  }): TimeDeposit {
    const withdrawals = row.withdrawals.map(
      (w) => new Withdrawal(w.id, w.timeDepositId, w.amount, w.date)
    )
    return new TimeDeposit(
      row.id,
      row.planType,
      row.balance,
      row.days,
      withdrawals
    )
  }

  private toPrisma(deposit: TimeDeposit): {
    withdrawals: { amount: number; date: Date }[]
  } {
    const withdrawals = deposit.withdrawals.map((w) => ({
      amount: w.amount,
      date: w.date,
    }))
    return { withdrawals }
  }
}
