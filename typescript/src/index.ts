import { registerRoutes } from './api/server'
import { GetTimeDepositsUseCase } from './application/GetTimeDepositsUseCase'
import { UpdateTimeDepositsUseCase } from './application/UpdateTimeDepositsUseCase'
import { TimeDepositCalculator } from './domain/TimeDepositCalculator'
import { PrismaTimeDepositRepository } from './infrastructure/PrismaTimeDepositRepository'

function createApp() {
    // dependencies
    const timeDepositRepository = new PrismaTimeDepositRepository()
    const calculator = new TimeDepositCalculator()
    // use cases
    const getTimeDepositsUseCase = new GetTimeDepositsUseCase(timeDepositRepository)
    const updateTimeDepositsUseCase = new UpdateTimeDepositsUseCase(
        timeDepositRepository,
        calculator
    )
    return registerRoutes(getTimeDepositsUseCase, updateTimeDepositsUseCase)
}
// server
const app = createApp()

const PORT = Number(process.env.PORT) || 3000
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
