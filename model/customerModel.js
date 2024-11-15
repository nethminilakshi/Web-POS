// import { customers } from "./DB/database";

// export default class CustomerModel {
//   constructor(customerId, customerName, address, salary, mobile) {
//     this.customerId = customerId;
//     this.customerName = customerName;
//     this.address = address;
//     this.salary = salary;
//     this.mobile = mobile;
//   }

//   // ... existing getters and setters ...

//   // Static method to get all customers
//   static getAll() {
//     return customers.map(
//       (c) =>
//         new CustomerModel(
//           c.customerId,
//           c.customerName,
//           c.address,
//           c.salary,
//           c.mobile
//         )
//     );
//   }

//   // Static method to find a customer by ID
//   static findById(customerId) {
//     const customer = customers.find((c) => c.customerId === customerId);
//     return customer
//       ? new CustomerModel(
//           customer.customerId,
//           customer.customerName,
//           customer.address,
//           customer.salary,
//           customer.mobile
//         )
//       : null;
//   }

//   // Method to save the customer (create or update)
//   save() {
//     const index = customers.findIndex((c) => c.customerId === this.customerId);
//     if (index !== -1) {
//       // Update existing customer
//       customers[index] = { ...this };
//     } else {
//       // Create new customer
//       customers.push({ ...this });
//     }
//     return this;
//   }

//   // Static method to delete a customer
//   static delete(id) {
//     const initialLength = customers.length;
//     customers = customers.filter((c) => c.customerId !== id);
//     return customers.length < initialLength;
//   }

//   // Static method to generate a new customer ID
//   static generateId() {
//     if (customers.length > 0) {
//       const lastId = customers[customers.length - 1].customerId;
//       const numericPart = parseInt(lastId.substring(1)) + 1;
//       return "C" + String(numericPart).padStart(3, "0");
//     }
//     return "C001";
//   }
// }

// // Assuming 'customers' is a global array defined elsewhere (e.g., in db.js)
// if (typeof customers === "undefined") {
//   customers = [];
// }
export default class CustomerModel {
  constructor(customerId, customerName, address, salary, mobile) {
    this._customerId = customerId;
    this._customerName = customerName;
    this._address = address;
    this.salary = salary;
    this._mobile = mobile;
  }

  get customerId() {
    return this._customerId;
  }

  set customerId(value) {
    this._customerId = value;
  }

  get customerName() {
    return this._customerName;
  }

  set customerName(value) {
    this._customerName = value;
  }

  get address() {
    return this._address;
  }

  set address(value) {
    this._address = value;
  }

  get salary() {
    return this._salary;
  }

  set salary(value) {
    this._salary = value;
  }

  get mobile() {
    return this._mobile;
  }

  set mobile(value) {
    this._mobile = value;
  }
}
