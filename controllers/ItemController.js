import { customer_db, item_db } from "../DB/database.js";
import { itemModel } from "../model/itemModel.js";

let itemCode = $("#itemCode");
let itemName = $("#itemName");
let unitPrice = $("#unitPrice");
let qty = $("#qty");
let description = $("#description");

let submit = $("#item_btn>button").eq(0);
let update = $("#item_btn>button").eq(1);
let delete_btn = $("#item_btn>button").eq(2);
let reset = $("#item_btn>button").eq(3);

function generateItemCode() {
  let highestItemCode = 0;

  for (let i = 0; i < item_db.length; i++) {
    const numericPart = parseInt(item_db[i].itemCode.split("-")[1]);

    if (!isNaN(numericPart) && numericPart > highestItemCode) {
      highestItemCode = numericPart;
    }
  }

  return `I-${String(highestItemCode + 1).padStart(3, "0")}`;
}

function resetColumns() {
  reset.click();
  itemCode.val(generateItemCode());
  submit.prop("disabled", false);
  delete_btn.prop("disabled", true);
  update.prop("disabled", true);
}

$("#item_page")
  .eq(0)
  .on("click", function () {
    itemCode.val(generateItemCode());
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
                <td>${item.unitPrice}</td>
                <td>${item.qty}</td>
                <td>${item.description}</td>
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
  let itemCodeValue = itemCode.val();
  let itemNameValue = itemName.val().trim();
  let priceValue = parseFloat(unitPrice.val());
  let qtyOnHandValue = parseInt(qty.val(), 10);
  let descriptionValue = description.val().trim();

  if (
    validation(itemNameValue, "item name", null) &&
    validation(priceValue, "Price", null) &&
    validation(qtyOnHandValue, "Qty On Hand", null) &&
    validation(descriptionValue, "Description", null)
  ) {
    let item = new itemModel(
      itemCodeValue,
      itemNameValue,
      priceValue,
      qtyOnHandValue,
      descriptionValue
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
  let descriptionValue = $(this).find("td:eq(3)").text();

  itemCode.val(itemCodeValue);
  itemName.val(itemNameValue);
  unitPrice.val(priceValue);
  qty.val(qtyValue);
  description.val(descriptionValue);

  submit.prop("disabled", true);
  delete_btn.prop("disabled", false);
  update.prop("disabled", false);
});

update.on("click", function () {
  let itemCodeValue = itemCode.val();
  let itemNameValue = itemName.val().trim();
  let priceValue = parseFloat(unitPrice.val());
  let qtyOnHandValue = parseInt(qty.val(), 10);
  let descriptionValue = description.val().trim();

  if (
    validation(itemNameValue, "item name", null) &&
    validation(priceValue, "Price", null) &&
    validation(qtyOnHandValue, "Qty On Hand", null) &&
    validation(descriptionValue, "Description", null)
  ) {
    item_db.map((item) => {
      if (item.itemCode === itemCodeValue) {
        item.itemName = itemNameValue;
        item.unitPrice = priceValue;
        item.qty = qtyOnHandValue;
        item.description = descriptionValue;
      }
    });

    Swal.fire("Update Successfully !", "Successful", "success");

    populateItemTBL();
    resetColumns();
  }
});

reset.on("click", function (e) {
  e.preventDefault();
  itemCode.val(generateItemCode());
  itemName.val("");
  unitPrice.val("");
  qty.val("");
  description.val("");
  submit.prop("disabled", false);
  delete_btn.prop("disabled", true);
  update.prop("disabled", true);
});

delete_btn.on("click", function () {
  let itemCodeValue = itemCode.val();

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
