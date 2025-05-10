//check user login or not 
document.getElementById("user_name").innerHTML=localStorage.getItem("username");
document.getElementById("logout").addEventListener("click", logout); // ✅ Pass the function reference
//logout function 
function logout() {
  // Optionally clear all localStorage (if needed)
  localStorage.clear();

  // Redirect to login page
 window.location.href = "../login_sign_up/login.html";
}

if (!localStorage.getItem("token") || !localStorage.getItem("username")) {
 window.location.href = "../login_sign_up/login.html";
}

// load profile 
const table_alert = document.getElementById("table_alert_msg")
shop_data_load_msg = document.getElementById("shop_data_load_msg")
shop_data_load_msg.style.display = "none"
function fetchStoreProfile() {
    //check user login or not 
    if (!localStorage.getItem("token") || !localStorage.getItem("username")) {
     window.location.href = "../login_sign_up/login.html";
    }

    fetch("https://www.api.storeway.xyz/get-store-profile", {
        method: "GET",
        headers: {
            Authorization: `Token ${localStorage.getItem("token")}`
        }
    })
        .then(res => {
            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error("Unauthorized access.");
                }
                return res.json().then(errData => {
                    if (errData.code === 4001) {
                        throw new Error("Error 4001: Invalid store profile request.");
                    }
                    throw new Error("Unexpected error occurred.");
                });
            }
            return res.json();
        })
        .then(data => {
            document.getElementById("shop_name").textContent = data.store_name;
            document.getElementById("tab_line").textContent = data.store_tagline;
            const storeUrlEl = document.getElementById("shop_url");
            storeUrlEl.href = data.website_url;
            storeUrlEl.textContent = data.website_url;
            document.getElementById("shop_logo").src = data.store_logo_image;

            document.getElementById("total_products").textContent = data.total_products;
            document.getElementById("total_offers").textContent = data.total_offers;

            // Hide error message if it was shown previously
            document.getElementById("shop_data_load_msg").style.display = "none";
        })
        .catch((err) => {
            console.error("Error fetching store profile:", err.message);
            const msgBox = document.getElementById("shop_data_load_msg");
            msgBox.style.display = "block";
            msgBox.innerHTML = err.message;
        });
}



//  toggle button for product and offfers 
document.getElementById("products-tab").addEventListener("click", () => {
    document.getElementById("product-table").style.display = "table";

    document.getElementById("Products-pagination").style.display = "flex";
    document.getElementById("offers-pagination").style.display = "none";

    document.getElementById("offers-table").style.display = "none";
    document.getElementById("products-tab").classList.add("active");
    document.getElementById("offers-tab").classList.remove("active");
});

document.getElementById("offers-tab").addEventListener("click", () => {
    document.getElementById("product-table").style.display = "none";

    document.getElementById("Products-pagination").style.display = "none";
    document.getElementById("offers-pagination").style.display = "flex";

    document.getElementById("offers-table").style.display = "table";
    document.getElementById("offers-tab").classList.add("active");
    document.getElementById("products-tab").classList.remove("active");
});


// Call function on page load
document.addEventListener("DOMContentLoaded", fetchStoreProfile);
// load table data
//check user login or not 
if (!localStorage.getItem("token") || !localStorage.getItem("username")) {
 window.location.href = "../login_sign_up/login.html";
}
const tableBody = document.querySelector("#product-table tbody");
const pageNumberDisplay = document.getElementById("page-number-products");
const prevBtnProduct = document.getElementById("prev-btn-product");
const nextBtnProduct = document.getElementById("next-btn-product");

table_alert.style.display = "none";
const pageSize = 10;
let currentPage = 1;
let totalPages = 1;

