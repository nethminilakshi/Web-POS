export default class ItemModel {
  constructor(itemCode, name, unitPrice, qty, description) {
    this._itemCode = itemCode;
    this._name = name;
    this._unitPrice = unitPrice;
    this._qty = qty;
    this._description = description;
  }

  get itemCode() {
    return this._itemCode;
  }

  set itemCode(value) {
    this._itemCode = value;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get unitPrice() {
    return this._unitPrice;
  }

  set unitPrice(value) {
    this._unitPrice = value;
  }

  get qty() {
    return this._qty;
  }

  set qty(value) {
    this._qty = value;
  }

  get description() {
    return this._description;
  }

  set description(value) {
    this._description = value;
  }
}
