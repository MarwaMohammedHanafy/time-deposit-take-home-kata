export class Withdrawal {
  public id: number
  public timeDepositId: number
  public amount: number
  public date: Date

  constructor(
    id: number,
    timeDepositId: number,
    amount: number,
    date: Date
  ) {
    this.id = id
    this.timeDepositId = timeDepositId
    this.amount = amount
    this.date = date
  }
}