function fetchProducts(page) {
    //check user login or not 
    if (!localStorage.getItem("token") || !localStorage.getItem("username")) {
     window.location.href = "../login_sign_up/login.html";
    }
    fetch(`https://www.api.storeway.xyz/get-products?page=${page}&page_size=${pageSize}`, {
        method: "GET",
        headers: {
            "Authorization": `Token ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        }
    })
        .then(res => {
            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error("Unauthorized access.");
                }
                return res.json().then(errData => {
                    if (errData.code === 4001) {
                        throw new Error("Error 4001: Invalid product request.");
                    }
                    throw new Error("An unexpected error occurred while fetching products.");
                });
            }
            return res.json();
        })
        .then(data => {
            populateTable(data.results);

            if (data.count === 0) {
                table_alert.style.display = "block";
                table_alert.innerHTML = "No products to display.";
            } else {
                table_alert.style.display = "none"; // Hide alert if data is found
            }

            totalPages = Math.ceil(data.count / pageSize);
            pageNumberDisplay.textContent = `Page ${currentPage} of ${totalPages}`;
            toggleButtons();
            initTooltips();
        })
        .catch((err) => {
            console.error("Error fetching products:", err.message);
            table_alert.style.display = "block";
            table_alert.innerHTML = err.message;
        });
}


//   trunckat
function truncateText(text, maxLength = 20) {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}
//   

function populateTable(products) {
    //check user login or not 
    if (!localStorage.getItem("token") || !localStorage.getItem("username")) {
     window.location.href = "../login_sign_up/login.html";
    }
    tableBody.innerHTML = "";
    products.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>
         <span data-bs-toggle="tooltip"
                data-bs-html="true"
                data-bs-custom-class="custom-tooltip"
                data-bs-title="<em>${product.product_id}</em>">
                ${truncateText(product.product_id, 10)}
          </span>
         </td>
        <td>
          <span data-bs-toggle="tooltip"
                data-bs-html="true"
                data-bs-custom-class="custom-tooltip"
                data-bs-title="<em>${product.product_name}</em>">
                ${truncateText(product.product_name)}
          </span>
        </td>
        <td>
          <a href="${product.product_url}" 
             target="_blank"
             data-bs-toggle="tooltip" 
             data-bs-html="true" 
             data-bs-custom-class="custom-tooltip"
             data-bs-title="<em>${product.product_url}</em>">
             ${truncateText(product.product_url)}
          </a>
        </td>
        <td>
          <img src="${product.product_image}" alt="Product" width="50" style="border-radius: 4px;">
        </td>
        <td>
          <span data-bs-toggle="tooltip"
                data-bs-html="true"
                data-bs-custom-class="custom-tooltip"
                data-bs-title="<em>${product.categories.join(", ")}</em>">
                ${truncateText(product.categories.join(", "))}
          </span>
        </td>
        <td>₹${product.price}</td>
        <td>
          <span data-bs-toggle="tooltip" 
                data-bs-html="true" 
                data-bs-custom-class="custom-tooltip"
                data-bs-title="<em>${product.product_description}</em>">
                ${truncateText(product.product_description)}
          </span>
        </td>
        <td>${product.product_rating}</td>
        <td>
            <a href="../update_product/update_product.html?id=${product.product_id}" class="btn btn-sm btn-outline-primary">Edit</a>
        </td>
        <td><button class="btn btn-sm btn-outline-danger"  onclick="deleteProduct('${product.product_id}')">Delete</button></td>
        <td><button class="btn btn-sm btn-outline-secondary">View</button></td>
      `;
        const productId = product.product_id;
        const updateProductUrl = new URL("/update_product/update_product.html", window.location.origin);
        updateProductUrl.searchParams.set("id", productId);
        tableBody.appendChild(row);
    });
}
function toggleButtons() {
    prevBtnProduct.disabled = currentPage === 1;
    nextBtnProduct.disabled = currentPage === totalPages;
}

function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(el => new bootstrap.Tooltip(el));
}

// Event Listeners
prevBtnProduct.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        fetchProducts(currentPage);
    }
});

nextBtnProduct.addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
        fetchProducts(currentPage);
    }
});
// offers button handle 
const offerTableBody = document.querySelector("#offers-table tbody");
const offerPageDisplay = document.getElementById("page-number-offers");
const prevBtnOffer = document.getElementById("prev-btn-offer");
const nextBtnOffer = document.getElementById("next-btn-offer");
const offer_alert = document.getElementById("offers_alert_msg");

const offerPageSize = 2;
let currentOfferPage = 1;
let totalOfferPages = 1;

