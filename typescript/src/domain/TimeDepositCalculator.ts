import { TimeDeposit } from './TimeDeposit'
import { InterestStrategyFactory } from './interest/InterestStrategyFactory'

export class TimeDepositCalculator {

  public updateBalance(xs: TimeDeposit[]) {
    for (const deposit of xs) {

      const strategy = InterestStrategyFactory.create(deposit.planType)

      const interest = strategy.calculate(deposit)

      const rounded = Math.round((interest + Number.EPSILON) * 100) / 100

      deposit.balance += rounded
    }

  }

}