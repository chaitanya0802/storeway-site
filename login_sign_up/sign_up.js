// Base URL for your server
const base_address = "http://127.0.0.1:8000/site/";
// const base_address = "https://www.api.storeway.xyz/site/";

    //default alert display none
    const alert = document.getElementById('alert_custom');
    alert.style.display = 'none';

//password valid or not check 
document.getElementById('myForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevents the form from submitting
  validatePasswords();    // Calls your custom function
});
function validatePasswords() {
    //default alert display none
    const alert = document.getElementById('alert_custom');
    alert.style.display = 'none';
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("cPassword").value;
    const msg = document.getElementById("pass_msg");

    if (password !== confirm) {
        msg.textContent = " Passwords do not match.";
        return false; // prevent form submission
    }
    else {


        //if password and cpass ok then farther process
        const username = document.getElementById('username');
        const email = username;

        console.log(username.value)
        console.log(email.value)
        const data = { "username": username.value, "email": email.value, "password": password, "role": "Store" };
        fetch(`${base_address}sitesignup`, {
            method: 'POST',  // 👈 Changed from PUT to POST
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => {
                if (res.status === 400) {
                    const alert = document.getElementById('alert_custom');
                    const msg = document.getElementById('msg');
                    alert.style.display = 'block';           // Show the box
                    msg.innerHTML = "User already Exit"; // Change content

                }
                else {
                    return res.json()

                }
            })
            .then(data => {
                // console.log("User created:", data); // 👈 Updated message
                if(data){
                    window.location.href = "../login_sign_up/login.html";

                }
            })
            .catch(err => {
                if(err){
                    const alert = document.getElementById('alert_custom');
                    const msg = document.getElementById('msg');
                    alert.style.display = 'block';           // Show the box
                    msg.innerHTML = "Something went wrong"; // Change contkent
                }
               
            });
    }

    msg.textContent = ""; // clear message if valid
    return false; // allow form submission
}

