// by default msg is hide
const alert = document.getElementById("alert_custom");
alert.style.display = "none";

// Base URL for your server
const base_address = "https://www.api.storeway.xyz/";


document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault(); // prevent default form submit

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  //remove alert msg ofter click on submit
  alert.innerHTML ="";

  fetch(`${base_address}login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => {
      if (!res.ok) {
        // Manually throw error with status info
        return res.text().then(msg => {
          throw { status: res.status, message: msg };
        });
      } else {
        return res.json();
      }
    })
    .then((data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", username.length>7? username.substring(0, 7) + "..."  : substring);
        checkProfileStatus();
        // Redirect or other action
      } else {
        alert("Login failed. No token received.");
      }
    })
    .catch((err) => {
      console.log(err.status)
      if (err.status === 400) {
        alertBox("Incorrect Username or Password.")

      }
      else {
        alertBox("Something Went Wrong.")
      }
    });
});


//check profile made or not 
// function checkProfileStatus() {
//   fetch(`${base_address}store-profile-status`)
//     .then(response => response.json())
//     .then(data => {
//       if (data.message === "Already has StoreProfile") {
//         console.log("profile exist")
//         // window.location.href = "http:/storeway-site/dashboard/dashboard.html"; // 🔁 Change to your desired page
//       } else {
//         // Redirect if profile does not exist
//                 console.log("profile not exist")
//         // window.location.replace("http:/storeway-site/create_store_profile/create_store_profile.html");
//       }
//     })
//     .catch(error => {
//       alertBox("Something Went Wrong.")

//     });
// }
function checkProfileStatus() {
  const token = localStorage.getItem("token"); // or sessionStorage if you store it there

  if (!token) {
    alertBox("You are not logged in.");

    window.location.href = "../login_sign_up/login.html"; // or your login page
    return;
  }

  fetch(`${base_address}store-profile-status`, {
    headers: {
      "Authorization": `Token ${token}`,  // required for protected endpoints
      "Content-Type": "application/json"
    }
  })
    .then(response => {
      if (response.status === 200) {
        console.log("Profile exists");
        // window.location.href = "http:/storeway-site/login_sign_up/login.html";
        window.location.href = "../dashboard/dashboard.html";
      } else if (response.status === 404) {
        console.log("Profile does not exist");
        window.location.href = "../create_store_profile/create_store_profile.html";
      } else if (response.status === 401) {
        alertBox("Session expired. Please log in again.");
        // window.location.href = "http://storeway-site/login.html";
      } else {
        alertBox("Unexpected response from server.");
        console.log("Status code:", response.status);
      }
    })
    .catch(error => {
      alertBox("Something went wrong.");
      console.error("Error:", error);
    });
}


//alert box
function alertBox(msg) {
  const alert = document.getElementById("alert_custom");
  alert.insertAdjacentHTML('beforeEnd', `
          <div id="alert_custom" class="alert container alert-warning alert-dismissible fade show" role="alert">
        <strong id="msg">${msg}!!!</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
`);
  alert.style.display = "block"; // Show the box

}