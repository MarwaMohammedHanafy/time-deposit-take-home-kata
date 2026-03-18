import { TimeDepositCalculator } from '../domain/TimeDepositCalculator'
import { TimeDepositRepository } from '../domain/TimeDepositRepository'

export class UpdateTimeDepositsUseCase {
  constructor(
    private readonly repository: TimeDepositRepository,
    private readonly calculator: TimeDepositCalculator
  ) {}

  async execute(): Promise<void> {
    const deposits = await this.repository.findAll()
    this.calculator.updateBalance(deposits)
    await this.repository.saveAll(deposits)
  }
}
