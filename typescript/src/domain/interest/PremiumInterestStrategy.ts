import { InterestStrategy } from './InterestStrategy'
import { TimeDeposit } from '../TimeDeposit'

export class PremiumInterestStrategy implements InterestStrategy {

  calculate(deposit: TimeDeposit): number {

    if (deposit.days <= 45) return 0

    return (deposit.balance * 0.05) / 12
  }

}