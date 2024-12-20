export class OrderModel {
  constructor(order_date, order_id, customer_id, total, discount, cash) {
    this.order_date = order_date;
    this.order_id = order_id;
    this.customer_id = customer_id;
    this.total = total;
    this.discount = discount;
    this.cash = cash;
  }
}
