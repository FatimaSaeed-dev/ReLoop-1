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

function loadCharts() {

    new Chart(document.getElementById("lineChart"), {

        type: "line",

        data: {

            labels: ["Jan","Feb","Mar","Apr","May","Jun"],

            datasets: [{

                label: "Waste Saved (kg)",

                data: [40,70,95,120,160,220],

                borderColor: "#2E7D32",

                backgroundColor: "rgba(46,125,50,.15)",

                fill: true,

                tension: .4

            }]

        }

    });

    new Chart(document.getElementById("pieChart"), {

        type: "doughnut",

        data: {

            labels: ["Wood","Plastic","Metal","Paper"],

            datasets: [{

                data: [35,25,20,20],

                backgroundColor: [

                    "#2E7D32",

                    "#66BB6A",

                    "#81C784",

                    "#A5D6A7"

                ]

            }]

        }

    });

}
function showAddMaterial(){

    document.getElementById("content").innerHTML = `

        <header>

            <h1>Add Material</h1>

            <p>List reusable materials for recyclers.</p>

        </header>

        <form id="materialForm">

            <label>Material Name</label>

            <input
                type="text"
                id="materialName"
                required>

            <label>Category</label>

            <select id="category" required>

                <option value="">Choose Category</option>
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

            <label>Price per Kg</label>

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

            <label>Upload Images</label>

<input
    type="file"
    id="images"
    multiple
    accept="image/*">

            <button type="submit">
                Add Material
            </button>

        </form>

    `;

}

async function showMyListings() {

    document.getElementById("content").innerHTML = `
        <h1>My Listings</h1>
        <div id="listingsContainer">
            Loading...
        </div>
    `;

    try {

        const ownerId = localStorage.getItem("userId");

        const response = await fetch(
            `http://localhost:5000/api/materials/owner/${ownerId}`
        );

        const materials = await response.json();

        const container = document.getElementById("listingsContainer");

        if (materials.length === 0) {

            container.innerHTML = `
                <p>You haven't added any materials yet.</p>
            `;

            return;

        }

        container.innerHTML = "";

materials.forEach(material => {

    container.innerHTML += `

        <div class="card">

            <h2>${material.name}</h2>

            <p><strong>Category:</strong> ${material.category}</p>

            <p><strong>Quantity:</strong> ${material.quantity} kg</p>

            <p><strong>Price:</strong> Rs. ${material.pricePerKg}/kg</p>

            <p><strong>Location:</strong> ${material.location}</p>

            <p>${material.description}</p>


            <button onclick="editMaterial('${material._id}')">
    Edit
</button>


<button onclick="deleteMaterial('${material._id}')">
    Delete
</button>


        </div>

    `;

});

    } catch (error) {

        console.error(error);

        alert("Could not load listings.");

    }

}

document.getElementById("addMaterialBtn")
.addEventListener("click", showAddMaterial);
document.getElementById("dashboardBtn").addEventListener("click", showDashboard);
document.getElementById("listingsBtn").addEventListener("click", showMyListings);
document.getElementById("logoutBtn").addEventListener("click", () => {

    localStorage.clear();

    window.location.href = "login.html";

});

document.addEventListener("submit", async (e) => {

    if (e.target.id !== "materialForm") return;

    e.preventDefault();

const formData = new FormData();


formData.append(
    "name",
    document.getElementById("materialName").value
);


formData.append(
    "category",
    document.getElementById("category").value
);


formData.append(
    "quantity",
    document.getElementById("quantity").value
);


formData.append(
    "pricePerKg",
    document.getElementById("pricePerKg").value
);


formData.append(
    "location",
    document.getElementById("location").value
);


formData.append(
    "description",
    document.getElementById("description").value
);


formData.append(
    "owner",
    localStorage.getItem("userId")
);



const images = document.getElementById("images").files;


for(let i = 0; i < images.length; i++){

    formData.append(
        "images",
        images[i]
    );

}

    try {

        const response = await fetch("http://localhost:5000/api/materials", {

            method: "POST",

            headers: {

                "Authorization": localStorage.getItem("token")

            },

          body: formData

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

        alert("Cannot connect to server.");

    }

});

async function deleteMaterial(id){

    const confirmDelete = confirm(
        "Are you sure you want to delete this material?"
    );


    if(!confirmDelete){
        return;
    }


    try{

        const response = await fetch(
            `http://localhost:5000/api/materials/${id}`,
            {
                method:"DELETE"
            }
        );


        const data = await response.json();


        if(response.ok){

            alert("Material deleted!");

            showMyListings();

        }
        else{

            alert(data.message);

        }


    }
    catch(error){

        console.error(error);

        alert("Delete failed");

    }

}

async function editMaterial(id){

    const name = prompt("Material name:");

    const quantity = prompt("Quantity (kg):");

    const pricePerKg = prompt("Price per kg:");


    if(!name || !quantity || !pricePerKg){

        alert("Please fill all fields");

        return;

    }


    const updatedData = {

        name,

        quantity:Number(quantity),

        pricePerKg:Number(pricePerKg)

    };


    try{

        const response = await fetch(
            `http://localhost:5000/api/materials/${id}`,
            {

                method:"PUT",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify(updatedData)

            }
        );


        const data = await response.json();


        if(response.ok){

            alert("Material updated!");

            showMyListings();

        }
        else{

            alert(data.message);

        }


    }catch(error){

        console.error(error);

        alert("Update failed");

    }

}

showDashboard();