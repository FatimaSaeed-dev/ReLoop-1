const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

let currentMaterial = null;

async function loadProduct() {
    if (!productId) return;

    try {
        const response = await fetch(
            `http://localhost:5000/api/materials/${productId}`
        );

        const material = await response.json();
        currentMaterial = material;

        console.log("Current Material:", material);

        // Main & Thumbnail Images
        const mainImage = document.getElementById("mainImage");
        const thumbnailContainer = document.getElementById("thumbnailContainer");

        if (mainImage) {
            mainImage.src = material.images?.[0] || "images/default.jpg";
        }

        if (thumbnailContainer) {
            thumbnailContainer.innerHTML = "";
            material.images?.forEach(image => {
                const img = document.createElement("img");
                img.src = image;
                img.className = "thumbnail";
                img.onclick = () => {
                    mainImage.src = image;
                };
                thumbnailContainer.appendChild(img);
            });
        }

        // Title Name
        const nameHeading = document.querySelector(".product-info h1");
        if (nameHeading) nameHeading.innerText = material.name;

        // Business Name
        const companyPara = document.querySelector(".company");
        if (companyPara) companyPara.innerText = material.owner?.username || "Business";

        // Key Details
        const detailsDiv = document.querySelector(".details");
        if (detailsDiv) {
            detailsDiv.innerHTML = `
                <p><strong>Category:</strong> ${material.category || "General"}</p>
                <p><strong>Available:</strong> ${material.quantity || 0} kg</p>
                <p><strong>Location:</strong> ${material.location || "Not provided"}</p>
                <p><strong>Price:</strong> Rs. ${material.pricePerKg || 0}/kg</p>
            `;
        }

        // Description
        const descPara = document.querySelector(".product-info h3 + p");
        if (descPara) {
            descPara.innerText = material.description || "No description available";
        }

        // Load Real Recommendations
        loadRelatedMaterials(material.category, material._id);

    } catch (error) {
        console.log("Error loading product:", error);
    }
}

// Fetch Real Recommendations from MongoDB
async function loadRelatedMaterials(category, currentId) {
    const productsContainer = document.querySelector(".related .products");
    if (!productsContainer) return;

    try {
        const response = await fetch("http://localhost:5000/api/materials");
        const allMaterials = await response.json();

        // Filter out the product currently being viewed
        let related = allMaterials.filter(item => item._id !== currentId);

        // Optional: Prioritize items in the same category if available
        if (category) {
            const sameCategory = related.filter(item => item.category === category);
            if (sameCategory.length > 0) {
                related = sameCategory;
            }
        }

        // Limit to 3 items
        const itemsToDisplay = related.slice(0, 3);

        if (itemsToDisplay.length === 0) {
            productsContainer.innerHTML = "<p style='color: #6b7280;'>No related materials found at the moment.</p>";
            return;
        }

        // Render Real Product Cards
        productsContainer.innerHTML = itemsToDisplay.map(item => `
            <div class="product-card" onclick="window.location.href='product.html?id=${item._id}'">
                <img src="${item.images?.[0] || 'images/default.jpg'}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p class="business">${item.owner?.username || "Verified Supplier"}</p>
                <p>${item.quantity} kg • Rs. ${item.pricePerKg || 0}/kg</p>
            </div>
        `).join("");

    } catch (error) {
        console.error("Error fetching related materials:", error);
        productsContainer.innerHTML = "<p style='color: #6b7280;'>Unable to load recommendations.</p>";
    }
}

loadProduct();

// Open Request Modal (Or Login Modal if not logged in)
const requestMaterialBtn = document.getElementById("requestMaterialBtn");
const loginPopup = document.getElementById("loginPopup");
const requestPopup = document.getElementById("requestPopup");

if (requestMaterialBtn) {
    requestMaterialBtn.addEventListener("click", () => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            localStorage.setItem("redirectAfterLogin", window.location.href);
            if (loginPopup) loginPopup.style.display = "flex";
        } else {
            if (requestPopup) requestPopup.style.display = "flex";
        }
    });
}

// Close Modals
const closeRequestBtn = document.getElementById("closeRequestBtn");
if (closeRequestBtn) {
    closeRequestBtn.addEventListener("click", () => {
        if (requestPopup) requestPopup.style.display = "none";
    });
}

const closeBtns = document.querySelectorAll(".close-btn");
closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (loginPopup) loginPopup.style.display = "none";
        if (requestPopup) requestPopup.style.display = "none";
    });
});

// Submit Request
const sendRequestBtn = document.getElementById("sendRequestBtn");
if (sendRequestBtn) {
    sendRequestBtn.addEventListener("click", async () => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId) {
            if (requestPopup) requestPopup.style.display = "none";
            localStorage.setItem("redirectAfterLogin", window.location.href);
            if (loginPopup) loginPopup.style.display = "flex";
            return;
        }

        const quantity = document.getElementById("requestQuantity")?.value;
        const location = document.getElementById("requestLocation")?.value;
        const message = document.getElementById("requestMessage")?.value;

        if (!quantity || !location) {
            alert("Please provide both quantity and location.");
            return;
        }

        const requestData = {
            user: userId,
            business: currentMaterial?.owner?._id || currentMaterial?.owner,
            material: currentMaterial?._id,
            quantity: quantity,
            location: location,
            message: message
        };

        try {
            const headers = { "Content-Type": "application/json" };
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch("http://localhost:5000/api/request", {
                method: "POST",
                headers: headers,
                body: JSON.stringify(requestData)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Request sent successfully!");
                if (requestPopup) requestPopup.style.display = "none";
            } else {
                alert(data.message || "Failed to send request.");
            }
        } catch (error) {
            console.log(error);
            alert("Server error. Could not send request.");
        }
    });
}