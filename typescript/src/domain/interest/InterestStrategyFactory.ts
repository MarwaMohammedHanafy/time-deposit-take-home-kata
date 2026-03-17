import { InterestStrategy } from './InterestStrategy'
import { BasicInterestStrategy } from './BasicInterestStrategy'
import { StudentInterestStrategy } from './StudentInterestStrategy'
import { PremiumInterestStrategy } from './PremiumInterestStrategy'

export class InterestStrategyFactory {

  static create(planType: string): InterestStrategy {

    switch (planType) {
      case 'basic':
        return new BasicInterestStrategy()

      case 'student':
        return new StudentInterestStrategy()

      case 'premium':
        return new PremiumInterestStrategy()

      default:
        throw new Error('Unknown plan type')
    }
  }

}