let allMaterials = []; // Store raw API data for live filtering

async function loadMaterials() {
    const productsContainer = document.querySelector(".products");

    try {
        const response = await fetch("http://localhost:5000/api/materials");
        if (!response.ok) throw new Error("Failed to fetch materials");

        allMaterials = await response.json();
        
        renderMaterials(allMaterials);
        setupEventListeners();

    } catch (error) {
        console.error("Error loading materials:", error);
        productsContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px 20px;">
                <h3 style="color: #991b1b; margin-bottom: 8px;">Unable to load materials</h3>
                <p style="color: var(--muted);">Please ensure your backend server is running on port 5000.</p>
            </div>
        `;
    }
}

// Render material cards with clean .product-info wrapper
function renderMaterials(materials) {
    const productsContainer = document.querySelector(".products");
    productsContainer.innerHTML = "";

    if (materials.length === 0) {
        productsContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px 20px; color: var(--muted);">
                <h3>No materials found matching your search criteria.</h3>
            </div>
        `;
        return;
    }

    materials.forEach(material => {
        const card = document.createElement("article");
        card.className = "product-card";

        const imageSrc = material.images?.[0] || 'images/default.jpg';
        const businessName = material.owner?.username || "Verified Business";
        const location = material.location || "Location N/A";
        const category = material.category || "General";
        const priceDisplay = material.pricePerKg ? `Rs. ${material.pricePerKg}/kg` : "Free / Contact";

        card.innerHTML = `
            <img src="${imageSrc}" alt="${material.name}" onerror="this.src='images/default.jpg'">
            <div class="product-info">
                <h3>${material.name}</h3>
                <div class="business">🏢 ${businessName}</div>
                
                <div class="card-tags">
                    <span class="tag">🏷️ ${category}</span>
                    <span class="tag">📍 ${location}</span>
                </div>

                <p>
                    <strong>Quantity:</strong> ${material.quantity} kg available<br>
                    <strong>Price:</strong> ${priceDisplay}
                </p>

                <button class="request-btn">View Product</button>
            </div>
        `;

        // Redirect to detail page
        card.querySelector(".request-btn").addEventListener("click", () => {
            window.location.href = `product.html?id=${material._id}`;
        });

        productsContainer.appendChild(card);
    });
}

// Live Search & Filtering setup
function setupEventListeners() {
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const locationFilter = document.getElementById("locationFilter");
    const quantityFilter = document.getElementById("quantityFilter");
    
    // Popup Controls
    const loginPopup = document.getElementById("loginPopup");
    const closePopupBtn = document.getElementById("closePopup");

    function applyFilters() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const selectedCategory = categoryFilter ? categoryFilter.value : "All Categories";
        const selectedLocation = locationFilter ? locationFilter.value : "All Cities";
        const selectedQuantity = quantityFilter ? quantityFilter.value : "Any Quantity";

        const filtered = allMaterials.filter(m => {
            // Search text match
            const matchesSearch = !searchTerm || 
                m.name?.toLowerCase().includes(searchTerm) || 
                m.category?.toLowerCase().includes(searchTerm) ||
                m.location?.toLowerCase().includes(searchTerm);

            // Category match
            const matchesCategory = selectedCategory === "All Categories" || 
                m.category?.toLowerCase() === selectedCategory.toLowerCase();

            // Location match
            const matchesLocation = selectedLocation === "All Cities" || 
                m.location?.toLowerCase() === selectedLocation.toLowerCase();

            // Quantity range match
            let matchesQuantity = true;
            const qty = Number(m.quantity) || 0;
            if (selectedQuantity === "Below 50 kg") matchesQuantity = qty < 50;
            else if (selectedQuantity === "50–100 kg") matchesQuantity = qty >= 50 && qty <= 100;
            else if (selectedQuantity === "100+ kg") matchesQuantity = qty > 100;

            return matchesSearch && matchesCategory && matchesLocation && matchesQuantity;
        });

        renderMaterials(filtered);
    }

    // Attach listeners
    if (searchInput) searchInput.addEventListener("input", applyFilters);
    if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);
    if (locationFilter) locationFilter.addEventListener("change", applyFilters);
    if (quantityFilter) quantityFilter.addEventListener("change", applyFilters);

    // Popup logic
    if (closePopupBtn && loginPopup) {
        closePopupBtn.addEventListener("click", () => {
            loginPopup.style.display = "none";
        });
    }
}

// Global dashboard redirect helper
function openDashboard() {
    const userLoggedIn = localStorage.getItem("token"); // or your auth check key
    if (userLoggedIn) {
        window.location.href = "dashboard.html";
    } else {
        const popup = document.getElementById("loginPopup");
        if (popup) popup.style.display = "flex";
    }
}

// Initial load on DOM ready
document.addEventListener("DOMContentLoaded", loadMaterials);