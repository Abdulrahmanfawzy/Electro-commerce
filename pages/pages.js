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

let searchParams = window.location.search;
let realQueryData = new URLSearchParams(searchParams);
let product_parent = document.querySelector(".product_parent");
let product_row = document.querySelector(".product_row");
let arrContainAllProducts = [];
let arrToPrintProducts = [];
let search_div = document.querySelector(".search_div");
let fashion_title = document.querySelector(".fashion_title");
let brand_filter_div = document.querySelector(".brand_filter_div");
let color_filter_div = document.querySelector(".color_filter_div");

let dataSection = realQueryData.get("data"); // fashionSection

const db = getDatabase();
const dbRef = ref(getDatabase());
let userObject = JSON.parse(localStorage.getItem("userObj"));
let userId = userObject.id;
let noRepeatValues = [];
let colorArr = [];
let box;
let filter_brand;
let uniqueArrBrand;
let uniqueArrColor;
let number = 0;
let count = 0;
let spinner = document.querySelector(".spinner");

function getDataFromDatabase(ay7aga) {
  return new Promise((resolve) => {
    const starCountRef = ref(db, `${ay7aga}/`);
    onValue(starCountRef, async (snapshot) => {
      const data = await snapshot.val();
      resolve(data);
    });
  });
}

let dataCatchedFromDatabase = await getDataFromDatabase(dataSection);

if (realQueryData.has("data") == true) {
  dataFun();
} else {
  window.location.href = "../index.html";
}

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

function dataFun() {
  product_row.innerHTML = "";
  brand_filter_div.innerHTML = "";

  for (const product in dataCatchedFromDatabase) {
    noRepeatValues.push(dataCatchedFromDatabase[product].pBrand);
    uniqueArrBrand = noRepeatValues.filter(
      (item, index) => noRepeatValues.indexOf(item) === index
    );
    colorArr.push(dataCatchedFromDatabase[product].pColor);
    uniqueArrColor = colorArr.filter(
      (item, index) => colorArr.indexOf(item) === index
    );

    box = `
      <div class="product rounded-2 col-sm-6 col-md-4 col-lg-3">
        <div class="productImage">
          <img src="${dataCatchedFromDatabase[product].imageUrl}" alt="product">
          <div class="wishlist">
            <i id="wishlist_icon" data-product_id="${product}" data-product_wishlist="${product}" class="fa-regular fa-heart"></i>
          </div>
          <div class="off">-${
            dataCatchedFromDatabase[product].pDiscount
          }% OFF</div>
        </div>
        <div class="p-2">
          <div class="category mt-2">${
            dataCatchedFromDatabase[product].pCategory
          }</div>
          <div class="product_name mb-1">${
            dataCatchedFromDatabase[product].pName
          }</div>
          <span class="price me-1">$${Math.trunc(
            dataCatchedFromDatabase[product].total
          )}.00</span>
          <span class="total_after_discount mb-4 d-inline-block">$${
            dataCatchedFromDatabase[product].pPrice
          }.00</span>
          <div class="details">
            <div>
              <a href="../productDetails/details.html?data=${dataSection}&product_id=${product}" class="me-4"><i class="fa-solid fa-eye"></i> View</a>
            </div>           
            <div class="text-end">
              <button id="cart_id" data-check_cart="${product}" data-product_id="${product}">
                <i class="fa-solid fa-bag-shopping me-1"></i>Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      `;
    product_row.innerHTML += box;
  }

  uniqueFun(uniqueArrBrand, brand_filter_div, "brand");
  uniqueFun(uniqueArrColor, color_filter_div, "color");

  if (dataCatchedFromDatabase) {
    spinner.style.display = "none";
  } else {
    spinner.style.display = "flex";
  }
}

