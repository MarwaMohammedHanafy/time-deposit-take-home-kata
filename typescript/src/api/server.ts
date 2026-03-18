import express from 'express'
import { GetTimeDepositsUseCase } from '../application/GetTimeDepositsUseCase'
import { PrismaTimeDepositRepository } from '../infrastructure/PrismaTimeDepositRepository'

const app = express()

app.use(express.json())

const repository = new PrismaTimeDepositRepository()
const getTimeDepositsUseCase = new GetTimeDepositsUseCase(repository)

app.get('/time-deposits', async (_req, res) => {
  const deposits = await getTimeDepositsUseCase.execute()
  res.json(deposits)
})

export { app }
