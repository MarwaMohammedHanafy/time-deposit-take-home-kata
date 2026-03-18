import { TimeDeposit } from '../domain/TimeDeposit'
import { TimeDepositRepository } from '../domain/TimeDepositRepository'

export class GetTimeDepositsUseCase {
  constructor(private readonly repository: TimeDepositRepository) {}

  async execute(): Promise<TimeDeposit[]> {
    return this.repository.findAll()
  }
}
