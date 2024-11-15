import { cus_arr, items, orders, cart, orderDetails } from "../DB/database.js";
import OrderModel from "../model/orderModel.js";
import OrderDetailModel from "../model/orderDetailModel.js";

export function loadCustomers() {
  $("#customers").empty();
  $("#customers").append('<option value="">Select a customer</option>');
  cus_arr.forEach((item) => {
    let option = `<option value="${item._customerId}">${item._customerId}</option>`;
    $("#customers").append(option);
  });
}

export function loadItems() {
  $("#itemS").empty();
  $("#itemS").append('<option value="">Select an item</option>');
  items.forEach((item) => {
    let option = `<option value="${item._item_code}">${item._item_code}</option>`;
    $("#itemS").append(option);
  });
}

$(document).ready(function () {
  $("#orderId").val(generateOrderId());
  loadCustomers();
  loadItems();
});

let generateOrderId = function generateOrderId() {
  let id = order_arr.length + 1;
  return "O0" + id;
};

$("#itemSea").on("change", function () {
  let id = $(this).val();
  let item = item_arr.find((item) => item._item_code === id);
  if (item) {
    $("#itemName").val(item._description);
    $("#itemPrice").val(item._unitPrice);
    $("#itemQtyOnHand").val(item._qty);
  } else {
    $("#itemName").val("");
    $("#itemPrice").val("");
    $("#itemQtyOnHand").val("");
  }
});

$("#customers").on("change", function () {
  let selectedId = $(this).val();
  let customer = cus_arr.find((item) => item._customerId === selectedId);
  if (customer) {
    $("#customerName").val(customer._customerName);
  } else {
    $("#customerName").val("");
  }
});

const loadCartTable = () => {
  $("#orderTableBody").empty(); // Clear previous entries
  cart_arr.forEach((item) => {
    let data = `<tr>
                        <td>${item.item_code}</td>
                        <td>${item.description}</td>
                        <td>${item.unit_price}</td>
                        <td>${item.qty}</td>
                        <td>${item.total}</td>
                    </tr>`;
    $("#orderTableBody").append(data);
  });
};

$("#orSaveBtn").on("click", function () {
  let item_code = $("#itemSea").val();
  let description = $("#itemName").val();
  let unit_price = parseFloat($("#itemPrice").val());
  let qtyOnHand = parseInt($("#itemQtyOnHand").val());
  let qty = parseInt($("#itemQty").val());

  if (qty > qtyOnHand) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Not enough quantity!",
    });
    return;
  }

  if (
    !item_code ||
    !description ||
    isNaN(unit_price) ||
    isNaN(qty) ||
    qty <= 0
  ) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Empty or invalid fields!",
    });
    return;
  }

  let total = unit_price * qty;

  let cart_item = {
    item_code,
    description,
    unit_price,
    qty,
    total,
  };

  cart_arr.push(cart_item);
  loadCartTable();
  updateItemArray();
  clearItemInputs();
});

function updateItemArray() {
  let item_code = $("#itemSea").val();
  let item = item_arr.find((item) => item._item_code === item_code);
  let qty = parseInt($("#itemQty").val());

  if (item) {
    item._qty -= qty; // Update the quantity
  } else {
    console.error("Item not found in itemArray");
  }
}

$("#order_btn").on("click", function () {
  let order_id = generateOrderId();
  let date = $("#date").val();
  let customerId = $("#customers").val();
  let total = cart_arr.reduce((sum, item) => sum + item.total, 0);

  if (cart.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No items in the cart!",
    });
    return;
  }

  let order = new OrderModel(order_id, customerId, date, total);
  order_arr.push(order);

  cart.forEach((item) => {
    let orderDetail = new OrderDetailModel(
      order_id,
      item.item_code,
      item.qty,
      item.unit_price
    );
    orderDetail_arr.push(orderDetail);
  });

  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Order placed successfully",
    showConfirmButton: false,
    timer: 1500,
  });

  clearOrderForm();
});

function clearOrderForm() {
  $("#itemSea").val("");
  $("#itemPrice").val("");
  $("#itemName").val("");
  $("#itemQty").val("");
  $("#itemQtyOnHand").val("");
  $("#orderId").val(generateOrderId());
  $("#date").val("");
  $("#customers").val("");
  $("#customerName").val("");
  $("#orderTableBody").empty(); // Clear the table
  cart_arr.length = 0; // Clear the cart array
}

function clearItemInputs() {
  $("#itemSea").val("");
  $("#itemPrice").val("");
  $("#itemName").val("");
  $("#itemQty").val("");
  $("#customers").val("");
  $("#customerName").val("");
}
