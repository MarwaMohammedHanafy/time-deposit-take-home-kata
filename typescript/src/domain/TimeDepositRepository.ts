import { TimeDeposit } from './TimeDeposit'

export interface TimeDepositRepository {

  findAll(): Promise<TimeDeposit[]>

  saveAll(deposits: TimeDeposit[]): Promise<void>

}