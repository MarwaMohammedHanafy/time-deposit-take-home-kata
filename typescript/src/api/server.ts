import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { GetTimeDepositsUseCase } from '../application/GetTimeDepositsUseCase'
import { UpdateTimeDepositsUseCase } from '../application/UpdateTimeDepositsUseCase'
import { openApiSpec } from './openapi'

const app = express()

app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec))

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