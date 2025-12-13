// Base URL for your server
const base_address = "http://127.0.0.1:8000/site/";
//check is token present or not 
if (!localStorage.getItem("token") || !localStorage.getItem("username")) {
  window.location.href = "../login_sign_up/login.html";
}

let offerId = "";
const token = localStorage.getItem("token"); // Or use a hardcoded token for testing
// Elements
const alert_msg = document.querySelector(".alert");
alert_msg.style.display = "none";

const offer_time_error_msg = document.getElementById("offer_time_error");
offer_time_error_msg.innerHTML = "";

const offer_add_animation = document.querySelector(".offer_add_animation");
//product adding animation display none
offer_add_animation.style.display = "none";


// get data from server 

//det data from server 
document.addEventListener("DOMContentLoaded", () => {
  //check is token present or not 
  if (!localStorage.getItem("token") || !localStorage.getItem("username")) {
    window.location.href = "../login_sign_up/login.html";
  }
  const urlParams = new URLSearchParams(window.location.search);
  offerId = urlParams.get("id");



  if (offerId && token) {
    fetch(`${base_address}update-offer/${offerId}`, {
      method: "GET",
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        console.log("dfa")
        if (!response.ok) {
          throw new Error(`Failed to fetch product. Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("hii")
        populateForm(data);
      })
      .catch(error => {
        alert_msg.style.display = "block";
        alert_msg.textContent = `Error loading product: ${error.message}`;
        console.error("Error:", error);
      });
  }
});
//convert date into proper format
function convertToISO(value) {
  // Example input: "25 January 2025 at 03:30 PM"
  const cleaned = value.replace(" at ", " ");
  const date = new Date(cleaned);
  if (isNaN(date.getTime())) {
    console.error("Invalid date format:", value);
    return "";
  }
  return date.toISOString().slice(0, 16); // format for datetime-local
}

function populateForm(offer) {
  document.querySelector('input[placeholder="Leave blank for auto ID"]').value = offer.offer_id || '';
  document.querySelector('input[ placeholder="OfferName"]').value = offer.offer_name || '';
  document.querySelector('input[ placeholder="URL to offer page"]').value = offer.offer_url || '';
  document.querySelector('input[ placeholder="URL of offer image"]').value = offer.offer_image || '';
  form.querySelector("textarea").value = offer.offer_description;
  //start date

  let formatted = convertToISO(offer.offer_start);
  form.querySelector("input[type='datetime-local']").value = formatted;
  form.querySelectorAll("input[type='datetime-local']")[1].value = convertToISO(offer.offer_end);
  ;
  // Additional logic for setting category, sub-category, and image if needed
}



// Handle Offer Form Submission
document.addEventListener("DOMContentLoaded", function () {
  //check is token present or not 
  if (!localStorage.getItem("token") || !localStorage.getItem("username")) {
    window.location.href = "../login_sign_up/login.html";
  }
  const form = document.querySelector("form");
  const saveOfferBtn = document.getElementById("saveOffer"); // Add ID to your Save Offer button
  const saveAndAddAnotherBtn = document.getElementById("saveAddAnother"); // Add ID to your Save and Add Another button

  const sub_category_msg = document.getElementById("sub_category_mag");
  offer_time_error_msg.innerHTML = "";
  alert_msg.style.display = "none";



  // If Save Product clicked
  saveOfferBtn.addEventListener("click", function () {
    stayOnPage = false;
    // form submit naturally by 'submit' button
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const offerId = form.querySelector(
      "input[placeholder='Leave blank for auto ID']"
    ).value;
    const offerName = form.querySelector(
      "input[placeholder='OfferName']"
    ).value;
    const offerURL = form.querySelector("input[id='ourl']").value;
    const offerImage = form.querySelector("input[id='oimg']").value;
    const offerDescription = form.querySelector("textarea").value;
    const offerStart = form.querySelector("input[type='datetime-local']").value;
    const offerEnd = form.querySelectorAll("input[type='datetime-local']")[1]
      .value;

    console.log(offerStart)

    const formData = new FormData();
    if (offerId) formData.append("offer_id", offerId);
    formData.append("offer_name", offerName);
    formData.append("offer_url", offerURL);
    formData.append("offer_image", offerImage);
    formData.append("offer_description", offerDescription);
    formData.append("start_time", offerStart);
    formData.append("end_time", offerEnd);

    if (new Date(offerEnd) < new Date(offerStart)) {
      offer_time_error_msg.innerHTML = "Please Enter valid date time";
      return;
    }
    // show offer sending to server animation
    offer_add_animation.style.display = "flex";

    // Send Data

    console.log(offerId)
    fetch(`${base_address}update-offer/${offerId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Token ${token}`
      },
      body: formData
    })
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data) => {
        offer_add_animation.style.display = "none";
        alert("Offer Updated Successfully");
        window.location.href = "../dashboard/dashboard.html";
      })
      .catch((err) => {
        offer_add_animation.style.display = "none";
        alert_msg.style.display = "block";
        alert_msg.innerHTML = "<strong>Something Went Wrong</strong>";
        console.error("Error Updating offer:", err);
      });
  });
});
