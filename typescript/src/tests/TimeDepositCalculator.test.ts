import { TimeDeposit } from '../TimeDeposit'
import { TimeDepositCalculator } from '../TimeDepositCalculator'

describe('TimeDepositCalculator.updateBalance (characterization)', () => {

  test('basic plan adds interest after 30 days', () => {
    const calc = new TimeDepositCalculator()

    const plans = [new TimeDeposit(1, 'basic', 1000, 45)]

    calc.updateBalance(plans)

    expect(plans[0].balance).toBe(1000.83)
  })

})