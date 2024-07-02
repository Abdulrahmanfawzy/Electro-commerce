import { app } from "../../config/config.js";
import {
  getDatabase,
  set,
  get,
  child,
  ref,
  remove,
  update,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import {
  getStorage,
  ref as sRef,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";


const db = getDatabase();
const storage = getStorage();

// handle if i click on bars
let bars = document.querySelector(".bars");
let dash_left = document.querySelector(".dash_left");
let dash_right = document.querySelector(".dash_right");
let closeIcon = document.querySelector(".closeIcon");
let pageItem = document.querySelectorAll(".pageItem");
let linkNamesLeft = document.querySelectorAll(".linkName");
let pageItem_active = document.querySelector(".pageItem_active");


const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  console.log(user.email);
  if (!user.email) {
    window.location.href = "../adminLogin/admin.html";
  }
})



bars.addEventListener("click", () => {
  if (window.innerWidth > 768) {
    barsIcon();
  } else {
    barsIconLessMedium();
  }
});

window.onresize = () => {
  if (window.innerWidth > 768) {
    dash_left.style.left = "0px";
  } else {
    dash_left.style.left = "-250px";
  }
};
// window.innerWidth > 768
function barsIcon() {
  if (dash_left.style.left == "-250px") {
    dash_left.style.left = "0px";
    dash_right.classList.remove("dash_active_left_0");
    dash_right.classList.add("dash_active_left_250");
  } else {
    dash_left.style.left = "-250px";
    dash_right.classList.remove("dash_active_left_250");
    dash_right.classList.add("dash_active_left_0");
  }
}

// window.innerWidth < 768

function barsIconLessMedium() {
  dash_left.style.left = "0";
}

closeIcon.addEventListener("click", () => {
  dash_left.style.left = "-250px";
});

// handle display of section when click dash_left links

function displaySections() {
  pageItem.forEach((el) => {
    el.style.display = "none";
  });
}

linkNamesLeft.forEach((el) => {
  el.addEventListener("click", function (e) {
    handleDisplay(e);
  });
});

function handleDisplay(e) {
  displaySections();
  document.querySelector(`[data-section=${e.target.id}]`).style.display =
    "block";
}

// fashion section function

let fashionImage = document.getElementById("fashionImage");
let processFashionDiv = document.querySelector(".processFashionDiv");
let fashionName = document.getElementById("fashionName");
let fashionPrice = document.getElementById("fashionPrice");
let fashionDiscount = document.getElementById("fashionDiscount");
let fashionCategory = document.getElementById("fashionCategory");
let fashionDesc = document.getElementById("fashionDesc");
let fashionBrand = document.getElementById("fashionBrand");
let fashionColor = document.getElementById("fashionColor");
let fashionAddBtn = document.getElementById("fashionAddBtn");
let fashionUpdateBtn = document.getElementById("fashionUpdateBtn");
let fashion_tbody = document.getElementById("fashion_tbody");
let formFashion = document.getElementById("fashionForm");
let fashionLeftLink = document.getElementById("Fashion");

// perfume

let perfumeImage = document.getElementById("perfumeImage");
let processperfumeDiv = document.querySelector(".processperfumeDiv");
let perfumeName = document.getElementById("perfumeName");
let perfumePrice = document.getElementById("perfumePrice");
let perfumeDiscount = document.getElementById("perfumeDiscount");
let perfumeCategory = document.getElementById("perfumeCategory");
let perfumeDesc = document.getElementById("perfumeDesc");
let perfumeBrand = document.getElementById("perfumeBrand");
let perfumeColor = document.getElementById("perfumeColor");
let perfumeAddBtn = document.getElementById("perfumeAddBtn");
let perfumeUpdateBtn = document.getElementById("perfumeUpdateBtn");
let perfume_tbody = document.getElementById("perfume_tbody");
let formperfume = document.getElementById("perfumeForm");
let PerfumeLeftLink = document.getElementById("Perfumes");

// perfume

