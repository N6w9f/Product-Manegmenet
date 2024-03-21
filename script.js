/* inputSection  */
const inputProduct = document.querySelector("[name='product']");

const inputPrice = document.querySelector("[name='price']");
const inputStorage = document.querySelector("[name='storage']");

const inputCategory = document.querySelector("#category");
const total = document.querySelector(".total");
const add = document.querySelector("#add");

inputPrice.addEventListener("input", () => {
  totalUpdater();
});
inputStorage.addEventListener("input", () => {
  totalUpdater();
});
function totalUpdater() {
  if (inputStorage.value > 0 || inputStorage.value !== "") {
    total.style.cssText = `border-color: var(--success-color); color: var(--success-color)`;
    total.textContent = `${inputPrice.value * inputStorage.value}`;
  } else {
    total.style.cssText = `border-color: var(--danger-color); color: var(--danger-color)`;
    total.textContent = `Total`;
  }
  if (inputPrice.value * inputStorage.value <= 0) {
    total.style.cssText = `border-color: var(--danger-color); color: var(--danger-color)`;
    total.textContent = `Total`;
  }
}

add.addEventListener("click", () => {
  inputsCheck();
});
function inputsCheck() {
  if (
    inputProduct.value !== "" &&
    total.textContent.toUpperCase() !== "total".toUpperCase()
  ) {
    addToArray();
    add.style.cssText = `background-color: var(--success-color);`;

    inputProduct.value = "";
    inputPrice.value = "";
    inputStorage.value = "";
    inputCategory.value = inputCategory.children[0].value;
  } else {
    add.style.cssText = `background-color: var(--danger-color);`;
  }

  totalUpdater();
  setTimeout(() => {
    add.style.cssText = `background-color: var(--primary-color)`;
  }, 1000);
}

/* filterSection */

/* outputSection */
const tbody = document.querySelector(".output tbody");

let tableArray = [];
if (localStorage.getItem("product")) {
  tableArray = JSON.parse(localStorage.getItem("product"));
  addToTable();
}

function addToArray() {
  const element = {
    product: inputProduct.value,
    price: inputPrice.value,
    total: total.textContent,
    inStorage: `${inputStorage.value} Left`,
    category: inputCategory.value,
    id: new Date(),
  };
  tableArray.push(element);
  localStorage.setItem("product", JSON.stringify(tableArray));
  addToTable();
}
function addToTable() {
  tbody.innerHTML = "";
  for (let i in tableArray) {
    const tr = document.createElement("tr");

    for (let prop in tableArray[i]) {
      if (prop == "id") {
        tr.id = tableArray[i][prop];
      } else {
        const td = document.createElement("td");
        td.append(document.createTextNode(tableArray[i][prop]));
        tr.append(td);
      }
    }

    const updated = document.createElement("td");
    const deleted = document.createElement("td");
    updated.append(document.createTextNode("Update"));
    deleted.append(document.createTextNode("Delete"));

    // Update

    // Delete
    deleted.addEventListener("click", () => {
      tableArray = tableArray.filter((e) => e.id !== deleted.parentElement.id);
      localStorage.setItem("product", JSON.stringify(tableArray));
      deleted.parentElement.remove();
    });

    tr.append(updated, deleted);
    tbody.append(tr);
  }
}
