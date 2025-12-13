//check user login or not 
if (!localStorage.getItem("token") || !localStorage.getItem("username")) {
 window.location.href = "../login_sign_up/login.html";
}


// Base URL for your server
const base_address = "http://127.0.0.1:8000/site/";
const alert = document.getElementById("error_msg");
alert.style.display = "none"
let main_category_msg = document.getElementById("main_category_mag");
let main_id;//main category id -don't change it
main_category_msg.innerHTML = "";

fetch(`${base_address}get-categories/main`)
    .then((response) => response.json()) // parse JSON from response
    .then((data) => {
        console.log(data); // do something with the data
        const select = document.getElementById("main_category");
        data.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.category_id; // set the category ID as value
            option.textContent = category.category_name; // display category name
            select.appendChild(option);
        });
    })
    .catch((error) => {
        main_category_msg.innerHTML = "Unable to get categories";
        console.error("Error:", error);
    });




//get sub  categories load
function sub_category_load() {

    const sub_category_msg = document.getElementById("sub_category_mag");
    sub_category_msg.innerHTML = "";
    const selectElement = document.getElementById("main_category");
    const cat_id = selectElement.value;
    main_id = cat_id;
    // console.log(cat_id);


    // Clear previous subcategories
    document.getElementById("sub_category_container").innerHTML = "";

    // Fetch subcategories based on selected main category ID
    fetch(`${base_address}get-categories/${cat_id}`) // Update URL as needed
        .then((response) => response.json())
        .then((data) => {
            const container = document.getElementById("sub_category_container");
            console.log(data);
            // Divide subcategories into two columns
            const col1 = document.createElement("div");
            col1.className = "col-md-12  col-lg-6";
            const col2 = document.createElement("div");
            col2.className = "col-md-12  col-lg-6";
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
                const space = document.createTextNode(' ');
                targetCol.appendChild(space);
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

// get form data
document.addEventListener("DOMContentLoaded", function () {
    //check user login or not 
    if (!localStorage.getItem("token") || !localStorage.getItem("username")) {
     window.location.href = "../login_sign_up/login.html";
    }
    // get main category
    const form = document.querySelector("form");
    const sub_category_msg = document.getElementById("sub_category_mag");
    sub_category_msg.innerHTML = ""

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get form values
        const storeName = form.querySelector(
            "input[placeholder='Your Store Name']"
        ).value;
        const storeDescription = form.querySelector("textarea").value;
        const category = form.querySelector("select").value;

        const companyName = form.querySelector(
            "input[placeholder='Your company name']"
        ).value;
        const companyAddress = form.querySelector(
            "input[placeholder='Your company address']"
        ).value;
        const tagline = form.querySelector(
            "input[placeholder='Your store tagline']"
        ).value;
        const storeURL = form.querySelector("input[type='url']").value;
        const ordersURL = form.querySelector("#orders_url").value;
        const logo = form.querySelector("input[type='file']").files[0]; // File object
        const phone = form.querySelector("input[type='number']").value;

        //    get subcategories 

        const subCategories = [];
        form.querySelectorAll("input[type='checkbox']:checked").forEach(checkbox => {
            subCategories.push(parseInt(checkbox.id));
        });

        //verify
        if (subCategories.length == 0) {
            sub_category_msg.innerHTML = "Please select minimum one category";
            return
        }
        // get main category
        subCategories.push(parseInt(main_id))
        // console.log(subCategories)

        // Append all fields to FormData (used for file upload)
        formData = new FormData();
        // Append all fields to formData
        formData.append("store_name", storeName);
        formData.append("store_description", storeDescription);
        formData.append("company_name", companyName);
        formData.append("company_address", companyAddress);
        formData.append("store_tagline", tagline);
        formData.append("website_url", storeURL);
        formData.append("orders_url", ordersURL);
        formData.append("store_logo_image", logo);
        formData.append("store_phone_number", phone);
        subCategories.forEach(id => formData.append("category", id));//append category

        //send data to server
        fetch(`${base_address}create-store-profile`, {
            method: "POST",
            headers: {
                Authorization: `Token ${localStorage.getItem("token")}`,
                // 'Content-Type': 'application/json'
            },
            body: formData,
        })
            .then((response) => {
                if (response.status === 401) {
                    // Handle Unauthorized response (Token expired or invalid)
                    alert.style.display = "block";
                    alert.innerHTML = "Session expired. Please log in again.";
                        window.location.href = "../login_sign_up/login.html";

                } else if (response.status === 201) {
                    // Handle successful creation of profile
                    response.json().then((data) => {
                        console.log("Success:", data);
                        if (data.message) {
                            // Profile already created
                            alert.style.display = "flex";
                            alert.innerHTML = "Profile already created.";
                            window.location.href = "../dashboard/dashboard.html";

                        } else {
                            // Redirect to dashboard on successful creation
                            window.location.href = "../dashboard/dashboard.html";
                        }
                    });

                } else if (response.status === 409) {
                    // Handle Duplicate Profile
                    alert.style.display = "block";
                    alert.innerHTML = "Profile already exists. Please login.";
                    window.location.href = "../login_sign_up/login.html";

                } else if (response.status === 400) {
                    // Handle Bad Request (Incorrect or missing data)
                    alert.style.display = "block";
                    alert.innerHTML = "Bad request. Please check the data and try again.";
                    console.log("Bad Request: 400 -", response.status);

                } else {
                    // Handle other unexpected status codes
                    alert.style.display = "block";
                    alert.innerHTML = "Something went wrong.";
                    console.log("Unexpected status code:", response.status);
                }
            })
            .catch((error) => {
                console.log(error);
                alert.style.display = "block";
                alert.innerHTML = "Something went wrong. Please try again later.";
                console.error("Error:", error);
            });


    });

});
