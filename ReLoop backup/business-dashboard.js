// ================= DASHBOARD =================

function showDashboard() {

    const username = localStorage.getItem("username");

    document.getElementById("content").innerHTML = `

        <header>
            <h1>Welcome back, ${username}!</h1>
            <p>Manage your reusable resources.</p>
        </header>

        <section class="stats">

            <div class="card">
                <h2>18</h2>
                <p>Total Listings</p>
            </div>

            <div class="card">
                <h2>43</h2>
                <p>Requests Received</p>
            </div>

            <div class="card">
                <h2>520 kg</h2>
                <p>Waste Shared</p>
            </div>

            <div class="card">
                <h2>12</h2>
                <p>Active Listings</p>
            </div>

        </section>

        <section class="analytics">

            <div class="chart-card">
                <h2>Waste Saved Over Time</h2>
                <canvas id="lineChart"></canvas>
            </div>

            <div class="chart-card">
                <h2>Materials by Category</h2>
                <canvas id="pieChart"></canvas>
            </div>

        </section>
    `;

    loadCharts();
}


// ================= CHARTS =================

function loadCharts() {

    const line = document.getElementById("lineChart");

    new Chart(line, {
        type: "line",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [{
                label: "Waste Saved (kg)",
                data: [40, 70, 95, 120, 160, 220],
                tension: 0.4
            }]
        }
    });

    const pie = document.getElementById("pieChart");

    new Chart(pie, {
        type: "doughnut",
        data: {
            labels: ["Wood", "Plastic", "Metal", "Paper"],
            datasets: [{
                data: [35, 25, 20, 20]
            }]
        }
    });

}


// ================= ADD MATERIAL PAGE =================

function showAddMaterial() {

    document.getElementById("content").innerHTML = `

        <header>
            <h1>Add Material</h1>
            <p>List your leftover materials for others to reuse.</p>
        </header>

        <form id="materialForm">

            <label>Material Name</label>
            <input
                type="text"
                id="materialName"
                required>

            <label>Category</label>
            <select id="category" required>
                <option value="">Select Category</option>
                <option value="Plastic">Plastic</option>
                <option value="Metal">Metal</option>
                <option value="Wood">Wood</option>
                <option value="Paper">Paper</option>
                <option value="Glass">Glass</option>
            </select>

            <label>Quantity (kg)</label>
            <input
                type="number"
                id="quantity"
                required>

            <label>Price Per Kg</label>
            <input
                type="number"
                id="pricePerKg"
                required>

            <label>Location</label>
            <input
                type="text"
                id="location">

            <label>Description</label>
            <textarea id="description"></textarea>

            <br><br>

            <button type="submit">
                Add Material
            </button>

        </form>
    `;
}


// ================= SAVE MATERIAL =================

document.addEventListener("submit", async (e) => {

    if (e.target.id !== "materialForm") return;

    e.preventDefault();

    const materialData = {

        name: document.getElementById("materialName").value,
        category: document.getElementById("category").value,
        quantity: document.getElementById("quantity").value,
        pricePerKg: document.getElementById("pricePerKg").value,
        location: document.getElementById("location").value,
        description: document.getElementById("description").value,
        owner: localStorage.getItem("userId")

    };

    try {

        const response = await fetch("http://localhost:5000/api/materials", {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            },

            body: JSON.stringify(materialData)

        });

        const data = await response.json();

        if (response.ok) {

            alert("Material added successfully!");

            showDashboard();

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error(error);

        alert("Cannot connect to the server.");

    }

});


// ================= SIDEBAR BUTTONS =================

document.getElementById("dashboardBtn").addEventListener("click", showDashboard);

document.getElementById("addMaterialBtn").addEventListener("click", showAddMaterial);

document.getElementById("logoutBtn").addEventListener("click", () => {

    localStorage.clear();

    window.location.href = "login.html";

});


// ================= START APP =================

showDashboard();