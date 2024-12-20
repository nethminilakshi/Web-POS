import { customer_db, item_db } from "../db/db.js";
import { ItemModel } from "../model/ItemModel.js";

let itemId = $("#itemId");
let itemName = $("#itemName");
let price = $("#price");
let qty = $("#qty");

let submit = $("#item_btn>button").eq(0);
let update = $("#item_btn>button").eq(1);
let delete_btn = $("#item_btn>button").eq(2);
let reset = $("#item_btn>button").eq(3);

let searchBtn = $("#search3");
let searchField = $("#searchField3");

searchField.on("input", function () {
  let search_term = searchField.val();

  let results = item_db.filter(
    (item) =>
      item.itemCode.toLowerCase().startsWith(search_term.toLowerCase()) ||
      item.itemName.toLowerCase().startsWith(search_term.toLowerCase())
  );

  $("#item-tbl-body").eq(0).empty();
  results.map((item, index) => {
    let tbl_row = `<tr>
            <th scope="row">${item.itemCode}</th>
            <td>${item.itemName}</td>
            <td>${item.price}</td>
            <td>${item.qty}</td>
        </tr>`;
    $("#item-tbl-body").eq(0).append(tbl_row);
  });
});

function generateItemCode() {
  let highestItemCode = 0;

  for (let i = 0; i < item_db.length; i++) {
    // Extract the numeric part of the item code
    const numericPart = parseInt(item_db[i].itemCode.split("-")[1]);

    // Check if the numeric part is greater than the current highest
    if (!isNaN(numericPart) && numericPart > highestItemCode) {
      highestItemCode = numericPart;
    }
  }

  // Increment the highest numeric part and format as "item-XXX"
  return `I-${String(highestItemCode + 1).padStart(3, "0")}`;
}

function resetColumns() {
  reset.click();
  itemId.val(generateItemCode());
  submit.prop("disabled", false);
  delete_btn.prop("disabled", true);
  update.prop("disabled", true);
}

$("#item_page")
  .eq(0)
  .on("click", function () {
    itemId.val(generateItemCode());
    populateItemTBL();
  });

function populateItemTBL() {
  $("#item-tbl-body").eq(0).empty();
  item_db.map((item) => {
    $("#item-tbl-body")
      .eq(0)
      .append(
        `<tr>
                <th scope="row">${item.itemCode}</th>
                <td>${item.itemName}</td>
                <td>${item.price}</td>
                <td>${item.qty}</td>
            </tr>`
      );
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

/*Show Validation Error*/
function showValidationError(title, text) {
  Swal.fire({
    icon: "error",
    title: title,
    text: text,
    footer: '<a href="">Why do I have this issue?</a>',
  });
}

submit.on("click", function () {
  let itemCodeValue = itemId.val();
  let itemNameValue = itemName.val().trim();
  let priceValue = parseFloat(price.val());
  let qtyOnHandValue = parseInt(qty.val(), 10);

  if (
    validation(itemNameValue, "item name", null) &&
    validation(priceValue, "Price", null) &&
    validation(qtyOnHandValue, "Qty On Hand", null)
  ) {
    let item = new ItemModel(
      itemCodeValue,
      itemNameValue,
      priceValue,
      qtyOnHandValue
    );

    Swal.fire("Save Successfully !", "Successful", "success");

    item_db.push(item);
    populateItemTBL();
    resetColumns();
  }
});

$("#itemTable").on("click", "tbody tr", function () {
  let itemCodeValue = $(this).find("th").text();
  console.log(itemCodeValue);
  let itemNameValue = $(this).find("td:eq(0)").text();
  let priceValue = $(this).find("td:eq(1)").text();
  let qtyValue = $(this).find("td:eq(2)").text();

  itemId.val(itemCodeValue);
  itemName.val(itemNameValue);
  price.val(priceValue);
  qty.val(qtyValue);

  submit.prop("disabled", true);
  delete_btn.prop("disabled", false);
  update.prop("disabled", false);
});

update.on("click", function () {
  let itemCodeValue = itemId.val();
  let itemNameValue = itemName.val().trim();
  let priceValue = parseFloat(price.val());
  let qtyOnHandValue = parseInt(qty.val(), 10);

  if (
    validation(itemNameValue, "item name", null) &&
    validation(priceValue, "Price", null) &&
    validation(qtyOnHandValue, "Qty On Hand", null)
  ) {
    item_db.map((item) => {
      if (item.itemCode === itemCodeValue) {
        item.itemName = itemNameValue;
        item.price = priceValue;
        item.qty = qtyOnHandValue;
      }
    });

    Swal.fire("Update Successfully !", "Successful", "success");

    populateItemTBL();
    resetColumns();
  }
});

reset.on("click", function (e) {
  e.preventDefault();
  itemId.val(generateItemCode());
  itemName.val("");
  price.val("");
  qty.val("");
  submit.prop("disabled", false);
  delete_btn.prop("disabled", true);
  update.prop("disabled", true);
});

delete_btn.on("click", function () {
  let itemCodeValue = itemId.val();

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
      let index = item_db.findIndex((item) => item.itemCode === itemCodeValue);
      item_db.splice(index, 1);
      populateItemTBL();
      resetColumns();
      Swal.fire("Deleted!", "Your file has been deleted.", "success");
      submit.prop("disabled", false);
    }
  });
});
