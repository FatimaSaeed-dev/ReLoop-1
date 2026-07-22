// ===============================
// GLOBAL FUNCTIONS (Navbar & Navigation)
// ===============================
function openDashboard(event) {
    if (event) {
        event.preventDefault(); // Prevent default link jump
    }

    const token = localStorage.getItem("token");
    let role = localStorage.getItem("role");

    // Fallback parsing if user is stored as a JSON string
    if (!role && localStorage.getItem("user")) {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            role = userData ? userData.role : null;
        } catch (e) {
            console.error("Error parsing user data:", e);
        }
    }

    if (!token) {
        // Not logged in -> redirect to signup page
        window.location.href = "signup.html";
    } else if (role === "business") {
        window.location.href = "business-dashboard.html";
    } else if (role === "recycler") {
        window.location.href = "recycler-dashboard.html";
    } else {
        window.location.href = "signup.html";
    }
}


// ===============================
// DOM CONTENT LOADED (Page Initialization)
// ===============================
document.addEventListener("DOMContentLoaded", () => {

    // ===============================
    // LIVE MONGODB STATS
    // ===============================
    async function fetchLiveStats() {
        try {
            const response = await fetch("http://localhost:5000/api/stats");
            
            if (response.ok) {
                const data = await response.json();
                
                const bizEl = document.getElementById("biz");
                const kgEl = document.getElementById("kg");
                const itemsEl = document.getElementById("items");

                if (bizEl) bizEl.innerText = Number(data.biz || 0).toLocaleString();
                if (kgEl) kgEl.innerText = Number(data.kg || 0).toLocaleString();
                if (itemsEl) itemsEl.innerText = Number(data.items || 0).toLocaleString();
            }
        } catch (error) {
            console.error("Error fetching live MongoDB stats:", error);
        }
    }

    // Call live stats on load
    fetchLiveStats();


    // ===============================
    // LOGIN POPUP / MODAL
    // ===============================
    const requestButtons = document.querySelectorAll(".request-btn, .feature-btn");
    const popup = document.getElementById("loginPopup");
    const closeButton = document.querySelector(".close-btn");

    if (popup && closeButton) {
        requestButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                // If button is a popup trigger rather than direct link
                if (button.getAttribute("href") === "#" || !button.getAttribute("href")) {
                    e.preventDefault();
                }
                popup.style.display = "flex";
            });
        });

        closeButton.addEventListener("click", () => {
            popup.style.display = "none";
        });

        popup.addEventListener("click", (event) => {
            if (event.target === popup) {
                popup.style.display = "none";
            }
        });
    }


    // ===============================
    // SEARCH & FILTER (Marketplace / Product Cards)
    // ===============================
    const searchInput = document.getElementById("searchInput");
    const cards = document.querySelectorAll(".product-card");
    const selects = document.querySelectorAll(".filter-group select");

    function filterProducts() {
        if (!searchInput) return;

        const search = searchInput.value.toLowerCase();
        const category = selects[0]?.value || "All Categories";
        const location = selects[1]?.value || "All Cities";

        let visibleProducts = 0;

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();

            const matchesSearch = text.includes(search);
            const matchesCategory = category === "All Categories" || text.includes(category.toLowerCase());
            const matchesLocation = location === "All Cities" || text.includes(location.toLowerCase());

            if (matchesSearch && matchesCategory && matchesLocation) {
                card.style.display = "block";
                visibleProducts++;
            } else {
                card.style.display = "none";
            }
        });

        showEmptyMessage(visibleProducts);
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterProducts);
    }

    selects.forEach(select => {
        select.addEventListener("change", filterProducts);
    });


    // ===============================
    // EMPTY SEARCH MESSAGE
    // ===============================
    function showEmptyMessage(number) {
        let message = document.getElementById("emptyMessage");

        if (!message) {
            message = document.createElement("h2");
            message.id = "emptyMessage";
            message.style.textAlign = "center";
            message.style.marginTop = "50px";
            message.style.color = "#666";

            const productsContainer = document.querySelector(".products");
            if (productsContainer) {
                productsContainer.after(message);
            }
        }

        if (message) {
            message.textContent = number === 0 ? "No materials match your search." : "";
        }
    }

});