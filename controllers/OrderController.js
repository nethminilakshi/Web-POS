import { item_db } from "../DB/database.js";
import { itemModel } from "../model/itemModel.js";

import { customer_db } from "../DB/database.js";
import { customerModel } from "../model/customerModel.js";

import { order_db } from "../DB/database.js";
import { orderModel } from "../model/orderModel.js";

import { order_details_db } from "../DB/database.js";
import { orderModel } from "../model/orderDetailModel.js";

let customerIdCB = $("#customer_id1");
let itemIdCB = $("#item_code1");
let orderId = $("#order_id");
let itemName = $("#item_name1");
let price = $("#price1");
let qtyOnHand = $("#qty_on_hand");
let qty = $("#getQty");
let customerName = $("#customer_name1");
let total = $("#total");
let discountInput = $("#discount");
let subTotalInput = $("#sub_total");
let cashInput = $("#Cash");
let balanceInput = $("#balance");

let add = $("#addBtn");
let resetItemDetails = $("#resetItemDetailsBtn");
let submitBtn = $("#submitBtn2");
let updateBtn = $("#updateBtn2");
let deleteBtn = $("#deleteBtn2");
let resetBtn = $("#resetBtn2");
let updateBtn2 = $("#UpdateBtn3");
let removeBtn = $("#removeBtn");

let items = [];

let searchBtn = $("#search");
let searchField = $("#searchField");

let search_order = true;
/*generate current date*/
function generateCurrentDate() {
  $("#order_date").val(getCurrentDate());
}

function getCurrentDate() {
  // Get the current date
  var currentDate = new Date();

  // Format the date as desired
  var formattedDate = currentDate.toLocaleDateString();

  // Display the date (you can modify this based on how you want to use it)
  console.log("Current Date: " + formattedDate);
  return formattedDate;
}

$("#order_page").on("click", function () {
  resetBtn.click();
  updateBtn.prop("disabled", true);
  deleteBtn.prop("disabled", true);
  removeBtn.prop("disabled", true);
  updateBtn2.prop("disabled", true);
});

/*Function to populate the CustomerId Combo Box*/
function populateCustomerIDs() {
  // Clear existing options except the default one
  customerIdCB.find("option:not(:first-child)").remove();

  // Iterate through the customerArray and add options to the select element
  for (let i = 0; i < customer_db.length; i++) {
    customerIdCB.append(
      $("<option>", {
        value: customer_db[i].customer_id,
        text: customer_db[i].customer_id,
      })
    );
  }
}

/*Function to populate the ItemId Combo Box*/
function populateItemIDs() {
  // Clear existing options except the default one
  itemIdCB.find("option:not(:first-child)").remove();

  // Iterate through the customerArray and add options to the select element
  for (let i = 0; i < item_db.length; i++) {
    itemIdCB.append(
      $("<option>", {
        value: item_db[i].itemCode,
        text: item_db[i].itemCode,
      })
    );
  }
}

function generateOrderId() {
  let highestOrderId = 0;

  for (let i = 0; i < order_db.length; i++) {
    // Extract the numeric part of the item code
    const numericPart = parseInt(order_db[i].order_id.split("-")[1]);

    // Check if the numeric part is greater than the current highest
    if (!isNaN(numericPart) && numericPart > highestOrderId) {
      highestOrderId = numericPart;
    }
  }
  // Increment the highest numeric part and format as "item-XXX"
  return `order-${String(highestOrderId + 1).padStart(3, "0")}`;
}

itemIdCB.on("change", function () {
  // Capture the selected value in a variable
  let selectedValue = $(this).val();

  let itemObj = $.grep(item_db, function (item) {
    return item.itemCode === selectedValue;
  });

  if (itemObj.length > 0) {
    // Access the first element in the filtered array
    itemName.val(itemObj[0].itemName); // Assuming there is an 'item_name' property
    price.val(itemObj[0].price);
    qtyOnHand.val(itemObj[0].qty);
  }

  // Check if the item is already in the items array
  let existingItem = items.find((item) => item.itemCode === selectedValue);

  if (existingItem) {
    updateBtn2.prop("disabled", false);
    removeBtn.prop("disabled", false);
    add.prop("disabled", true);
    qty.val(existingItem.qtyValue);
  }
});

customerIdCB.on("change", function () {
  // Capture the selected value in a variable
  let selectedValue = $(this).val();

  let customerObj = $.grep(customer_db, function (customer) {
    return customer.customer_id === selectedValue;
  });

  if (customerObj.length > 0) {
    // Access the first element in the filtered array
    customerName.val(customerObj[0].customer_name);
  }
});

/* Function to populate the table with items*/
function populateItemTable() {
  $("tbody").eq(2).empty();
  items.map((item) => {
    $("tbody")
      .eq(2)
      .append(
        `<tr>
                <th scope="row">${item.itemCode}</th>
                <td>${item.itemName}</td>
                <td>${item.priceValue}</td>
                <td>${item.qtyOnHand}</td>
                <td>${item.qtyValue}</td>
            </tr>`
      );
  });
}

