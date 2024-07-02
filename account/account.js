import { app } from "../config/config.js";
import {
  getDatabase,
  ref,
  onValue,
  get,
  remove,
  update,
  child,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
  EmailAuthProvider,
  updatePassword,
  reauthenticateWithCredential,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

let inputUsername = document.getElementById("inputUsername");
let inputAddress = document.getElementById("inputAddress");
let oldPass = document.getElementById("oldPass");
let inputNewPassword = document.getElementById("inputNewPassword");
let inputNewPassConfirm = document.getElementById("inputNewPassConfirm");
let submit = document.getElementById("submit");
const auth = getAuth(app);
const db = getDatabase();
const dbRef = ref(getDatabase());
let userObject = JSON.parse(localStorage.getItem("userObj"));
let userId = userObject.id;
let spinner = document.querySelector(".spinner");

submit.addEventListener("click", (e) => {
  updateEmailFun(e);
});

// get first and last name of user
get(child(dbRef, `users/` + userId)).then((snapshot) => {
  if (snapshot.exists()) {
      let { username } = snapshot.val();
    if(username){
        spinner.style.display = "none";
    }else{
        spinner.style.display = "block";
    }
    inputUsername.value = username;
  } else {
    console.log("No data available");
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    inputAddress.value = user.email;
  } else {
    // User is signed out
    // ...
  }
});

let validPass;
let inptValid = document.querySelector(".inptValid");

function updateEmailFun(e) {
  e.preventDefault();

  if (inputUsername.value != "") {
    update(ref(db, "users/" + userId), {
      username: inputUsername.value,
    });
    window.localStorage.setItem(
      "userObj",
      JSON.stringify({ id: userId, username: inputUsername.value })
    );
    if (inputUsername.value != userObject.username) {
      alertMessage("data Updated successfully", "success");
    }
  } else {
    alertMessage("username is required", "error");
  }

  if (
    (inputNewPassword.value != "" || inputNewPassConfirm.value != "") &&
    oldPass.value == ""
  ) {
    alertMessage(
      "old password input is required for reset new password",
      "warning"
    );
  }


  if ( oldPass.value != "" &&
    (inputNewPassword.value == "" || inputNewPassConfirm.value == "") 
  ) {
    alertMessage(
      "Fill new password & confirm to reset old password",
      "warning"
    );
  }


  if (
    inputNewPassword.value != "" &&
    inputNewPassConfirm.value != "" &&
    oldPass.value != ""
  ) {

    let regPass = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/g;

    if(regPass.test(inputNewPassword.value)){
      validPass = true;
    }else{
      validPass = false;
    }

    if(validPass == true){
      inptValid.innerHTML = "";
      if (inputNewPassword.value == inputNewPassConfirm.value) {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(
          user.email,
          oldPass.value
        );
  
        reauthenticateWithCredential(user, credential)
          .then(() => {
            // User re-authenticated.
            updatePassword(user, inputNewPassword.value)
              .then(() => {
                alertMessage("Password updated successfully", "sucess");
              })
              .catch((error) => {
                console.log(error.message);
                console.log(error.code);
                if (error.code == "auth/weak-password") {
                  alertMessage(
                    "Password should be at least 6 characters",
                    "warning"
                  );
                }
              });
          })
          .catch((error) => {
            console.log(error.message);
            console.log(error.code);
            if(error.code == "auth/too-many-requests"){
              alertMessage("old password is wrong", "error");
            }
            if (error.code == "auth/invalid-credential") {
              alertMessage("old password is wrong", "error");
            }
          });
      } else {
        alertMessage("password inputs must be had the same value", "warning");
      }

    }else{
      if(validPass == false){
        inptValid.innerHTML = "password must have at least single digit, one lowercase, one uppercase and one special character and at least 6 characters";
      }
    }

    
  }
}

function alertMessage(msg, icon) {
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
    title: msg,
  });
}