function fetchOffers(page) {
    //check user login or not 
    if (!localStorage.getItem("token") || !localStorage.getItem("username")) {
     window.location.href = "../login_sign_up/login.html";
    }
    fetch(`https://www.api.storeway.xyz/get-offers?page=${page}&page_size=${offerPageSize}`, {
        method: "GET",
        headers: {
            "Authorization": `Token ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        }
    })
        .then(res => {
            if (!res.ok) {
                if (res.status === 401) throw new Error("Unauthorized access.");
                return res.json().then(errData => {
                    throw new Error(errData.message || "Error fetching offers.");
                });
            }
            return res.json();
        })
        .then(data => {
            populateOfferTable(data.results);
            if (data.count === 0) {
                table_alert.style.display = "block";
                table_alert.innerHTML = "No offers to display.";
            } else {
                table_alert.style.display = "none";
            }

            totalOfferPages = Math.ceil(data.count / offerPageSize);
            offerPageDisplay.textContent = `Page ${currentOfferPage} of ${totalOfferPages}`;
            toggleOfferButtons();
        })
        .catch(err => {
            table_alert.style.display = "block";
            table_alert.innerHTML = err.message;
        });
}

function populateOfferTable(offers) {
    //check user login or not 
    if (!localStorage.getItem("token") || !localStorage.getItem("username")) {
     window.location.href = "../login_sign_up/login.html";
    }
    offerTableBody.innerHTML = "";
    offers.forEach(offer => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><span data-bs-toggle="tooltip"
                data-bs-html="true"
                data-bs-custom-class="custom-tooltip"
                data-bs-title="<em>${offer.offer_id}</em>">
                 ${truncateText(offer.offer_id, 10)}
          </span>
           </td>
            <td>
                <span data-bs-toggle="tooltip"
                      data-bs-html="true"
                      data-bs-custom-class="custom-tooltip"
                      data-bs-title="<em>${offer.offer_name}</em>">
                      ${truncateText(offer.offer_name)}
                </span>
            </td>
            <td>
                <a href="${offer.offer_url}" 
                
                   data-bs-toggle="tooltip" 
                   data-bs-html="true" 
                   data-bs-custom-class="custom-tooltip"
                   data-bs-title="<em>${offer.offer_url}</em>">
                   ${truncateText(offer.offer_url)}
                </a>
            </td>
           
            <td>
                <span data-bs-toggle="tooltip"
                      data-bs-html="true"
                      data-bs-custom-class="custom-tooltip"
                      data-bs-title="<em>${offer.categories.join(", ")}</em>">
                      ${truncateText(offer.categories.join(", "))}
                </span>
            </td>
             <td>
                <img src="${offer.offer_image}" alt="Offer" width="50" style="border-radius: 4px;">
            </td>
            <td>
                <span data-bs-toggle="tooltip" 
                      data-bs-html="true" 
                      data-bs-custom-class="custom-tooltip"
                      data-bs-title="<em>${offer.offer_description}</em>">
                      ${truncateText(offer.offer_description)}
                </span>
            </td>
            <td>
            <span data-bs-toggle="tooltip" 
                      data-bs-html="true" 
                      data-bs-custom-class="custom-tooltip"
                      data-bs-title="<em>${offer.offer_start}</em>">
                      ${truncateText(offer.offer_start, 10)}
                </span></td> 
                 <td>
            <span data-bs-toggle="tooltip" 
                      data-bs-html="true" 
                      data-bs-custom-class="custom-tooltip"
                      data-bs-title="<em>${offer.offer_end}</em>">
                      ${truncateText(offer.offer_end, 10)}
                </span></td> 
             <td>
            <a href="../update_offer/update_offer.html?id=${offer.offer_id}" class="btn btn-sm btn-outline-primary">Edit</a>
        </td>
            <td><button class="btn btn-sm btn-outline-danger"onclick="deleteOffer('${offer.offer_id}')">Delete</button></td>
            <td>
                <a href="${offer.offer_url}" target="_blank" class="btn btn-sm btn-outline-secondary">View</a>
            </td>
        `;

        offerTableBody.appendChild(row);
    });

    // 🔁 Re-initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });
}



function toggleOfferButtons() {
    prevBtnOffer.disabled = currentOfferPage === 1;
    nextBtnOffer.disabled = currentOfferPage === totalOfferPages;
}

// Pagination Events
prevBtnOffer.addEventListener("click", () => {
    if (currentOfferPage > 1) {
        currentOfferPage--;
        fetchOffers(currentOfferPage);
    }
});

nextBtnOffer.addEventListener("click", () => {
    if (currentOfferPage < totalOfferPages) {
        currentOfferPage++;
        fetchOffers(currentOfferPage);
    }
});
// 
// Initial Load
fetchProducts(currentPage);
fetchOffers(currentOfferPage); // add this line if not already


//delete product
function deleteProduct(productId) {
    //check user login or not 
    if (!localStorage.getItem("token") || !localStorage.getItem("username")) {
     window.location.href = "../login_sign_up/login.html";
    }
    console.log(productId)
    fetch(`https://www.api.storeway.xyz/delete-product/${productId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Token ${localStorage.getItem("token")}`
        }
    })
        .then(response => {
            return response.json();
        })
        .then(result => {
            alert("Product deleted successfully.");
            console.log("Delete result:", result);
            alert("Product Deleted Successfully");
            location.reload();
        })
        .catch((error) => {
            console.log(error)
            table_alert.style.display = "block";
            table_alert.textContent = `Error deleting product: ${error.message}`;
        })
}



//delete product
function deleteOffer(offerId) {
    //check user login or not 
    if (!localStorage.getItem("token") || !localStorage.getItem("username")) {
     window.location.href = "../login_sign_up/login.html";
    }
    console.log(offerId)
    fetch(`https://www.api.storeway.xyz/delete-offer/${offerId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Token ${localStorage.getItem("token")}`
        }
    })
        .then(response => {
            return response.json();
        })
        .then(result => {
            alert("Offer deleted successfully.");
            console.log("Delete result:", result);
            alert("Offer  Deleted Successfully");
            location.reload();
        })
        .catch((error) => {
            console.log(error)
            table_alert.style.display = "block";
            table_alert.textContent = `Error deleting product: ${error.message}`;
        })
}
