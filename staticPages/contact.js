let inputFirstName = document.getElementById("inputFirstName");
let inputLastName = document.getElementById("inputLastName");
let inputEmail = document.getElementById("inputAddress");
let messageText = document.getElementById("messageText");
let submit = document.getElementById("submit");
let form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  sendData(e);
});

function sendData(e) {
  e.preventDefault();
  if (
    inputFirstName.value != "" &&
    inputLastName.value != "" &&
    inputEmail.value != "" &&
    messageText.value != ""
  ) {
    form.reset();

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
      title: "Your Message has be sent successfully",
    });
  } else {
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
      icon: "warning",
      title: "Fill all Inputs please...",
    });
  }
}