/*Event handler for the "Add" button*/
add.on("click", function () {
  let itemCodeValue = itemIdCB.val();
  let qtyValue = parseInt(qty.val());

  if (qtyOnHand.val() >= qtyValue) {
    let itemNameValue = itemName.val();
    let priceValue = price.val();
    let qtyOnHandValue = qtyOnHand.val();

    /*Add a new item to the items array*/
    items.push({
      itemCode: itemCodeValue,
      itemName: itemNameValue,
      priceValue: priceValue,
      qtyOnHand: qtyOnHandValue,
      qtyValue: qtyValue,
    });

    /*Populate the Item table*/
    populateItemTable();

    /*Reset the item details*/
    resetItemDetails.click();
  } else {
    showValidationError("Invalid Input", "Out of stock");
  }

  total.val(calculateTotal());
});

updateBtn2.on("click", function () {
  let itemCodeValue = itemIdCB.val();
  let qtyValue = parseInt(qty.val());

  /*Check if the item is already in the items array*/
  let existingItem = items.find((item) => item.itemCode === itemCodeValue);

  if (existingItem) {
    if (qtyOnHand.val() >= qtyValue) {
      /*Update the quantity of the existing item*/
      existingItem.qtyValue = qtyValue;

      /*Populate the Item table*/
      populateItemTable();

      /*Reset the item details*/
      resetItemDetails.click();
    } else {
      showValidationError("Invalid Input", "Out of stock");
    }
  }

  total.val(calculateTotal());
});

function showValidationError(title, text) {
  Swal.fire({
    icon: "error",
    title: title,
    text: text,
    footer: '<a href="">Why do I have this issue?</a>',
  });
}

resetItemDetails.on("click", function () {
  itemIdCB.val("Select Item Code");
  qty.val("");
  itemName.val("");
  price.val("");
  qtyOnHand.val("");
  updateBtn2.prop("disabled", true);
  removeBtn.prop("disabled", true);
  add.prop("disabled", false);
});

function calculateTotal() {
  let total = 0;
  items.forEach((item) => {
    total += item.priceValue * item.qtyValue;
  });
  return total;
}

discountInput.on("input", function () {
  const discountValue = parseFloat(discountInput.val()) || 0; // Get the discount value as a float
  const totalValue = calculateTotal(); // Calculate the total based on your logic
  const subtotalValue = totalValue - totalValue * (discountValue / 100); // Calculate the subtotal

  // Update the sub-total input field
  subTotalInput.val(subtotalValue);
});

cashInput.on("input", function () {
  const cashValue = parseFloat(cashInput.val()) || 0; // Get the cash value as a float
  const totalValue = parseFloat(subTotalInput.val()) || 0; // Calculate the total based on your logic
  const balanceValue = cashValue - totalValue; // Calculate the balance

  // Update the balance input field
  balanceInput.val(balanceValue);
});

submitBtn.on("click", function (e) {
  e.preventDefault();

  // Get the data needed for the order
  const orderDate = $("#order_date").val();
  const orderId = $("#order_id").val();
  const customerId = $("#customer_id1").val();
  const total = $("#total").val();
  const discount = $("#discount").val();
  const cash = $("#Cash").val();

  // Validate order data
  if (!orderDate) {
    showValidationError("Null Input", "Please select an order date");
    return;
  }

  if (!orderId) {
    showValidationError("Null Input", "Please generate an order ID");
    return;
  }

  if (customerId === "Select Customer Id") {
    showValidationError("Invalid Input", "Please select a customer");
    return;
  }

  if (!total || parseFloat(total) <= 0) {
    showValidationError("Invalid Input", "Total must be a positive number");
    return;
  }

  if (!cash || parseFloat(cash) < 0) {
    showValidationError(
      "Invalid Input",
      "Cash amount must be a positive number"
    );
    return;
  }

  const discountValue = parseFloat(discount);
  if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
    showValidationError(
      "Invalid Input",
      "Discount must be a number between 0 and 100"
    );
    return;
  }

  // Create an order instance
  const order = new OrderModel(
    orderDate,
    orderId,
    customerId,
    total,
    discount,
    cash
  );

  // Add the order to the order_db array
  order_db.push(order);

  // Loop through the items in your order details
  items.forEach((item) => {
    const orderDetail = new orderModel(
      orderId,
      item.itemCode,
      item.priceValue,
      item.qtyValue
    );
    order_details_db.push(orderDetail);

    item_db.forEach((itemObj) => {
      if (itemObj.itemCode === item.itemCode) {
        itemObj.qty -= item.qtyValue;
      }
    });
  });

  // Display a success message
  Swal.fire(
    "Order Placed Successfully!",
    "The order has been saved.",
    "success"
  );

  resetBtn.click();
});

