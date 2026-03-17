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

describe('TimeDepositCalculator - parameterized', () => {

  test.each([
    ['basic', 1200, 45, 1201],
    ['student', 1200, 100, 1203],
    ['premium', 1200, 50, 1205]
  ])(
    'should update %s plan correctly',
    (planType, balance, days, expected) => {

      const calc = new TimeDepositCalculator()

      const plans = [new TimeDeposit(1, planType, balance, days)]

      calc.updateBalance(plans)

      expect(plans[0].balance).toBe(expected)
    }
  )

})