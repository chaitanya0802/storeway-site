// Get base address
const base_address = "http://127.0.0.1:8000/site/";

//check is token present or not 
if (!localStorage.getItem("token") || !localStorage.getItem("username")) {
    window.location.href = "../login_sign_up/login.html";
}
document.getElementById("user_name").innerHTML = localStorage.getItem("username")

const alert_msg = document.getElementById("error_msg")
//alert_msg display none
alert_msg.style.display = "none"

const offer_add_animation = document.querySelector(".offer_add_animation");
//product adding animation display none
offer_add_animation.style.display = "none";


let productId = "";
const token =localStorage.getItem("token") // Or use a hardcoded token for testing

//det data from server 
document.addEventListener("DOMContentLoaded", () => {

    //check is token present or not 
    if (!localStorage.getItem("token") || !localStorage.getItem("username")) {
        window.location.href = "../login_sign_up/login.html";
    }
    const urlParams = new URLSearchParams(window.location.search);
    productId = urlParams.get("id");



    if (productId && token) {
        fetch(`${base_address}update-product/${productId}`, {
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
                offer_add_animation.style.display = "none";
                populateForm(data);
            })
            .catch(error => {
                offer_add_animation.style.display = "none";
                alert_msg.style.display = "block";
                alert_msg.textContent = `Error loading product: ${error.message}`;
                console.error("Error:", error);
            });
    }
});

function populateForm(product) {

    document.querySelector('input[placeholder="Leave blank for auto ID"]').value = product.product_id || '';
    document.querySelector('input[placeholder="ProductName"]').value = product.product_name || '';
    document.querySelector('input[placeholder="URL to product page"]').value = product.product_url || '';
    document.querySelector('input[placeholder="URL of product image"]').value = product.product_image || '';
    document.querySelector('input[placeholder="Enter price"]').value = product.price || '';
    document.querySelector("#discount_percent").value = product.discount_percent;
    document.querySelector('textarea[placeholder="Enter description"]').value = product.product_description || '';
    document.getElementById("product_rating").value = product.product_rating || '';
    // Additional logic for setting category, sub-category, and image if needed

    console.log("Form populated with product data:", product);
}

document.addEventListener("DOMContentLoaded", function () {
    //check is token present or not 
    if (!localStorage.getItem("token") || !localStorage.getItem("username")) {
        window.location.href = "../login_sign_up/login.html";
    }


    const form = document.querySelector("form");
    const saveProductBtn = document.getElementById("saveProduct");
    error_msg.innerHTML = "";
    error_msg.style.display = "none"

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        // Get Form Values
        const productName = form.querySelector("input[placeholder='ProductName']").value;
        const productURL = form.querySelector("input[type='url']").value;
        const productImage = form.querySelector("#product_image").value;
        const productPrice = form.querySelector("input[placeholder='Enter price']").value;
        const productDiscount = form.querySelector("#discount_percent")?.value || 0;
        const productDescription = form.querySelector("textarea").value;
        const productRating = form.querySelector("#product_rating")?.value || 0;

        // Prepare FormData
        const formData = new FormData();
        if (productId) {
            formData.append("product_id", productId);
        }
        formData.append("product_name", productName);
        formData.append("product_url", productURL);
        if (productImage) {
            formData.append("product_image", productImage);
        }
        formData.append("price", productPrice);
        formData.append("discount_percent", productDiscount);
        formData.append("product_description", productDescription);
        formData.append("product_rating", productRating);

        // show offer sending to server animation
        offer_add_animation.style.display = "flex";

        fetch(`${base_address}update-product/${productId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Token ${token}`
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log("Product created successfully:", data);
                alert("Data updated Successfully");
                window.location.href = "../dashboard/dashboard.html"; // Redirect to another page

            })
            .catch(error => {
                alert_msg.style.display = "block";
                alert_msg.innerHTML = "<strong>Something Went Wrong</strong>";
                console.error("Error creating product:", error);
            });
    });
});