resetBtn.on("click", function () {
  // Reset the form fields to their initial state
  generateCurrentDate();
  populateCustomerIDs();
  populateItemIDs();
  orderId.val(generateOrderId());
  $("#total").val(""); // Reset the total
  $("#discount").val(""); // Reset the discount
  $("#Cash").val(""); // Reset the cash input
  customerName.val("");
  itemName.val("");
  price.val("");
  qtyOnHand.val("");
  total.val("");
  discountInput.val("");
  cashInput.val("");
  subTotalInput.val("");
  balanceInput.val("");

  /*Clear the items array*/
  items = [];

  /*Clear the item order table*/
  $("#item-order-table tbody").empty();

  updateBtn.prop("disabled", true);
  deleteBtn.prop("disabled", true);
  submitBtn.prop("disabled", false);
});

deleteBtn.on("click", function () {
  /*Assuming you have an orderId that you want to delete*/
  const orderIdToDelete = orderId.val();

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
      /* Find and remove the order with the matching orderId from the order_db array*/
      const indexToDelete = order_db.findIndex(
        (order) => order.order_id === orderIdToDelete
      );
      if (indexToDelete !== -1) {
        order_db.splice(indexToDelete, 1);
      }

      /*Remove the corresponding order details from order_details_db (if needed)*/
      for (let i = 0; i < order_details_db.length; i++) {
        if (order_details_db[i].order_id === orderIdToDelete) {
          order_details_db.splice(i, 1);
        }
      }

      items.forEach((item) => {
        item_db.forEach((itemObj) => {
          if (itemObj.itemCode === item.itemCode) {
            itemObj.qty += item.qtyValue;
          }
        });
      });

      resetBtn.click();

      Swal.fire("Deleted!", "Your file has been deleted.", "success");
    }
  });
});

removeBtn.on("click", function () {
  let index = items.findIndex((item) => item.itemCode === itemIdCB.val());
  items.splice(index, 1);
  populateItemTable();
  resetItemDetails.click();
  total.val(calculateTotal());
});

$("#item-order-table").on("click", "tbody tr", function () {
  let itemCodeValue = $(this).find("th").text();
  let itemNameValue = $(this).find("td:eq(0)").text();
  let priceValue = $(this).find("td:eq(1)").text();
  let qtyOnHandValue = $(this).find("td:eq(2)").text();
  let qtyValue = $(this).find("td:eq(3)").text();

  itemIdCB.val(itemCodeValue);
  itemName.val(itemNameValue);
  price.val(priceValue);
  qtyOnHand.val(qtyOnHandValue);
  qty.val(qtyValue);

  updateBtn2.prop("disabled", false);
  removeBtn.prop("disabled", false);
  add.prop("disabled", true);
});

/*Modify the event handler for clicking on a row in the order details table*/
function populateFields(orderIdValue) {
  /*Find the corresponding order in the order_db array*/
  let order = order_db.find((order) => order.order_id === orderIdValue);

  /*Check if the order is found*/
  if (order) {
    /*Populate the order details on the order page*/
    orderId.val(order.order_id);
    $("#order_date").val(order.order_date);
    customerIdCB.val(order.customer_id);
    total.val(order.total);
    discountInput.val(order.discount);

    /*Calculate the subtotal and update the input*/
    const discountValue = parseFloat(discountInput.val()) || 0;
    const totalValue = parseFloat(total.val()) || 0;

    const subtotalValue = totalValue - totalValue * (discountValue / 100);
    subTotalInput.val(subtotalValue.toFixed(2)); // Use toFixed to round to two decimal places

    cashInput.val(order.cash);

    /*Calculate the balance and update the input*/
    const cashValue = parseFloat(cashInput.val()) || 0;
    const balanceValue = cashValue - subtotalValue;
    balanceInput.val(balanceValue.toFixed(2)); // Use toFixed to round to two decimal places

    /*Populate the customer name based on the selected customer ID*/
    let customerObj = $.grep(customer_db, function (customer) {
      return customer.customer_id === order.customer_id;
    });

    if (customerObj.length > 0) {
      /*Access the first element in the filtered array*/
      customerName.val(customerObj[0].name);
    }

    /*Populate the items table on the order page*/
    items = order_details_db
      .filter((orderDetail) => orderDetail.order_id === orderIdValue)
      .map((orderDetail) => {
        /*Find the corresponding item in the item_db array*/
        let item = item_db.find(
          (item) => item && item.itemCode === orderDetail.item_id
        );

        if (item) {
          return {
            itemCode: item.itemCode,
            itemName: item.itemName,
            priceValue: item.price,
            qtyOnHand: item.qty,
            qtyValue: orderDetail.qty,
          };
        } else {
          /*Handle the case where the item is not found*/
          console.error(
            `Item not found for item code: ${orderDetail.item_code}`
          );
          return null; /*or handle it accordingly*/
        }
      });

    /*Filter out items that are null (not found)*/
    items = items.filter((item) => item !== null);

    populateItemTable();

    updateBtn.prop("disabled", false);
    deleteBtn.prop("disabled", false);
    submitBtn.prop("disabled", true);
  } else {
    /*Show an error message if the order is not found*/
    showValidationError(
      "Order Not Found",
      "The selected order details could not be found."
    );
  }
}
