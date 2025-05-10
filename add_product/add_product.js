// Base URL for your server
const base_address = "https://www.api.storeway.xyz/";

//check is token present or not 
if (!localStorage.getItem("token") || !localStorage.getItem("username")) {
  window.location.href = "../login_sign_up/login.html";
}
document.getElementById("user_name").innerHTML = localStorage.getItem("username")



const productAddAnimation = document.querySelector(".product_add_animation");
//product adding animation display none
productAddAnimation.style.display = "none";

const alert_msg = document.querySelector(".alert")
//alert_msg display none
alert_msg.style.display = "none"

// Load Main Categories on page load
let main_category_msg = document.getElementById("main_category_mag");
let main_id; // main category id
main_category_msg.innerHTML = "";


fetch(`${base_address}get-categories/main`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const select = document.getElementById("main_category");
        data.forEach(category => {
            const option = document.createElement("option");
            option.value = category.category_id;
            option.textContent = category.category_name;
            select.appendChild(option);
        });
    })
    .catch(error => {
        main_category_msg.innerHTML = "Unable to get categories";
        console.error("Error:", error);
    });


// Load Sub Categories when Main Category changes
function sub_category_load() {

    const sub_category_msg = document.getElementById("sub_category_mag");
    sub_category_msg.innerHTML = "";

    const selectElement = document.getElementById("main_category");
    const cat_id = selectElement.value;
    main_id = cat_id;

    // Clear previous subcategories
    document.getElementById("sub_category_container").innerHTML = "";

    fetch(`${base_address}get-categories/${cat_id}`)
        .then(response => response.json())
        .then(data => {
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
                targetCol.appendChild(document.createTextNode(' '));
                targetCol.appendChild(label);
                targetCol.appendChild(br);
            });

            container.appendChild(col1);
            container.appendChild(col2);
        })
        .catch(error => {
            sub_category_msg.innerHTML = "Unable to load sub-categories";
            console.error("Error fetching subcategories:", error);
        });
}


document.addEventListener("DOMContentLoaded", function () {

    if (!localStorage.getItem("token") || !localStorage.getItem("username")) {
        window.location.href = "../login_sign_up/login.html";
    }

    const form = document.querySelector("form");
    const saveAddAnotherBtn = document.getElementById("saveAddAnother");
    const saveProductBtn = document.getElementById("saveProduct");
    const sub_category_msg = document.getElementById("sub_category_mag");
    sub_category_msg.innerHTML = "";
    alert_msg.style.display = "none"

    let stayOnPage = false; // By default redirect
    // If Save and Add Another clicked
    saveAddAnotherBtn.addEventListener("click", function () {
        stayOnPage = true;
        form.requestSubmit(); // Programmatically submit form
    });

    // If Save Product clicked
    saveProductBtn.addEventListener("click", function () {
        stayOnPage = false;
        // form submit naturally by 'submit' button
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get Form Values
        const productId = form.querySelector("input[placeholder='Leave blank for auto ID']").value;
        const productName = form.querySelector("input[placeholder='ProductName']").value;
        const productURL = form.querySelector("input[type='url']").value;
        const productImage = form.querySelector("input[type='file']").files[0];
        const productPrice = form.querySelector("input[placeholder='Enter price']").value;
        const productDescription = form.querySelector("textarea").value;
        const productRating = form.querySelector("#product_rating")?.value || 0;

        const subCategories = [];
        form.querySelectorAll("input[name='subcategories']:checked").forEach(checkbox => {
            subCategories.push(parseInt(checkbox.id));
        });

        if (subCategories.length === 0) {
            sub_category_msg.innerHTML = "Please select at least one sub-category.";
            return;
        }

        subCategories.push(parseInt(main_id));

        // Prepare FormData
        const formData = new FormData();
        if (productId) {
            formData.append("product_id", productId);
        }
        formData.append("product_name", productName);
        formData.append("product_url", productURL);
        formData.append("product_image", productImage);
        formData.append("price", productPrice);
        formData.append("product_description", productDescription);
        formData.append("product_rating", productRating);
        subCategories.forEach(id => formData.append("category", id));

        // Show animation
        productAddAnimation.style.display = "flex";

        fetch(`${base_address}add-product`, {
            method: "POST",
            headers: {
                Authorization: `Token ${localStorage.getItem("token")}`
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log("Product created successfully:", data);
                alert(data.message);
                productAddAnimation.style.display = "none";

                if (stayOnPage) {
                    form.reset(); // Stay on the page and clear the form
                } else {
                    window.location.href = "../dashboard/dashboard.html"; // Redirect to another page
                }
            })
            .catch(error => {
                productAddAnimation.style.display = "none";
                alert_msg.style.display = "block";
                alert_msg.innerHTML = "<strong>Something Went Wrong</strong>";
                console.error("Error creating product:", error);
            });
    });
});
