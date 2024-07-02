import { app } from "../config/config.js";
import {
  getDatabase,
  ref,
  onValue,
  get,
  remove,
  set,
  child,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

if (!window.localStorage.getItem("userObj")) {
  window.location.href = "/Electro-commerce/login/signin/login.html";
}

const db = getDatabase();
const dbRef = ref(getDatabase());
let userObject = JSON.parse(localStorage.getItem("userObj"));
let userId = userObject.id;

let spinner = document.querySelector(".spinner");

document.addEventListener("click", function (e) {
  let searchDiv = document.querySelector(".searchDiv");
  let searchInpt = document.querySelector("#searchInpt");
  let searchBtn = document.querySelector("#searchBtn");

  if (e.target.dataset.search == "searchDataBtn") {
    if (searchInpt.value.length > 0) {
      let val = searchInpt.value.toLowerCase();
      searchFun(val);
    } else {
      alert("search by product Name...");
    }
  }

  if (e.target.id == "search_icon_min") {
    if (e.target.classList.contains("fa-magnifying-glass")) {
      e.target.classList.replace("fa-magnifying-glass", "fa-xmark");
      searchDiv.style.display = "block";
    } else {
      e.target.classList.replace("fa-xmark", "fa-magnifying-glass");
      searchDiv.style.display = "none";
    }
  }

  if (e.target.id == "bar_icon") {
    barsIcon(e);
  }

  if (e.target.id == "close_icon") {
    icon_closeFun(e);
  }
  if (e.target.id == "overlay") {
    document.querySelector(".pages").style.left = "-250px";
    document.querySelector(".overlay_header").style.display = "none";
  }

  if (e.target.id == "logout") {
    logout();
  }
});

// search func
function searchFun(inptVal) {
  let url = new URL(window.location.href);
  url.searchParams.set("s", inptVal);
  console.log(url.search);
  if (window.location.href.includes("index.html")) {
    window.location.href = `search/search.html${url.search}`;
  } else {
    window.location.href = `../search/search.html${url.search}`;
  }
}

// bars fun
function barsIcon(e) {
  document.querySelector(".pages").style.left = "0";
  document.querySelector(".overlay_header").style.display = "block";
}

function icon_closeFun(e) {
  document.querySelector(".pages").style.left = "-250px";
  document.querySelector(".overlay_header").style.display = "none";
}

function logout() {
  window.localStorage.removeItem("userObj");
  window.localStorage.removeItem("cartNum");
  window.location.href = "../login/signin/login.html";
}

// third section
let special_offer = document.querySelector(".special_offer");
let special_offer2 = document.querySelector(".special_offer2");
let third_section_right = document.querySelector(".third_section_right");
let fourth_section = document.querySelector(".fourth_section_right");
let box;
let specialBox;
let noRepeatValuesElectronics = [];
let noRepeatValuesPhones = [];
function getDataFromDatabase(ay7aga) {
  return new Promise((resolve) => {
    const starCountRef = ref(db, `${ay7aga}/`);
    onValue(starCountRef, async (snapshot) => {
      const data = await snapshot.val();
      resolve(data);
    });
  });
}

let data = await getDataFromDatabase("ElectronicsSection");
let phones = await getDataFromDatabase("PhonesSection");

function dataFun() {
  for (const product in data) {
    noRepeatValuesElectronics.push(data[product]);
  }
  for (const product in phones) {
    noRepeatValuesPhones.push(phones[product]);
  }

  if (noRepeatValuesElectronics.length > 0) {
    printIntoPage(noRepeatValuesElectronics);
  }
  if (noRepeatValuesPhones.length > 0) {
    printIntoFourthSection(noRepeatValuesPhones);
  }
}
dataFun();

(function () {
  onValue(ref(db, `users/${userId}/wishlist/`), async (snapshot) => {
    const wishlistData = await snapshot.val();
    let x = document.querySelectorAll(`.wishlist i`);
    for (const item in wishlistData) {
      x.forEach((el) => {
        if (wishlistData[item].productId == el.dataset.product_wishlist) {
          el.classList.replace("fa-regular", "fa-solid");
        }
      });
    }
  });

  let arr = [];
  onValue(ref(db, `users/${userId}/cart/`), async (snapshot) => {
    const cartData = await snapshot.val();
    let cartItems = document.querySelectorAll(`[data-product_id]`);
    for (const item in cartData) {
      arr.push(cartData[item]);
      cartItems.forEach((el) => {
        if (+el.dataset.check_cart == cartData[item].productId) {
          el.innerHTML =
            '<i class="fa-solid fa-bag-shopping me-1"></i> Remove Item';
        }
      });
    }
    let num = arr.length;
    window.localStorage.setItem("cartNum", JSON.stringify(num));
  });
})();

function printIntoPage(arr) {
  third_section_right.innerHTML = "";
  special_offer.innerHTML = "";
  if (arr.length > 0) {
    spinner.style.display = "none";
  } else {
    spinner.style.display = "flex";
  }
  specialBox = `
  <div class="product rounded-2">
  <h2 class="specialest">
    Special Offer
  </h2>
  <div class="productImage text-start">
    <img src="https://firebasestorage.googleapis.com/v0/b/e-commerce-552db.appspot.com/o/images%2Fimg16.webp?alt=media&token=b7d1cba1-25fa-4a4e-a634-d0dacf685ff3" alt="product">
  </div>
  <div class="p-2">
    <div class="category mt-2">Electronics</div>
    <div class="product_name mb-1">
      <a class="special_link" href="#">  
        GameConsole Destiny
      </a>  
    </div>
    <span class="price me-1">$212.00</span>
    <span class="total_after_discount mb-4 d-inline-block">$150.00</span>
  </div>

  <div class="mt-2 border-0">
    <a href="/Electro-commerce/productDetails/details.html?data=ElectronicsSection">
      <img src="imgs/electronics/footer-widget-img-01.webp">
    </a>
  </div>
</div>
  `;
  special_offer.innerHTML = specialBox;
  for (let i = 0; i < 8; i++) {
    box = `
    <div class="product rounded-2 col-12 col-sm-6 col-md-4 col-lg-3">
      <div class="productImage">
        <img src="${arr[i].imageUrl}" alt="product">
        <div class="wishlist">
          <i id="wishlist_icon" data-docname="${
            arr[i].docName
          }" data-product_id="${arr[i].productId}" data-product_wishlist="${
      arr[i].productId
    }" class="fa-regular fa-heart"></i>
        </div>
        <div class="off">-${arr[i].pDiscount}% OFF</div>
      </div>
      <div class="p-2">
        <div class="category mt-2">${arr[i].pCategory}</div>
        <div class="product_name mb-1">${arr[i].pName}</div>
        <span class="price me-1">$${Math.trunc(arr[i].total)}.00</span>
        <span class="total_after_discount mb-4 d-inline-block">$${
          arr[i].pPrice
        }.00</span>
        <div class="details">
          <div>
            <a href="../Electro-commerce/productDetails/details.html?data=ElectronicsSection&product_id=${
              arr[i].productId
            }" class="me-4"><i class="fa-solid fa-eye"></i> View</a>
          </div>           
          <div class="text-end">
            <button id="cart_id" data-docname="${
              arr[i].docName
            }" data-check_cart="${arr[i].productId}" data-product_id="${
      arr[i].productId
    }">
              <i class="fa-solid fa-bag-shopping me-1"></i>Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
    `;
    third_section_right.innerHTML += box;
  }
}

function printIntoFourthSection(arr) {
  fourth_section.innerHTML = "";
  special_offer2.innerHTML = "";
  if (arr.length > 0) {
    spinner.style.display = "none";
  } else {
    spinner.style.display = "flex";
  }
  specialBox = `
  <div class="product rounded-2">
  <h2 class="specialest">
    Special Offer
  </h2>
  <div class="productImage text-start">
    <img src="imgs/electronics/home-9-banner-product-tab-4.webp" alt="product">
  </div>
  <div class="p-2">
    <div class="category mt-2">Electronics</div>
    <div class="product_name mb-1">
        Canon GT4-235
    </div>
    <span class="price me-1">$212.00</span>
    <span class="total_after_discount mb-4 d-inline-block">$150.00</span>
  </div>

  <div class="mt-2 border-0">
      <img class="w-100 d-block" src="imgs/electronics/shop-sidebar-ad-banner.webp">
  </div>
</div>
  `;
  special_offer2.innerHTML = specialBox;
  for (let i = 0; i < 8; i++) {
    box = `
    <div class="product rounded-2 col-12 col-sm-6 col-md-4 col-lg-3">
      <div class="productImage">
        <img src="${arr[i].imageUrl}" alt="product">
        <div class="wishlist">
          <i id="wishlist_icon" data-docname="${
            arr[i].docName
          }" data-product_id="${arr[i].productId}" data-product_wishlist="${
      arr[i].productId
    }" class="fa-regular fa-heart"></i>
        </div>
        <div class="off">-${arr[i].pDiscount}% OFF</div>
      </div>
      <div class="p-2">
        <div class="category mt-2">${arr[i].pCategory}</div>
        <div class="product_name mb-1">${arr[i].pName}</div>
        <span class="price me-1">$${Math.trunc(arr[i].total)}.00</span>
        <span class="total_after_discount mb-4 d-inline-block">$${
          arr[i].pPrice
        }.00</span>
        <div class="details">
          <div>
            <a href="/Electro-commerce/productDetails/details.html?data=PhonesSection&product_id=${
              arr[i].productId
            }" class="me-4"><i class="fa-solid fa-eye"></i> View</a>
          </div>           
          <div class="text-end">
            <button id="cart_id" data-docname="${
              arr[i].docName
            }" data-check_cart="${arr[i].productId}" data-product_id="${
      arr[i].productId
    }">
              <i class="fa-solid fa-bag-shopping me-1"></i>Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
    `;
    fourth_section.innerHTML += box;
  }
}

let num = document.querySelector(".cartNum");
let wishNum = document.querySelector(".wishNum");

document.addEventListener("click", (e) => {
  let checkedArr = [];
  if (e.target.id == "cart_id") {
    addToCartFun(e, "cart");
  }
  if (e.target.id == "wishlist_icon") {
    addToCartFun(e, "wishlist");
  }
});

function sweetAlertFun(actionWord) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
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
let count = 0;
let x = num.innerHTML;

function addToCartFun(e, actionCart) {
  let productId = +e.target.dataset.product_id;
  // get product object when click add to cart
  get(child(dbRef, `${e.target.dataset.docname}/` + productId)).then(
    (snapshot) => {
      if (snapshot.exists()) {
        setProductObjectInCart(snapshot.val());
      } else {
        console.log("No data available");
      }
    }
  );

  function setProductObjectInCart(data) {
    data.userId = userId;

    if (actionCart == "wishlist") {
      if (e.target.classList.contains("fa-regular")) {
        wishNum.innerHTML = +wishNum.innerHTML + 1;
        e.target.classList.replace("fa-regular", "fa-solid");
        set(ref(db, `users/${userId}/wishlist/` + productId), data).then(
          (result) => {
            sweetAlertFun("added");
          }
        );
      } else {
        wishNum.innerHTML = +wishNum.innerHTML - 1;
        e.target.classList.replace("fa-solid", "fa-regular");
        remove(ref(db, `users/${userId}/wishlist/` + productId)).then(
          (result) => {
            sweetAlertFun("removed");
          }
        );
      }
    }
    if (actionCart == "cart") {
      let str = e.target.innerHTML.search("Add To Cart");
      if (e.target.innerText == "Add To Cart") {
        // count++
        num.innerHTML = +num.innerHTML + 1;
        e.target.innerHTML =
          '<i class="fa-solid fa-bag-shopping me-1"></i>Remove Cart';
        set(ref(db, `users/${userId}/cart/` + productId), data)
          .then((result) => {
            sweetAlertFun("added");
          })
          .catch((err) => {
            console.log(err.code);
          });
      } else {
        e.target.innerHTML =
          '<i class="fa-solid fa-bag-shopping me-1"></i>Add To Cart';

          num.innerHTML = +num.innerHTML - 1;

        remove(ref(db, `users/${userId}/cart/` + productId)).then((result) => {
          sweetAlertFun("removed");
        });
      }
    }
  }
}
