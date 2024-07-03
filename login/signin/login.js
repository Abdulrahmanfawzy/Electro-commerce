import { app } from "../../config/config.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

const db = getDatabase();
let email = document.getElementById("email");
let password = document.getElementById("password");
let loginBtn = document.getElementById("loginBtn");
let inpts = document.querySelectorAll(".inpts");
let alertDiv = document.querySelectorAll(".alertDiv");
let inptValid = document.querySelectorAll(".inptValid");

const auth = getAuth();

loginBtn.addEventListener("click", function (e) {
  checkLoginFun(e);
});

let usernameWait;
let arr = [];
function checkLoginFun(e) {
  e.preventDefault();
  if (email.value.length > 0 && password.value.length > 0) {
    

    signInWithEmailAndPassword(auth, email.value, password.value)
      .then(async (userCredential) => {
        
        async function getData() {
          return new Promise((resolve, reject) => {
            const starCountRef = ref(db, "users/" + userCredential.user.uid);
            onValue(starCountRef, async (snapshot) => {
              const data = await snapshot.val();
              let newObject = {
                id: data.id,
                username: data.username,
              };
              resolve(newObject);
            });
          });
        }
        let x = await getData();
        sweetAlertFun("You are a valid user" , "success");
        window.localStorage.setItem(
          "userObj",
          JSON.stringify({ id: x.id, username: x.username })
        );
        window.location.href = "/index.html";
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(error.message);
        console.log(error.code);
        if(errorCode == "auth/invalid-email"){
          inptValid[0].innerHTML = "Email is not valid";
        }else{
          inptValid[0].innerHTML = "";

        }
        if(errorCode == "auth/too-many-requests"){
          document.querySelector(".popAlert").style.display = "block";
        }
        if (errorCode == "auth/invalid-credential") {
          sweetAlertFun("your email or password is invalid" , "error");
        }
      });
  } else {
    inpts.forEach((el,index)=>{
      if(el.value == ""){
        alertDiv[index].innerHTML = "Input field is required *";
      }
    })
  }
}

inpts.forEach((el, index) => {
  el.addEventListener("input", (e) => {
    if (e.target.value.length > 0) {
      alertDiv[index].innerHTML = "";
    } else {
      alertDiv[index].innerHTML = "Input field is required *";
    }
  });
});


function sweetAlertFun(actionWord , icon) {
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
    icon: icon,
    title: actionWord,
  });
}