let AccessioresImage = document.getElementById("AccessioresImage");
let processAccessioresDiv = document.querySelector(".processAccessioresDiv");
let AccessioresName = document.getElementById("AccessioresName");
let AccessioresPrice = document.getElementById("AccessioresPrice");
let AccessioresDiscount = document.getElementById("AccessioresDiscount");
let AccessioresCategory = document.getElementById("AccessioresCategory");
let AccessioresDesc = document.getElementById("AccessioresDesc");
let AccessioresBrand = document.getElementById("AccessioresBrand");
let AccessioresColor = document.getElementById("AccessioresColor");
let AccessioresAddBtn = document.getElementById("AccessioresAddBtn");
let AccessioresUpdateBtn = document.getElementById("AccessioresUpdateBtn");
let Accessiores_tbody = document.getElementById("Accessiores_tbody");
let formAccessiores = document.getElementById("AccessioresForm");
let AccessioresLeftLink = document.getElementById("Accessiores");

// Electronics

let ElectronicsImage = document.getElementById("ElectronicsImage");
let processElectronicsDiv = document.querySelector(".processElectronicsDiv");
let ElectronicsName = document.getElementById("ElectronicsName");
let ElectronicsPrice = document.getElementById("ElectronicsPrice");
let ElectronicsDiscount = document.getElementById("ElectronicsDiscount");
let ElectronicsCategory = document.getElementById("ElectronicsCategory");
let ElectronicsDesc = document.getElementById("ElectronicsDesc");
let ElectronicsBrand = document.getElementById("ElectronicsBrand");
let ElectronicsColor = document.getElementById("ElectronicsColor");
let ElectronicsAddBtn = document.getElementById("ElectronicsAddBtn");
let ElectronicsUpdateBtn = document.getElementById("ElectronicsUpdateBtn");
let Electronics_tbody = document.getElementById("Electronics_tbody");
let formElectronics = document.getElementById("ElectronicsForm");
let ElectronicsLeftLink = document.getElementById("Electronics");

// Phones

let PhonesImage = document.getElementById("PhonesImage");
let processPhonesDiv = document.querySelector(".processPhonesDiv");
let PhonesName = document.getElementById("PhonesName");
let PhonesPrice = document.getElementById("PhonesPrice");
let PhonesDiscount = document.getElementById("PhonesDiscount");
let PhonesCategory = document.getElementById("PhonesCategory");
let PhonesDesc = document.getElementById("PhonesDesc");
let PhonesBrand = document.getElementById("PhonesBrand");
let PhonesColor = document.getElementById("PhonesColor");
let PhonesAddBtn = document.getElementById("PhonesAddBtn");
let PhonesUpdateBtn = document.getElementById("PhonesUpdateBtn");
let Phones_tbody = document.getElementById("Phones_tbody");
let formPhones = document.getElementById("PhonesForm");
let PhonesLeftLink = document.getElementById("Phones");

let documentNameFashion = "fashionSection";
let documentNameperfume = "perfumeSection";
let documentNameAccessiores = "AccessioresSection";
let documentNameElectronics = "ElectronicsSection";
let documentNamePhones = "PhonesSection";

let downloadUrl;
fashionImage.addEventListener("change", async () => {
  downloadUrl = await uploadImage(fashionImage, processFashionDiv);
  console.log(downloadUrl);
});

perfumeImage.addEventListener("change", async () => {
  downloadUrl = await uploadImage(perfumeImage, processperfumeDiv);
  console.log(downloadUrl);
});

AccessioresImage.addEventListener("change", async () => {
  downloadUrl = await uploadImage(AccessioresImage, processAccessioresDiv);
  console.log(downloadUrl);
});

ElectronicsImage.addEventListener("change", async () => {
  downloadUrl = await uploadImage(ElectronicsImage, processElectronicsDiv);
  console.log(downloadUrl);
});

PhonesImage.addEventListener("change", async () => {
  downloadUrl = await uploadImage(PhonesImage, processPhonesDiv);
  console.log(downloadUrl);
});