function uniqueFun(arr, div, filterName) {
  div.innerHTML = "";
  arr.forEach((el) => {
    count++;
    filter_brand = `
      <div class="form-check mb-1">
        <input class="form-check-input product_check" data-${filterName}="${el}" type="checkbox" value="" id="flexCheckDefault${count}">
        <label class="form-check-label product_check" data-${filterName}="${el}" for="flexCheckDefault${count}">
         ${el}
        </label>
      </div>
    `;
    div.innerHTML += filter_brand;
  });
}
document.querySelector(".All").checked = true;
document.addEventListener("click", (e) => {
  let checkedArr = [];
  let inptsBrand = document.querySelectorAll("[data-brand]");
  let inptsColor = document.querySelectorAll("[data-color]");

  if (e.target.dataset.brand) {
    inptsBrand.forEach((el) => {
      el.checked = false;
    });
    inptsColor.forEach((el) => {
      el.checked = false;
    });
    e.target.checked = true;
    if (e.target.dataset.brand == "All") {
      dataFun();
    } else {
      product_row.innerHTML = "";
      for (const item in dataCatchedFromDatabase) {
        if (dataCatchedFromDatabase[item].pBrand == e.target.dataset.brand) {
          box = `
        <div class="product rounded-2 col-sm-6 col-md-4 col-lg-3">
          <div class="productImage">
            <img src="${dataCatchedFromDatabase[item].imageUrl}" alt="product">
          <div class="wishlist">
            <i id="wishlist_icon" data-product_id="${item}" data-product_wishlist="${item}" class="fa-regular fa-heart"></i>
          </div>
          <div class="off">-${
            dataCatchedFromDatabase[item].pDiscount
          }% OFF</div>
        </div>
        <div class="p-2">
          <div class="category mt-2">${
            dataCatchedFromDatabase[item].pCategory
          }</div>
          <div class="product_name mb-1">${
            dataCatchedFromDatabase[item].pName
          }</div>
          <span class="price me-1">$${Math.trunc(
            dataCatchedFromDatabase[item].total
          )}.00</span>
          <span class="total_after_discount mb-4 d-inline-block">$${
            dataCatchedFromDatabase[item].pPrice
          }.00</span>
          <div class="details">
              <div>
                <a href="../productDetails/details.html?data=${dataSection}&product_id=${item}" class="me-4"><i class="fa-solid fa-eye"></i> View</a>
              </div>            
          <div class="text-end">
              <button id="cart_id" data-check_cart="${item}" data-product_id="${item}">
                <i class="fa-solid fa-bag-shopping me-1"></i>Add To Cart
              </button>
          </div>
        </div>
        </div>
      </div>
            `;
          product_row.innerHTML += box;
        }
      }
    }
  }

  if (e.target.dataset.color) {
    inptsBrand.forEach((el) => {
      el.checked = false;
    });
    inptsColor.forEach((el) => {
      el.checked = false;
    });
    e.target.checked = true;

    product_row.innerHTML = "";
    for (const item in dataCatchedFromDatabase) {
      if (dataCatchedFromDatabase[item].pColor == e.target.dataset.color) {
        box = `
        <div class="product rounded-2 col-sm-6 col-md-4 col-lg-3">
          <div class="productImage">
            <img src="${dataCatchedFromDatabase[item].imageUrl}" alt="product">
          <div class="wishlist">
            <i id="wishlist_icon" data-product_id="${item}" data-product_wishlist="${item}" class="fa-regular fa-heart"></i>
          </div>
          <div class="off">-${
            dataCatchedFromDatabase[item].pDiscount
          }% OFF</div>
        </div>
        <div class="p-2">
          <div class="category mt-2">${
            dataCatchedFromDatabase[item].pCategory
          }</div>
          <div class="product_name mb-1">${
            dataCatchedFromDatabase[item].pName
          }</div>
          <span class="price me-1">$${Math.trunc(
            dataCatchedFromDatabase[item].total
          )}.00</span>
          <span class="total_after_discount mb-4 d-inline-block">$${
            dataCatchedFromDatabase[item].pPrice
          }.00</span>
          <div class="details">
              <div>
              <a href="../productDetails/details.html?data=${dataSection}&product_id=${item}" class="me-4"><i class="fa-solid fa-eye"></i> View</a>
            </div>            
            <div class="text-end">
              <button id="cart_id" data-check_cart="${item}" data-product_id="${item}">
                <i class="fa-solid fa-bag-shopping me-1"></i>Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>
            `;
        product_row.innerHTML += box;
      }
    }
  }

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

function addToCartFun(e, actionCart) {
  let productId = +e.target.dataset.product_id;

  // get product object when click add to cart
  get(child(dbRef, `${dataSection}/` + productId)).then((snapshot) => {
    if (snapshot.exists()) {
      setProductObjectInCart(snapshot.val());
    } else {
      console.log("No data available");
    }
  });

  function setProductObjectInCart(data) {
    data.userId = userId;

    if (actionCart == "wishlist") {
      if (e.target.classList.contains("fa-regular")) {
        e.target.classList.replace("fa-regular", "fa-solid");
        set(ref(db, `users/${userId}/wishlist/` + productId), data).then(
          (result) => {
            sweetAlertFun("added");
          }
        );
      } else {
        e.target.classList.replace("fa-solid", "fa-regular");
        remove(ref(db, `users/${userId}/wishlist/` + productId)).then(
          (result) => {
            sweetAlertFun("removed");
          }
        );
      }
    }
    let num = document.querySelector(".cartNum");
    if (actionCart == "cart") {
      let str = e.target.innerHTML.search("Add To Cart");
      if (e.target.innerText == "Add To Cart") {
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
        num.innerHTML = +num.innerHTML - 1;

        e.target.innerHTML =
          '<i class="fa-solid fa-bag-shopping me-1"></i>Add To Cart';
        number -= 1;
        console.log(number);
        let getNum = JSON.parse(localStorage.getItem("cartNum"));
        window.localStorage.setItem("cartNum", JSON.parse(--getNum));
        remove(ref(db, `users/${userId}/cart/` + productId)).then((result) => {
          sweetAlertFun("removed");
        });
      }
    }
  }
}

let inpt_price = document.getElementById("inpt_price");
let priceBtn = document.getElementById("priceBtn");
let priceLabel = document.querySelector(".priceLabel");
let minMaxArr = [];

(function () {
  for (const item in dataCatchedFromDatabase) {
    minMaxArr.push(+dataCatchedFromDatabase[item].total);
  }
  let minNum = Math.min(...minMaxArr);
  let maxNum = Math.max(...minMaxArr);
  inpt_price.min = minNum;
  inpt_price.max = maxNum;
  priceLabel.innerHTML = `Price: $${minNum} - $${maxNum}`;
})();

inpt_price.addEventListener("change", (e) => {
  priceLabel.innerHTML = `Price: $${inpt_price.min} - $${e.target.value}`;
});

priceBtn.addEventListener("click", () => {
  let inptsBrand = document.querySelectorAll("[data-brand]");
  let inptsColor = document.querySelectorAll("[data-color]");
  inptsBrand.forEach((el) => {
    el.checked = false;
  });
  inptsColor.forEach((el) => {
    el.checked = false;
  });
  let val = +inpt_price.value;
  product_row.innerHTML = "";
  for (const item in dataCatchedFromDatabase) {
    if (dataCatchedFromDatabase[item].total <= val) {
      box = `
      <div class="product rounded-2 col-sm-6 col-md-4 col-lg-3">
        <div class="productImage">
          <img src="${dataCatchedFromDatabase[item].imageUrl}" alt="product">
        <div class="wishlist">
          <i id="wishlist_icon" data-product_id="${item}" data-product_wishlist="${item}" class="fa-regular fa-heart"></i>
        </div>
        <div class="off alert alert-warning">-${dataCatchedFromDatabase[item].pDiscount}% OFF</div>
      </div>
      <div class="p-2">
        <div class="category mt-2">${
          dataCatchedFromDatabase[item].pCategory
        }</div>
        <div class="product_name mb-1">${
          dataCatchedFromDatabase[item].pName
        }</div>
        <span class="price me-1">$${Math.trunc(
          dataCatchedFromDatabase[item].total
        )}.00</span>
        <span class="total_after_discount mb-4 d-inline-block">$${
          dataCatchedFromDatabase[item].pPrice
        }.00</span>
        <div class="details">
          <div>
            <a href="../productDetails/details.html?data=${dataSection}&product_id=${item}" class="me-4"><i class="fa-solid fa-eye"></i> View</a>
          </div>         
        <div class="text-end">
            <button id="cart_id" data-check_cart="${item}" data-product_id="${item}">
              <i class="fa-solid fa-bag-shopping me-1"></i>Add To Cart
            </button>
        </div>
        </div>
      </div>
    </div>
          `;
      product_row.innerHTML += box;
    }
  }
});

let latest_products = document.querySelector(".products_latest_area");
let latestArr = [];
(function () {
  for (const item in dataCatchedFromDatabase) {
    latestArr.push(dataCatchedFromDatabase[item]);
  }
  let x = latestArr.sort(() => Math.random() - 0.5);
  let container;
  for (let i = 0; i < 6; i++) {
    container = `
    <div class="d-flex align-items-center special_products gap-2 mb-3">
      <div class="image">
        <img src="${x[i].imageUrl}" alt="">
      </div>
      <div class="content">
        <h5>${x[i].pName}</h5>
        <div class="stars mt-2">
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-regular fa-star"></i>
        </div>
        <h5 class="pPrice mt-2">
        $${x[i].pPrice}.00
        </h5>
      </div>
    </div>
    `;
    latest_products.innerHTML += container;
  }
})();
