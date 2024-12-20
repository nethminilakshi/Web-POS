import { customer_db } from "../db/db.js";
import { CustomerModel } from "../model/customerModel.js";

let customerId = $("#customerId");
let customerName = $("#customerName");
let customerAddress = $("#address");
let mobile = $("#mobile");

let submit = $("#customer_btn>button").eq(0);
let update = $("#customer_btn>button").eq(1);
let delete_btn = $("#customer_btn>button").eq(2);
let reset = $("#customer_btn>button").eq(3);

let searchBtn = $("#search2");
let searchField = $("#searchField2");

const mobilePattern = new RegExp(
  "^(?:0|94|\\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\\d)\\d{6}$"
);

searchField.on("input", function () {
  let search_term = searchField.val();

  let results = customer_db.filter(
    (item) =>
      item.customer_id.toLowerCase().startsWith(search_term.toLowerCase()) ||
      item.customer_name.toLowerCase().startsWith(search_term.toLowerCase()) ||
      item.customer_address
        .toLowerCase()
        .startsWith(search_term.toLowerCase()) ||
      item.mobile.toLowerCase().startsWith(search_term.toLowerCase())
  );

  $("#customer-tbl-body").eq(0).empty();
  results.map((item, index) => {
    let tbl_row = `<tr>
            <th scope="row">${item.customer_id}</th>
            <td>${item.customer_name}</td>
            <td>${item.customer_address}</td>
            <td>${item.mobile}</td>
        </tr>`;
    $("#customer-tbl-body").eq(0).append(tbl_row);
  });
});

// --------------- clear inputs
const cleanInputs = () => {
  $("#customerId").val(generateCustomerId());
  $("#customerName").val("");
  $("#address").val("");
  $("#mobile").val("");
};

function generateCustomerId() {
  let highestCustId = 0;

  for (let i = 0; i < customer_db.length; i++) {
    // Extract the numeric part of the item code
    const numericPart = parseInt(customer_db[i].customer_id.split("-")[1]);

    // Check if the numeric part is greater than the current highest
    if (!isNaN(numericPart) && numericPart > highestCustId) {
      highestCustId = numericPart;
    }
  }

  // Increment the highest numeric part and format as "item-XXX"
  return `C-${String(highestCustId + 1).padStart(3, "0")}`;
}

submit.on("click", () => {
  let idValue = customerId.val();
  let nameValue = customerName.val();
  let addressValue = customerAddress.val();
  let mobileValue = mobile.val();

  if (
    validation(nameValue, "customer name", null) &&
    validation(addressValue, "Address", null) &&
    validation(mobileValue, "Contact", mobilePattern.test(mobileValue))
  ) {
    let customerDetails = new CustomerModel(
      idValue,
      nameValue,
      addressValue,
      mobileValue
    );
    Swal.fire("Save Successfully !", "Successful", "success");

    customer_db.push(customerDetails);

    populateCustomerTbl();

    cleanInputs();
  }
});

// ----------- Pass the  value customer Table
function populateCustomerTbl() {
  $("#customer-tbl-body").eq(0).empty();
  customer_db.map((customer) => {
    $("#customer-tbl-body")
      .eq(0)
      .append(
        `<tr>
                <th scope="row">${customer.customer_id}</th>
                <td>${customer.customer_name}</td>
                <td>${customer.customer_address}</td>
                <td>${customer.mobile}</td>
            </tr>`
      );
  });
}

function showValidationError(title, text) {
  Swal.fire({
    icon: "error",
    title: title,
    text: text,
    footer: '<a href="">Why do I have this issue?</a>',
  });
}

function validation(value, message, test) {
  if (!value) {
    showValidationError("Null Input", "Input " + message);
    return false;
  }
  if (test === null) {
    return true;
  }
  if (!test) {
    showValidationError("Invalid Input", "Invalid Input " + message);
    return false;
  }
  return true;
}
$("#customer_page").on("click", function () {
  customerId.val(generateCustomerId());
  populateCustomerTbl();
});

$("#customerTable").on("click", "tbody tr", function () {
  let customerIdValue = $(this).find("th").text();
  let nameValue = $(this).find("td:eq(0)").text();
  let addressValue = $(this).find("td:eq(1)").text();
  let contactValue = $(this).find("td:eq(2)").text();

  customerId.val(customerIdValue);
  customerName.val(nameValue);
  customerAddress.val(addressValue);
  mobile.val(contactValue);
});

update.on("click", function () {
  let idValue = customerId.val();
  let nameValue = customerName.val();
  let addressValue = customerAddress.val();
  let mobileValue = mobile.val();

  if (
    validation(nameValue, "customer name", null) &&
    validation(addressValue, "Address", null) &&
    validation(mobileValue, "Contact", mobilePattern.test(mobileValue))
  ) {
    customer_db.map((customer) => {
      if (String(customer.customer_id) === idValue) {
        customer.customer_name = nameValue;
        customer.customer_address = addressValue;
        customer.mobile = mobileValue;
      }
    });

    Swal.fire("Update Successfully !", "Successful", "success");

    populateCustomerTbl();
    cleanInputs();

    submit.prop("disabled", false);
  }
});

delete_btn.on("click", function () {
  let idValue = customerId.val();

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Delete",
  }).then((result) => {
    if (result.isConfirmed) {
      let index = customer_db.findIndex(
        (customer) => customer.customer_id === idValue
      );
      customer_db.splice(index, 1);
      populateCustomerTbl();
      cleanInputs();
      Swal.fire("Deleted!", "Your file has been deleted.", "success");
      submit.prop("disabled", false);
    }
  });
});

reset.on("click", function (e) {
  e.preventDefault();
  customerId.val(generateCustomerId());
  customerName.val("");
  customerAddress.val("");
  mobile.val("");
  submit.prop("disabled", false);
  delete_btn.prop("disabled", true);
  update.prop("disabled", true);
});
