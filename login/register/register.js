import {app} from "../../config/config.js";

import {
  getDatabase,
  ref,
  set
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";



const db = getDatabase();
const auth = getAuth();
let username = document.getElementById("username");
let email = document.getElementById("email");
let password = document.getElementById("password");
let registerBtn = document.getElementById("registerBtn");
let inpts = document.querySelectorAll(".inpts");
let inptValid = document.querySelectorAll(".inptValid");
let alertDiv = document.querySelectorAll(".alertDiv");


registerBtn.addEventListener("click", function (e) {
  registerUser(e);
});
let validEmail;
let validPass;
function registerUser(e) {
  e.preventDefault();
  if (
    username.value.length > 0 &&
    email.value.length > 0 &&
    password.value.length > 0
  ) {

    let regEmail = /^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/g;
    let regPass = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/g;

    if(regPass.test(password.value)){
      validPass = true;
    }else{
      validPass = false;
    }

    if(regEmail.test(email.value)){
      alertDiv[1].innerHTML = "";
      validEmail = true;
    }else{
      validEmail =  false;
      alertDiv[1].innerHTML = "Email is not valid";
    };

    if(validEmail == true && validPass == true){
      
      createUserWithEmailAndPassword(auth, email.value, password.value)
        .then(async (userCredential) => {
          const user = userCredential.user;
          await set(ref(db, 'users/' + user.uid), {
              id: user.uid,
              username: username.value,
              email: email.value
            });
            window.localStorage.setItem("cartNum" , "0");
            window.localStorage.setItem("userObj" , JSON.stringify({id: user.uid, username: username.value}));
            window.location.href = "../../index.html";
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if(errorCode == "auth/email-already-in-use"){
            inptValid[0].innerHTML = "email is registed before!";
          }

        });

    }else{
      if(validEmail == false){
        inptValid[0].innerHTML = "Email is not valid";
      }
      if(validPass == false){
        inptValid[1].innerHTML = "password must have at least single digit, one lowercase, one uppercase and one special character , 6 character or more";
      }
    }

  } else {
    inpts.forEach((el,index)=>{
      if(el.value == ""){
        alertDiv[index].innerHTML = "Input field is required *";
        inptValid[0].innerHTML = ""
      }
    })
  }
}

inpts.forEach((el,index)=>{
  el.addEventListener("input" , (e)=>{
    if(e.target.value.length > 0){
      alertDiv[index].innerHTML = "";
      inptValid[0].innerHTML = "";
    }else{
      alertDiv[index].innerHTML = "Input field is required *";
      inptValid[0].innerHTML = "";
    }
  })
})