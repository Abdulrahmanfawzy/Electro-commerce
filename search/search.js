import { app } from "../config/config.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

let searchParams = window.location.search;
let realQueryData = new URLSearchParams(searchParams);
let search = realQueryData.get("s"); // search in pages
let arrContainAllProducts = [];
let arrToPrintProducts = [];
let product_row = document.querySelector(".product_row");
let search_div = document.querySelector(".search_div");
let fashion_title = document.querySelector(".fashion_title");
let spinner = document.querySelector(".spinner");

let box;
const db = getDatabase();
const dbRef = ref(getDatabase());
console.log(search);
if (search) {
  onValue(dbRef, async (snapshot) => {
    const allData = await snapshot.val();
    for (const item in allData) {
      if (item != "users") {
        addAllObjectsToArr(allData[item]);
      }
    }
  });
}

function addAllObjectsToArr(data) {
  product_row.innerHTML = "";
  for (const product in data) {
    arrContainAllProducts.push(data[product]);
  }
  applySearchWordWithArr(arrContainAllProducts);
}

function applySearchWordWithArr(arr) {
  arr.forEach((el) => {
    if (el.pName.toLowerCase().includes(search) == true) {
      arrToPrintProducts.push(el);
    }
  });

  fashion_title.innerHTML = `Search results for <span>“${search}”</span>`;
  if (arrToPrintProducts.length != 0) {
    // document.querySelector(".bg_cover").classList.add("mb-5");
    document.querySelector(".search_noProducts").style.display = "none";
    search_div.innerHTML = "";
    let uniqueArrToPrint = [];
    uniqueArrToPrint = arrToPrintProducts.filter(
      (item, index) => arrToPrintProducts.indexOf(item) === index
    );
    spinner.style.display = "none";
    uniqueArrToPrint.forEach((el) => {
      box = `
        <div class="product rounded-2 col-6 col-sm-4 col-md-3 col-lg-2">
          <div class="productImage">
            <img src="${el.imageUrl}" alt="product">
            <div class="off">-${el.pDiscount}% OFF</div>
          </div>
          <div class="p-2">
            <div class="category mt-2">${el.pCategory}</div>
            <div class="product_name mb-1">
              <a href="../productDetails/details.html?data=${
                el.docName
              }&product_id=${el.productId}">${el.pName}</a>
            </div>
            <span class="price me-1">$${Math.trunc(el.total)}.00</span>
            <span class="total_after_discount mb-4 d-inline-block">$${
              el.pPrice
            }.00</span>
          </div>
        </div>
        `;
      search_div.innerHTML += box;
    });
  } else {
    spinner.style.display = "block";
    // document.querySelector(".bg_cover").classList.remove("mb-5");
    document.querySelector(".search_noProducts").style.display = "block";
  }
}
