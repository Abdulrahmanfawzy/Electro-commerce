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

let wishlist_parent = document.querySelector(".wishlist_parent");
let wishlist_body = document.querySelector("#wishlist_body");
let spinner = document.querySelector(".spinner");

let userObject = JSON.parse(localStorage.getItem("userObj"));
let userId = userObject.id;
let box;
const db = getDatabase();
const dbRef = ref(getDatabase());

async function getWishlistData() {
  let arr = [];
  return new Promise((resolve) => {
    onValue(ref(db, `users/${userId}/wishlist/`), async (snapshot) => {
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

async function printIntoPage() {
  let dataReturned = await getWishlistData();
  wishlist_body.innerHTML = "";
  if (dataReturned) {
    spinner.style.display = "none";

    dataReturned.forEach((el) => {
      box = `
        <tr class="position-relative border-bottom">
          
            <td class="py-3 text-center closeIconWishlist">
                <i id="closeIconWishlistId" data-docname="${el.docName}" data-product_id="${el.productId}" class="fa-solid fa-xmark"></i>
            </td>
            <td class="py-3"><img id="product_img" src="${el.imageUrl}" alt="${el.pName}"/></td>
            <td class="py-3">${el.pName}</td>
            <td class="py-3">
                <span class="pPrice">$${el.pPrice}.00</span>
                <span class="pTotl">$${el.total}.00</span>
            </td>
            <td class="py-3">In Stock</td>
            <td class="py-3">
            <button id="cart_id" data-docname="${el.docName}" data-check_wishlist="${el.productId}" data-product_id="${el.productId}" class="me-3 border py-3 px-4 bg-transparent">
                <i class="fa-solid fa-bag-shopping me-2"></i>Add To Cart
            </button>
            </td>
        </tr>
                
                `;
      wishlist_body.innerHTML += box;
    });
  }else{
    spinner.style.display = "flex";
  }
}

printIntoPage();

function noProductsFound() {
  wishlist_parent.innerHTML = `
    <div class="text-center no_product_img">
        <h3>No Products In My  Wishlist</h3>
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
});


async function getObjectFirebase(id) {
  let wishNum = document.querySelector(".wishNum");
  wishNum.innerHTML = +wishNum.innerHTML - 1;
  remove(ref(db, `users/${userId}/wishlist/` + id)).then(async (result) => {
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

function addToCartFun(e, sectionName) {
  let productId = +e.target.dataset.product_id;
  // get product object when click add to cart
  get(child(dbRef, `${sectionName}/` + productId)).then((snapshot) => {
    if (snapshot.exists()) {
      setProductObjectInCart(snapshot.val());
    } else {
      console.log("No data available");
    }
  });
  let num = document.querySelector(".cartNum");

  function setProductObjectInCart(data) {
    let str = e.target.innerHTML.search("Add To Cart");
    if (e.target.innerText == "Add To Cart") {
      num.innerHTML = +num.innerHTML + 1;
      e.target.innerHTML =
        '<i class="fa-solid fa-bag-shopping me-1"></i>Remove Cart';
      set(ref(db, `users/${userId}/cart/` + productId), data)
        .then((result) => {
          sweetAlertFun("product added to cart")
        })
        .catch((err) => {
          console.log(err.code);
        });
    } else {
      num.innerHTML = +num.innerHTML - 1;
      e.target.innerHTML =
        '<i class="fa-solid fa-bag-shopping me-1"></i>Add To Cart';
      remove(ref(db, `users/${userId}/cart/` + productId)).then((result) => {
        sweetAlertFun("product removed from cart");
      });
    }
  }
}


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


(function () {
  let arr = [];
  onValue(ref(db, `users/${userId}/cart/`), async (snapshot) => {
    const cartData = await snapshot.val();
    let cartItems = document.querySelectorAll(`[data-product_id]`);
    console.log(cartItems);
    for (const item in cartData) {
      arr.push(cartData[item]);
      cartItems.forEach((el) => {
        if (+el.dataset.check_wishlist == cartData[item].productId) {
          el.innerHTML =
            '<i class="fa-solid fa-bag-shopping me-1"></i> Remove From Cart';
        }
      });
    }
    let num = arr.length;
    window.localStorage.setItem("cartNum", JSON.stringify(num));
  });
})();
