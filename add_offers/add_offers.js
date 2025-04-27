// Base URL for your server
const base_address = "http://192.168.95.91:8000/";

// Elements
const alert_msg = document.querySelector(".alert");
alert_msg.style.display = "none";

const offer_add_animation = document.querySelector(".offer_add_animation");
//product adding animation display none
offer_add_animation.style.display = "none";

const offer_time_error_msg = document.getElementById("offer_time_error");
offer_time_error_msg.innerHTML = "";

let main_id = null; // To store main category ID

// Load Main Categories on Page Load
document.addEventListener("DOMContentLoaded", () => {
  loadMainCategories();
});

function loadMainCategories() {
  const mainCategorySelect = document.getElementById("main_category");

  // Load Main Categories on page load
  let main_category_msg = document.getElementById("main_category_mag");
  main_category_msg.innerHTML = "";

  if (!mainCategorySelect) return;

  fetch(`${base_address}get-categories/main`)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.category_id;
        option.textContent = category.category_name;
        mainCategorySelect.appendChild(option);
      });
    })
    .catch((err) => {
      main_category_msg.innerHTML = "Unable to get categories";
      console.error("Failed to load main categories:", err);
    });
}

// Load Subcategories when Main Category Changes
function sub_category_load() {
  const sub_category_msg = document.getElementById("sub_category_mag");
  sub_category_msg.innerHTML = "";

  const selectElement = document.getElementById("main_category");
  const cat_id = selectElement.value;
  main_id = cat_id;

  // Clear previous subcategories
  document.getElementById("sub_category_container").innerHTML = "";

  fetch(`${base_address}get-categories/${cat_id}`)
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("sub_category_container");
      console.log(data);

      const col1 = document.createElement("div");
      col1.className = "col-md-12 col-lg-6";
      const col2 = document.createElement("div");
      col2.className = "col-md-12 col-lg-6";

      data.forEach((subcategory, index) => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `${subcategory.category_id}`;
        checkbox.name = "subcategories";
        checkbox.value = subcategory.category_name;

        const label = document.createElement("label");
        label.setAttribute("for", `${subcategory.id}`);
        label.textContent = subcategory.category_name;

        const br = document.createElement("br");

        const targetCol = index % 2 === 0 ? col1 : col2;

        targetCol.appendChild(checkbox);
        targetCol.appendChild(document.createTextNode(" "));
        targetCol.appendChild(label);
        targetCol.appendChild(br);
      });

      container.appendChild(col1);
      container.appendChild(col2);
    })
    .catch((error) => {
      sub_category_msg.innerHTML = "Unable to load sub-categories";
      console.error("Error fetching subcategories:", error);
    });
}

// Handle Offer Form Submission
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const saveOfferBtn = document.getElementById("saveOffer"); // Add ID to your Save Offer button
  const saveAndAddAnotherBtn = document.getElementById("saveAddAnother"); // Add ID to your Save and Add Another button

  const sub_category_msg = document.getElementById("sub_category_mag");
  sub_category_msg.innerHTML = "";
  offer_time_error_msg.innerHTML = "";
  alert_msg.style.display = "none";

  let stayOnPage = false;

  saveAndAddAnotherBtn.addEventListener("click", function () {
    stayOnPage = true;
    form.requestSubmit(); // Programmatically submit form
  });

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
      "input[placeholder='StoreName OfferName']"
    ).value;
    const offerURL = form.querySelector("input[type='url']").value;
    const offerImage = form.querySelector("input[type='file']").files[0];
    const offerDescription = form.querySelector("textarea").value;
    const offerStart = form.querySelector("input[type='datetime-local']").value;
    const offerEnd = form.querySelectorAll("input[type='datetime-local']")[1]
      .value;

    const subCategories = [];
    form
      .querySelectorAll("input[name='subcategories']:checked")
      .forEach((checkbox) => {
        subCategories.push(parseInt(checkbox.id));
      });
      //subcategory check if zero return msg 
      if (subCategories.length === 0) {
        sub_category_msg.innerHTML = "Please select at least one sub-category.";
        return;
      }
    //get main id
    subCategories.push(parseInt(main_id));
    

    const formData = new FormData();
    if (offerId) formData.append("offer_id", offerId);
    formData.append("offer_name", offerName);
    formData.append("offer_url", offerURL);
    formData.append("offer_image", offerImage);
    formData.append("offer_description", offerDescription);
    formData.append("start_time", offerStart);
    formData.append("end_time", offerEnd);
    subCategories.forEach((id) => formData.append("category", id));

    if (new Date(offerEnd) < new Date(offerStart)) {
      offer_time_error_msg.innerHTML = "Please Enter valid date time";
      return;
    }
    // show offer sending to server animation
    offer_add_animation.style.display = "flex";

    // Send Data
    fetch(`${base_address}add-offer`, {
      method: "POST",
      headers: {
        Authorization: "Token 5897c572c4819afd273a2e10f6905262022a2b8b",
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        offer_add_animation.style.display = "none";
        form.reset();
        sub_category_msg.innerHTML = "";
        if (stayOnPage) {
          form.reset();
        } else {
          window.location.href = "../dashboard.html"; // or wherever you want to go
        }
      })
      .catch((err) => {
        offer_add_animation.style.display = "none";
        alert_msg.style.display = "block";
        sub_category_msg.innerHTML = "";
        alert_msg.innerHTML = "<strong>Something Went Wrong</strong>";
        console.error("Error adding offer:", err);
      });
  });
});
