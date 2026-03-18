import express from 'express'
import { GetTimeDepositsUseCase } from '../application/GetTimeDepositsUseCase'
import { UpdateTimeDepositsUseCase } from '../application/UpdateTimeDepositsUseCase'

const app = express()

app.use(express.json())

export function registerRoutes(
  getUseCase: GetTimeDepositsUseCase,
  updateUseCase: UpdateTimeDepositsUseCase
) {

  app.get('/time-deposits', async (_req, res) => {
    const deposits = await getUseCase.execute()
    res.json(deposits)
  })

  app.post('/time-deposits/update-balances', async (_req, res) => {
    await updateUseCase.execute()
    res.status(204).send()
  })

  return app
}