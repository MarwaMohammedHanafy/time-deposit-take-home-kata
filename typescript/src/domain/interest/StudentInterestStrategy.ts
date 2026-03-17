import { InterestStrategy } from './InterestStrategy'
import { TimeDeposit } from '../TimeDeposit'

export class StudentInterestStrategy implements InterestStrategy {

  calculate(deposit: TimeDeposit): number {

    if (deposit.days <= 30) return 0

    if (deposit.days >= 366) return 0

    return (deposit.balance * 0.03) / 12
  }

}