async function uploadImage(productImage, process) {
  let file = productImage.files[0];
  const storageRef = sRef(storage, `images/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        process.innerHTML = "Upload is " + Math.floor(Number(progress)) + "%";
      },
      (error) => {
        console.log(error.message);
        console.log(error.code);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
}

// fashion add btn
fashionAddBtn.addEventListener("click", (e) =>
  handleFashion({
    even: e,
    productImage: fashionImage,
    productName: fashionName,
    productPrice: fashionPrice,
    productDiscount: fashionDiscount,
    productCategory: fashionCategory,
    productDesc: fashionDesc,
    productBrand: fashionBrand,
    productColor: fashionColor,
    documentName: documentNameFashion,
    formproduct: formFashion,
    processproductDiv: processFashionDiv,
    table_tbody: fashion_tbody,
  })
);

// perfume add btn

perfumeAddBtn.addEventListener("click", (e) =>
  handleFashion({
    even: e,
    productImage: perfumeImage,
    productName: perfumeName,
    productPrice: perfumePrice,
    productDiscount: perfumeDiscount,
    productCategory: perfumeCategory,
    productDesc: perfumeDesc,
    productBrand: perfumeBrand,
    productColor: perfumeColor,
    documentName: documentNameperfume,
    formproduct: formperfume,
    processproductDiv: processperfumeDiv,
    table_tbody: perfume_tbody,
  })
);

// Accessories add btn

AccessioresAddBtn.addEventListener("click", (e) =>
  handleFashion({
    even: e,
    productImage: AccessioresImage,
    productName: AccessioresName,
    productPrice: AccessioresPrice,
    productDiscount: AccessioresDiscount,
    productCategory: AccessioresCategory,
    productDesc: AccessioresDesc,
    productBrand: AccessioresBrand,
    productColor: AccessioresColor,
    documentName: documentNameAccessiores,
    formproduct: formAccessiores,
    processproductDiv: processAccessioresDiv,
    table_tbody: Accessiores_tbody,
  })
);

// Electronics add btn

ElectronicsAddBtn.addEventListener("click", (e) =>
  handleFashion({
    even: e,
    productImage: ElectronicsImage,
    productName: ElectronicsName,
    productPrice: ElectronicsPrice,
    productDiscount: ElectronicsDiscount,
    productCategory: ElectronicsCategory,
    productDesc: ElectronicsDesc,
    productBrand: ElectronicsBrand,
    productColor: ElectronicsColor,
    documentName: documentNameElectronics,
    formproduct: formElectronics,
    processproductDiv: processElectronicsDiv,
    table_tbody: Electronics_tbody,
  })
);

// Phones add btn

PhonesAddBtn.addEventListener("click", (e) =>
  handleFashion({
    even: e,
    productImage: PhonesImage,
    productName: PhonesName,
    productPrice: PhonesPrice,
    productDiscount: PhonesDiscount,
    productCategory: PhonesCategory,
    productDesc: PhonesDesc,
    productBrand: PhonesBrand,
    productColor: PhonesColor,
    documentName: documentNamePhones,
    formproduct: formPhones,
    processproductDiv: processPhonesDiv,
    table_tbody: Phones_tbody,
  })
);

function handleFashion(obj) {
  obj.even.preventDefault();
  if (
    obj.productName.value.length > 0 && // productImage
    obj.productPrice.value.length > 0 &&
    obj.productDiscount.value.length > 0 &&
    obj.productCategory.value.length > 0 &&
    obj.productDesc.value.length > 0 &&
    obj.productBrand.value.length > 0 &&
    obj.productColor.value.length > 0 &&
    obj.productImage.value.length > 0
  ) {
    console.log(obj);
    let time = Date.now();
    if (downloadUrl) {
      set(ref(db, `${obj.documentName}/` + time), {
        productId: time,
        imageUrl: downloadUrl,
        docName: obj.documentName,
        pName: obj.productName.value,
        pPrice: Number(obj.productPrice.value),
        pDiscount: Number(obj.productDiscount.value),
        total:
          Number(obj.productPrice.value) -
          Number(obj.productPrice.value) *
            Number(obj.productDiscount.value / 100),
        pCategory: obj.productCategory.value,
        pDesc: obj.productDesc.value,
        pBrand: obj.productBrand.value,
        pColor: obj.productColor.value,
      });
      getDataFromDatabase(obj.documentName);
      alert("product added successfully");
      setDataIntoTable(obj.table_tbody);
      obj.formproduct.reset();
      obj.processproductDiv.innerHTML = "";
    } else {
      obj.processproductDiv.style.color = "red";
    }
  } else {
    alert("please fill all inputs");
  }
}

let finalDocName;

function getDataFromDatabase(documentName) {
  const starCountRef = ref(db, `${documentName}/`);
  return new Promise((resolve, reject) => {
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      resolve(data);
      finalDocName = documentName;
    });
  });
}

let box;

fashionLeftLink.addEventListener("click", async () => {
  await getDataFromDatabase(documentNameFashion);
  setDataIntoTable(fashion_tbody);
});
PerfumeLeftLink.addEventListener("click", async () => {
  let x = await getDataFromDatabase(documentNameperfume);
  if (x) {
    setDataIntoTable(perfume_tbody);
  }
});
AccessioresLeftLink.addEventListener("click", async () => {
  let x = await getDataFromDatabase(documentNameAccessiores);
  console.log(x);
  if (x) {
    setDataIntoTable(Accessiores_tbody);
  }
});
ElectronicsLeftLink.addEventListener("click", async () => {
  let x = await getDataFromDatabase(documentNameElectronics);
  console.log(x);
  if (x) {
    setDataIntoTable(Electronics_tbody);
  }
});
PhonesLeftLink.addEventListener("click", async () => {
  let x = await getDataFromDatabase(documentNamePhones);
  console.log(x);
  if (x) {
    setDataIntoTable(Phones_tbody);
  }
});
async function setDataIntoTable(table_tbody) {
  let count = 0;
  table_tbody.innerHTML = "";
  let result = await getDataFromDatabase(finalDocName);
  console.log(result);
  if (result) {
    for (let item in result) {
      box = `
      <tr>
        <td>${++count}</td>
        <td><img src="${result[item].imageUrl}" alt="fashion image"/></td>
        <td>${result[item].pName}</td>
        <td>$${result[item].pPrice}.00</td>
        <td>${result[item].pDiscount}%</td>
        <td class="py-3">$${result[item].total}</td>
        <td>${result[item].pCategory}</td>
        <td class="productDescription">${result[item].pDesc}</td>
        <td class="productBrand">${result[item].pBrand}</td>
        <td class="productColor">${result[item].pColor}</td>
        <td>
          <button data-docname= "${result[item].docName}" data-updateid="${item}" class="btn btn-warning text-white">Update</button>
        </td>
        <td>
          <button data-docname="${result[item].docName}" data-deleteid="${item}" class="btn btn-danger">delete</button>
        </td>
    </tr>`;
      table_tbody.innerHTML += box;
    }
  } else {
    console.log("data is not found");
  }
}

document.addEventListener("click", (e) => {
  if (e.target.dataset.docname) {
    if (e.target.dataset.deleteid) {
      // fashionSection
      deleteProductFun(
        +e.target.dataset.deleteid,
        e.target.dataset.docname,
        e.target.parentElement.parentElement.parentElement
      );
    }
  }
  if (e.target.dataset.updateid) {
    if (e.target.dataset.docname == "fashionSection") {
      updateProduct(
        +e.target.dataset.updateid,
        e.target.dataset.docname,
        fashionImage,
        fashionAddBtn,
        fashionUpdateBtn,
        fashionName,
        fashionPrice,
        fashionDiscount,
        fashionCategory,
        fashionDesc,
        fashion_tbody,
        fashionBrand,
        fashionColor,
        formFashion
      );
    }
    if (e.target.dataset.docname == "perfumeSection") {
      updateProduct(
        +e.target.dataset.updateid,
        e.target.dataset.docname,
        perfumeImage,
        perfumeAddBtn,
        perfumeUpdateBtn,
        perfumeName,
        perfumePrice,
        perfumeDiscount,
        perfumeCategory,
        perfumeDesc,
        perfume_tbody,
        perfumeBrand,
        perfumeColor,
        formperfume
      );
    }
    if (e.target.dataset.docname == "AccessioresSection") {
      updateProduct(
        +e.target.dataset.updateid,
        e.target.dataset.docname,
        AccessioresImage,
        AccessioresAddBtn,
        AccessioresUpdateBtn,
        AccessioresName,
        AccessioresPrice,
        AccessioresDiscount,
        AccessioresCategory,
        AccessioresDesc,
        Accessiores_tbody,
        AccessioresBrand,
        AccessioresColor,
        formAccessiores
      );
    }
    if (e.target.dataset.docname == "ElectronicsSection") {
      updateProduct(
        +e.target.dataset.updateid,
        e.target.dataset.docname,
        ElectronicsImage,
        ElectronicsAddBtn,
        ElectronicsUpdateBtn,
        ElectronicsName,
        ElectronicsPrice,
        ElectronicsDiscount,
        ElectronicsCategory,
        ElectronicsDesc,
        Electronics_tbody,
        ElectronicsBrand,
        ElectronicsColor,
        formElectronics
      );
    }
    if (e.target.dataset.docname == "PhonesSection") {
      updateProduct(
        +e.target.dataset.updateid,
        e.target.dataset.docname,
        PhonesImage,
        PhonesAddBtn,
        PhonesUpdateBtn,
        PhonesName,
        PhonesPrice,
        PhonesDiscount,
        PhonesCategory,
        PhonesDesc,
        Phones_tbody,
        PhonesBrand,
        PhonesColor,
        formPhones
      );
    }
  }
});

function deleteProductFun(element_id, docName, tableBody) {
  remove(ref(db, `${docName}/` + element_id))
    .then(() => {
      alert("product deleted successfully");
      setDataIntoTable(tableBody);
    })
    .catch((err) => {
      console.log(err);
    });
}

let updateBtn;

if (updateBtn) {
  updateBtn = updateBtn;
} else {
  updateBtn = "undefined";
}
let globalT_body;
function updateProduct(
  element_id,
  docName,
  image,
  productAddBtn,
  productUpdateBtn,
  productName,
  productPrice,
  productDiscount,
  productCat,
  productDes,
  fashion_tbody,
  productBrand,
  productColor,
  form
) {
  productAddBtn.classList.replace("d-block", "d-none");
  productUpdateBtn.classList.replace("d-none", "d-block");
  image.setAttribute("disabled", true);
  updateBtn = {
    docName: docName,
    element_id: element_id,
    productAddBtn: productAddBtn,
    productUpdateBtn: productUpdateBtn,
    image: image,
    productName: productName,
    productPrice: productPrice,
    productDiscount: productDiscount,
    productCat: productCat,
    productDes: productDes,
    productBrand: productBrand,
    productColor: productColor,
    productForm: form
  };
  globalT_body = fashion_tbody;
  const dbRef = ref(getDatabase());
  get(child(dbRef, `${docName}/` + element_id)).then((snapshot) => {
    let data = snapshot.val();
    productName.value = data.pName;
    productPrice.value = data.pPrice;
    productDiscount.value = data.pDiscount;
    productCat.value = data.pCategory;
    productDes.value = data.pDesc;
    productBrand.value = data.pBrand;
    productColor.value = data.pColor;
  });
}

fashionUpdateBtn.addEventListener("click", (e) => {
  e.preventDefault();
  actualUpdateFun(updateBtn);
});
perfumeUpdateBtn.addEventListener("click", (e) => {
  e.preventDefault();
  actualUpdateFun(updateBtn);
});
AccessioresUpdateBtn.addEventListener("click", (e) => {
  e.preventDefault();
  actualUpdateFun(updateBtn);
});
ElectronicsUpdateBtn.addEventListener("click", (e) => {
  e.preventDefault();
  actualUpdateFun(updateBtn);
});
PhonesUpdateBtn.addEventListener("click", (e) => {
  e.preventDefault();
  actualUpdateFun(updateBtn);
});

function actualUpdateFun(updateBtn) {
  updateBtn.productAddBtn.classList.replace("d-none", "d-block");
  updateBtn.productUpdateBtn.classList.replace("d-block", "d-none");
  updateBtn.image.setAttribute("disabled", true);

  update(ref(db, `${updateBtn.docName}/` + updateBtn.element_id), {
    pName: updateBtn.productName.value,
    pPrice: updateBtn.productPrice.value,
    pDiscount: updateBtn.productDiscount.value,
    total: Math.floor(
      Number(updateBtn.productPrice.value) -
        Number(updateBtn.productPrice.value) *
          Number(updateBtn.productDiscount.value / 100)
    ),
    pCategory: updateBtn.productCat.value,
    pDesc: updateBtn.productDes.value,
    pBrand: updateBtn.productBrand.value,
    pColor: updateBtn.productColor.value,
  }).then(() => {
    updateBtn.productForm.reset();
    updateBtn.image.removeAttribute("disabled");
    setDataIntoTable(globalT_body);
    alert("product updated successfully");
  });
}
