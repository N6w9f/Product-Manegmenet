const lightDark = document.querySelector("h1");
lightDark.onclick = () => {
  document.body.parentElement.classList.toggle("dark");
};
// inputVariables -------------
const inputProduct = document.querySelector("[name='product']");
const inputPrice = document.querySelector("[name='price']");
const inputStorage = document.querySelector("[name='storage']");
const inputCategory = document.querySelector("#category");
const total = document.querySelector(".total");
const add = document.querySelector("#add");
const closeUpdate = document.querySelector("#close");
// filterVariables -------------
const filter = document.querySelector("input[name='search']");
const forProductName = document.querySelector(".filter button#product");
const forProductCategory = document.querySelector(".filter button#category");
// outputVariables -------------
const tbody = document.querySelector(".output tbody");
let tableArray = [];
if (localStorage.getItem("product")) {
  tableArray = JSON.parse(localStorage.getItem("product"));
  addToTable();
}
/* inputSection  */
inputPrice.addEventListener("input", () => {
  totalUpdater();
});
inputStorage.addEventListener("input", () => {
  totalUpdater();
});
add.addEventListener("click", () => {
  inputsCheck();
});
function totalUpdater() {
  if (inputStorage.value > "" || inputStorage.value !== "") {
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
function update(allProduct) {
  inputProduct.value = allProduct.children[0].textContent;
  inputPrice.value = allProduct.children[1].textContent;
  inputStorage.value = parseFloat(allProduct.children[3].textContent);
  inputCategory.value = allProduct.children[4].textContent;
  totalUpdater();
  add.addEventListener("click", () => {
    if (add.value.toUpperCase() == "update".toUpperCase()) {
      if (
        inputProduct.value !== "" &&
        total.textContent.toUpperCase() !== "total".toUpperCase()
      ) {
        tableArray.map((ele) => {
          if (ele.id == allProduct.id) {
            ele.product = inputProduct.value;
            ele.price = inputPrice.value;
            ele.total = total.textContent;
            ele.inStorage = inputStorage.value;
            ele.category = inputCategory.value;
          }
        });
        localStorage.product = JSON.stringify(tableArray);
        addToTable();
        add.style.cssText = `background-color: var(--success-color);`;
        inputProduct.value = "";
        inputPrice.value = "";
        inputStorage.value = "";
        inputCategory.value = inputCategory.children[0].value;
        add.value = "Add";
        closeUpdate.style.display = "none";
      } else {
        add.style.cssText = `background-color: var(--danger-color);`;
      }

      setTimeout(() => {
        add.style.cssText = `background-color: var(--primary-color)`;
      }, 1000);
    }
  });
}
function inputsCheck() {
  if (add.value === "Add") {
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
  }
  setTimeout(() => {
    add.style.cssText = `background-color: var(--primary-color)`;
  }, 1000);
}
closeUpdate.onclick = () => {
  inputProduct.value = "";
  inputPrice.value = "";
  inputStorage.value = "";
  inputCategory.value = inputCategory.children[0].value;
  add.value = "Add";
  closeUpdate.style.display = "none";
};
/* filterSection */
filter.oninput = () => {
  if (filter.value == "") {
    [...tbody.children].forEach((ele) => {
      ele.style.display = "table-row";
    });
  }
};
[forProductName, forProductCategory].forEach((ele) => {
  ele.addEventListener("click", () => {
    [...tbody.children].forEach((ele2) => {
      let filterMatch = new RegExp(filter.value, "gi");
      if (ele.id === "category") {
        ele2.children[4].textContent.match(filterMatch)
          ? (ele2.style.display = "table-row")
          : (ele2.style.display = "none");
      } else {
        ele2.children[0].textContent.match(filterMatch)
          ? (ele2.style.display = "table-row")
          : (ele2.style.display = "none");
      }
    });
  });
});
/* outputSection */
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
    updated.addEventListener("click", () => {
      add.value = "Update";
      closeUpdate.style.display = "block";
      update(updated.parentElement);
    });
    // Delete
    deleted.addEventListener("click", () => {
      tableArray = tableArray.filter((e) => e.id != deleted.parentElement.id);
      localStorage.setItem("product", JSON.stringify(tableArray));
      deleted.parentElement.remove();
    });
    tr.append(updated, deleted);
    tbody.append(tr);
  }
}
