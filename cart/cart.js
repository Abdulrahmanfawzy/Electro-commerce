import { app } from "../config/config.js";
import {
  getDatabase,
  ref,
  onValue,
  get,
  set,
  child,
  remove,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

let cart_parent = document.querySelector(".cart_parent");
let cart_body = document.querySelector("#cart_body");
let cartTotal = document.querySelector(".cartTotal");
let spinner = document.querySelector(".spinner");

let userObject = JSON.parse(localStorage.getItem("userObj"));
let userId = userObject.id;
let box;
const db = getDatabase();
const dbRef = ref(getDatabase());

async function getWishlistData() {
  let arr = [];
  return new Promise((resolve) => {
    onValue(ref(db, `users/${userId}/cart/`), async (snapshot) => {
      const wishlistData = await snapshot.val();
      if (wishlistData) {
        for (const item in wishlistData) {
          arr.push(wishlistData[item]);
        }
        resolve(arr);
      } else {
        noProductsFound();
      }
    });
  });
}
let count = 0;
async function printIntoPage() {
  let dataReturned = await getWishlistData();
  cart_body.innerHTML = "";
  if (dataReturned) {
    spinner.style.display = "none";

    dataReturned.forEach((el, index) => {
      box = `
        <tr class="position-relative border-bottom">
            <td class="py-3 text-center closeIconWishlist">
                <i id="closeIconWishlistId" data-docname="${
                  el.docName
                }" data-product_id="${
        el.productId
      }" class="fa-solid fa-xmark"></i>
            </td>
            <td class="py-3"><img id="product_img" src="${el.imageUrl}" alt="${
        el.pName
      }"/></td>
            <td class="py-3">${el.pName}</td>
            <td class="py-3">
                <span class="pPrice">$${el.pPrice}.00</span>
                <span class="pTotl">$${el.total}.00</span>
            </td>
            <td class="py-3">
                <input type="number" value="1" min="1" data-num="quantity" class="quantityInput border" />
            </td>
            <td class="py-3">
                <h5 data-total_productid="${
                  el.productId
                }" data-total="${+el.total}">$${+el.total}.00</h5>
            </td>
            </tr>
            <span data-span_total="${(count += +el.total)}">
            </span>
                `;
      cart_body.innerHTML += box;
    });
    cartTotal.innerHTML = `
    <h2 class="mb-5">CART TOTALS</h2>
    <div>
      <div class="row border-bottom py-3">
        <h6 class="col-2">SUBTOTAL</h6>
        <h6 class="col-8" id="counter">$${count}.00</h6>
      </div>
      <div class="row border-bottom py-3">
        <h6 class="col-2">Shipping</h6>
        <h6 class="col-8">$50.00</h6>
      </div>
      <div class="row border-bottom py-3">
        <h6 class="col-2">Total</h6>
        <h6 id="totalResult" class="col-8">$${count + 50}.00</h6>
      </div>
    </div>
    <button class="btn btn-dark mt-4 ms-0">CHECKOUT</button>
    `;
  } else {
    spinner.style.display = "flex";
  }
}

printIntoPage();

function noProductsFound() {
  cart_parent.innerHTML = `
    <div class="text-center no_product_img">
        <h3>No Products In My  Cart</h3>
        <img src="../imgs/download_70.21833333333353.svg" alt="">
    </div>`;
}

document.addEventListener("click", async (e) => {
  if (e.target.id == "closeIconWishlistId") {
    getObjectFirebase(+e.target.dataset.product_id);
  }
  if (e.target.id == "cart_id") {
    addToCartFun(e, e.target.dataset.docname);
  }

  if (e.target.dataset.num == "quantity") {
    let quantityInputs = document.querySelectorAll("[data-num]");
    let subtotal = document.querySelectorAll("[data-total_productid]");
    let span_total = document.querySelector("[data-span_total]");
    quantityInputs.forEach((el, index) => {
      el.addEventListener("change", (event) => {
        handleChangeQuantity(+event.target.value, index);
      });
    });
  }
});
function handleChangeQuantity(num, index) {
  let subtotal = document.querySelectorAll("[data-total_productid]");
  let counter = document.querySelector("#counter");
  let totalResult = document.querySelector("#totalResult");

  subtotal[index].innerHTML = `$${subtotal[index].dataset.total * num}.00`;
  subtotal[index].setAttribute(
    "data-need",
    subtotal[index].dataset.total * num
  );

  let number = 0;
  subtotal.forEach((ele) => {
    if (ele.dataset.need) {
      number += +ele.dataset.need;
      counter.innerHTML = `$${number}.00`;
      totalResult.innerHTML = `$${number + 50}.00`;
    } else {
      number += +ele.dataset.total;
      counter.innerHTML = `$${number}.00`;
      totalResult.innerHTML = `$${number + 50}.00`;
    }
  });
}

async function getObjectFirebase(id) {
  let num = document.querySelector(".cartNum");
  
  num.innerHTML = +num.innerHTML - 1;

  remove(ref(db, `users/${userId}/cart/` + id)).then(async (result) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
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
      title: "Product has been successfully deleted",
    });
    printIntoPage();
  });
}
