import { InterestStrategy } from './InterestStrategy'
import { TimeDeposit } from '../TimeDeposit'

export class BasicInterestStrategy implements InterestStrategy {

  calculate(deposit: TimeDeposit): number {

    if (deposit.days <= 30) {
      return 0
    }

    return (deposit.balance * 0.01) / 12
  }

}