import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.withdrawal.deleteMany()
  await prisma.timeDeposit.deleteMany()

  // 1. Basic - should get interest
  const basicWithInterest = await prisma.timeDeposit.create({
    data: {
      planType: 'basic',
      balance: 1000,
      days: 45, // > 30 → interest applies
    },
  })

  // 2. Basic - no interest
  await prisma.timeDeposit.create({
    data: {
      planType: 'basic',
      balance: 1000,
      days: 30, // ≤ 30 → no interest
    },
  })

  // 3. Student - should get interest
  await prisma.timeDeposit.create({
    data: {
      planType: 'student',
      balance: 1000,
      days: 100, // < 365 → interest applies
    },
  })

  // 4. Student - no interest (expired)
  await prisma.timeDeposit.create({
    data: {
      planType: 'student',
      balance: 1000,
      days: 366, // ≥ 365 → no interest
    },
  })

  // 5. Premium - should get interest
  await prisma.timeDeposit.create({
    data: {
      planType: 'premium',
      balance: 1000,
      days: 60, // > 45 → interest applies
    },
  })

  // 6. Premium - no interest
  await prisma.timeDeposit.create({
    data: {
      planType: 'premium',
      balance: 1000,
      days: 45, // ≤ 45 → no interest
    },
  })

  // 7. Deposit with withdrawals
  const depositWithWithdrawal = await prisma.timeDeposit.create({
    data: {
      planType: 'basic',
      balance: 500,
      days: 50,
    },
  })

  await prisma.withdrawal.create({
    data: {
      timeDepositId: depositWithWithdrawal.id,
      amount: 100,
      date: new Date('2024-01-15'),
    },
  })

  console.log('✅ Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })