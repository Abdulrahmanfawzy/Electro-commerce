import { app } from "../config/config.js";
import {
  getDatabase,
  ref,
  get,
  remove,
  set,
  child,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

let searchLink = window.location.search;
let query = new URLSearchParams(searchLink);
let product_section = query.get("data");
let product_id = +query.get("product_id");
let userObject = JSON.parse(localStorage.getItem("userObj"));
let spinner = document.querySelector(".spinner");

let userId = userObject.id;
let box;
let productDetails = document.querySelector(".productDetails");
const db = getDatabase();
const dbRef = ref(getDatabase());

let str;
console.log(product_id);
console.log(product_section);
if (product_id) {
  get(child(dbRef, `${product_section}/` + product_id))
    .then(async (snapshot) => {
      if (snapshot.exists()) {
        str = await snapshot.val();
        setDataIntoPage(snapshot.val());

        get(child(dbRef, `users/${userId}/cart/` + product_id))
          .then(async (snapshot) => {
            if (snapshot.exists()) {
              str = await snapshot.val();
              let cart_id = document.getElementById("cart_id");
              cart_id.innerHTML =
                '<i class="fa-solid fa-bag-shopping me-1"></i>Remove From Cart';
            }
          })
          .catch((error) => {
            console.log(error);
          });

        get(child(dbRef, `users/${userId}/wishlist/` + product_id))
          .then(async (snapshot) => {
            if (snapshot.exists()) {
              str = await snapshot.val();
              let wishlist_icon = document.getElementById("wishlist_icon");
              wishlist_icon.innerHTML =
                '<i class="fa-solid fa-heart me-2"></i>Remove From wishlist';
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
} else {
  window.location.href = "../index.html";
}

// display object in page
function setDataIntoPage(objData) {
  console.log(objData);
  productDetails.innerHTML = "";
  if (objData) {
    spinner.style.display = "none";

    box = `
        <div class="row align-items-center">
        <div class="col-md-6 text-center">
          <img
            class="mb-2"
            src="${objData.imageUrl}"
            alt=""
          />
        </div>
        <div class="col-md-6">
          <h2 class="product_name fs-1 fw-bold">${objData.pName}</h2>
          <h2 class="product_category fs-6 fw-bold">Discount: ${
            objData.pDiscount
          }%</h2>
          <h2 class="product_category fs-6 mb-5 fw-bold">Price: $${Math.trunc(
            objData.total
          )}.00  <span class="fw-bold text_change_color text-decoration-line-through">$${
      objData.pPrice
    }.00</span></h2>
          <h5 class="product_category fs-6 fw-bold">Brand: ${
            objData.pBrand
          }</h5>
          <h5 class="product_Desc fs-6 fw-bold">Description: ${
            objData.pDesc
          }</h5>
          <h5 class="product_Desc fs-6 fw-bold">Category: ${
            objData.pCategory
          }</h5>
          <h5 class="product_Desc fs-6 fw-bold">Color: <span style="background:${objData.pColor.toLowerCase()}" class="colorSpan"></span></h5>
          <div class="my-4">
            Proactively communicate corporate process improvements via corporate
            scenarios. Progressively aggregate proactive data after diverse
            users. Rapidiously redefine front-end interfaces before go forward
            process improvements.
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="size fs-6 fw-bold">SIZE:</h5>
            <div class="list d-flex gap-2">
              <li class="border px-2 py-1">XS</li>
              <li class="border px-2 py-1">S</li>
              <li class="border px-2 py-1">M</li>
              <li class="border px-2 py-1">L</li>
              <li class="border px-2 py-1">XL</li>
              <li class="border px-2 py-1">XXL</li>
            </div>
          </div>

          <div class="btns mt-5 details">
            <button id="cart_id" class="me-3 mb-3 border p-3 px-4">
              <i class="fa-solid fa-bag-shopping me-2"></i>Add To Cart
            </button>
            <button id="wishlist_icon" class="border p-3 px-4">
              <i class="fa-regular fa-heart me-2"></i>Add To Wishlist
            </button>
          </div>

        </div>


        <div class="row mt-5 mb-5">
        <div class="col-md-4">
          <h2>Description</h2>
          <p>
            Compellingly grow performance based mindshare through parallel
            potentialities. Rapidiously underwhelm top-line catalysts for change
            before best-of-breed materials. Competently brand timely catalysts
            for change through sustainable systems. Completely expedite
            ubiquitous bandwidth after integrated action items. Progressively
            transform leading-edge supply chains whereas flexible niche markets.
          </p>
        </div>
        <div class="col-md-4 mt-1 mt-md-0">
          <h2>Information</h2>
          <li>
            <h4>Shipping</h4>
            <section>
              We currently offer free shipping worldwide on all orders over
              $100.
            </section>
          </li>
          <li>
            <h4>Sizing</h4>
            <section>Fits true to size. Do you need size advice?</section>
          </li>
          <li>
            <h4>Return & exchange</h4>
            <section>
              If you are not satisfied with your purchase you can return it to
              us within 14 days for an exchange or refund. More info.
            </section>
          </li>
        </div>
        <div class="col-md-4 mt-3 mt-md-0">
          <h2>Specifications</h2>
          <div>
            <div class="d-flex mb-2 justify-content-between">
              <h4>WEIGHT</h4>
              <li>1.20 kg</li>
            </div>
            <div class="d-flex mb-2 justify-content-between">
              <h4>DIMENSIONS</h4>
              <li>1.20 kg</li>
            </div>
            <div class="d-flex mb-2 justify-content-between">
              <h4>SIZE</h4>
              <li>XS, S, M, L, XL, XXL</li>
            </div>
            <div class="d-flex mb-2 justify-content-between">
              <h4>MATERIAL</h4>
              <li>Polyester</li>
            </div>
            <div class="d-flex mb-2 justify-content-between">
              <h4>BRAND</h4>
              <li>Fashion</li>
            </div>
          </div>
          
        </div>

        
      </div>


    </div>

        `;
    productDetails.innerHTML = box;
  } else {
    spinner.style.display = "flex";
  }
}

document.addEventListener("click", (e) => {
  if (e.target.id == "cart_id") {
    addToCartFun(e, "cart");
  }
  if (e.target.id == "wishlist_icon") {
    addToCartFun(e, "wishlist");
  }
});


function addToCartFun(e, actionCart) {
  let num = document.querySelector(".cartNum");
  let wishNum = document.querySelector(".wishNum");
  console.log(num);
  if (e.target.id == "cart_id") {
    if (e.target.innerText == "Add To Cart") {
      num.innerHTML = +num.innerHTML + 1;
      e.target.innerHTML =
        '<i class="fa-solid fa-bag-shopping me-1"></i>Remove From Cart';
      setProduct("cart");
    } else {
      num.innerHTML = +num.innerHTML - 1;
      e.target.innerHTML =
        '<i class="fa-solid fa-bag-shopping me-1"></i>Add To Cart';
      removeProduct("cart");
    }
  }

  if (e.target.id == "wishlist_icon") {
    if (e.target.innerText == "Add To Wishlist") {
      wishNum.innerHTML = +wishNum.innerHTML + 1;
      e.target.innerHTML =
        '<i class="fa-solid fa-heart me-2"></i>Remove From Wishlist';
      setProduct("wishlist");
    } else {
      wishNum.innerHTML = +wishNum.innerHTML - 1;
      e.target.innerHTML =
        '<i class="fa-regular fa-heart me-2"></i>Add To Wishlist';
      removeProduct("wishlist");
    }
  }
}

function setProduct(root) {
  set(ref(db, `users/${userId}/${root}/` + product_id), str).then((result) => {
    sweetAlertFun("added");
  });
}
function removeProduct(root) {
  remove(ref(db, `users/${userId}/${root}/` + product_id)).then((result) => {
    sweetAlertFun("removed");
  });
}

function sweetAlertFun(actionWord) {
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
    title: `Item is ${actionWord} successfully`,
  });
}
