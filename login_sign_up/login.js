// by default msg is hide
const alert = document.getElementById("alert_custom");
alert.style.display = "none";


document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault(); // prevent default form submit

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("http://192.168.167.91:8000/login", {
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
        localStorage.setItem("username", username);
        window.location.replace("http:/storeway-site/store_profile/login.html");
        // Redirect or other action
      } else {
        alert("Login failed. No token received.");
      }
    })
    .catch((err) => {
      console.log(err.status)
      if (err.status === 400) {
        const alert = document.getElementById("alert_custom");
        const msg = document.getElementById("msg");
        alert.style.display = "block"; // Show the box
        msg.innerHTML = "Invalid username or password"; // Change content
      } 
      else{
        const alert = document.getElementById("alert_custom");
      const msg = document.getElementById("msg");
      alert.style.display = "block"; // Show the box
      msg.innerHTML = "Something went wrong"; // Change content
      }
    });
});
