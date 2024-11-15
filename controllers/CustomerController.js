import CustomerModel from "../model/customerModel.js";
import { cus_arr, customers } from "../DB/database.js";
import { loadCustomers } from "./controllers/ordersController.js";

const validSalary = (salary) => {
  const salaryRegex = /^(?:\+94|0)?7[0-9]{8}$/;
  return salaryRegex.test(salary);
};

const validMobile = (mobile) => {
  const sriLankanMobileRegex = /^(?:\+94|0)?7[0-9]{8}$/;
  return sriLankanMobileRegex.test(mobile);
};
let generateCustomerId = function generateCustomerId() {
  let id = cus_arr.length + 1;
  return "C0" + id;
};

let setCustomerId = () => {
  $("#customerId").val(generateCustomerId());
};
const loadCustomerTable = () => {
  $("#customerTableBody").empty();
  cus_arr.map((item, index) => {
    console.log(item);

    let data = `<tr><td>${item.customerId}</td><td>${item.customerName}</td><td>${item.address}</td><td>${item.salary}</td><td>${item.mobile}</td></tr>`;
    $("#customerTableBody").append(data);
  });
};

const cleanCustomerForm = () => {
  $("#customerId").val("");
  $("#customerName").val("");
  $("#salary").val("");
  $("#mobile").val("");
  $("#address").val("");
};

$("#cusbtn").on("click", function () {
  let customerId = generateCustomerId();
  let customerName = $("#customerName").val();
  let address = $("#address").val();
  let salary = $("#salary").val();
  let contact = $("#mobile").val();

  if (customerName.length === 0) {
    Swal.fire("Invalid customer name!");
  } else if (address.length === 0) {
    Swal.fire("Invalid customer address!");
  } else if (!validSalary(salary)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Input",
      text: "Invalid Amount",
    });
  } else if (!validMobile(contact)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Input",
      text: "Invalid Contact Number",
    });
  } else {
    let customer = new CustomerModel(
      customerId,
      customerName,
      address,
      salary,
      contact
    );

    if (cus_arr.push(customer)) {
      const Toast = Swal.mixin({
        toast: true,
        position: "center",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Customer save successfully",
      });
      loadCustomerTable();
      loadCustomers();
      cleanCustomerForm();
      setCustomerId();
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Customer not been saved!!",
      });
    }
  }
});

let customer_update_index;
let customer_delete_index;

$("#customerTableBody").on("click", "tr", function () {
  let value = $(this).text();
  let index = $(this).index();
  console.log(index);
  let customer_obj = cus_arr[index];
  console.log(customer_obj);

  //update customer
  customer_update_index = index;

  //delete customer
  customer_delete_index = index;
  let customerId = customer_obj.customer_id;
  let customerName = customer_obj.name;
  let address = customer_obj.address;
  let salary = customer_obj.salary;
  let mobile = customer_obj.mobile;

  $("#customerId").val(customerId);
  $("#customerName").val(customerName);
  $("#address").val(address);
  $("#salary").val(email);
  $("#mobile").val(mobile);
});

$("#cus_update_btn").on("click", function () {
  let index = customer_update_index;

  let customerId = $("#customerId").val();
  let customerName = $("#customerName").val();
  let address = $("#address").val();
  let salary = $("#salary").val();
  let mobile = $("#mobile").val();

  let customer = new CustomerModel(
    cus_arr[index].customerId,
    customerName,
    address,
    salary,
    mobile
  );
  cus_arr[customer_update_index] = customer;
  loadCustomerTable();
  cleanCustomerForm();
  setCustomerId();
});

$("#cus_delete_btn").on("click", function () {
  let index = customer_delete_index;

  cus_arr.splice(customer_delete_index);

  cleanCustomerForm();
  loadCustomerTable();
  setCustomerId();
});
$("#cus_clean_btn").on("click", function () {
  cleanCustomerForm();
});
