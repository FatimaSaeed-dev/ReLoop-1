function showDashboard() {

    const username = localStorage.getItem("username");


    document.getElementById("content").innerHTML = `


  <header>

<h1>
Welcome back, ${username}!
</h1>


<p>
Manage your reusable resources.
</p>


</header>



        <section class="stats">


            <div class="card">

                <h2 id="totalListings">
                    0
                </h2>

                <p>
                    Total Listings
                </p>

            </div>



            <div class="card">

                <h2 id="totalRequests">
                    0
                </h2>

                <p>
                    Requests Received
                </p>

            </div>




            <div class="card">

                <h2 id="wasteShared">
                    0 kg
                </h2>

                <p>
                    Waste Shared
                </p>

            </div>



            <div class="card">

                <h2 id="activeListings">
                    0
                </h2>

                <p>
                    Active Listings
                </p>

            </div>


        </section>





        <section class="requests-section">


            <h2>
                Incoming Requests
            </h2>



            <div id="requestsContainer">


                <p>
                    Loading requests...
                </p>


            </div>


        </section>



    `;



    loadRequests();

    loadDashboardStats();


}






async function loadRequests(){


    const businessId =
    localStorage.getItem("userId");



    try{


        const response = await fetch(

            `http://localhost:5000/api/request/business/${businessId}`

        );



        const requests =
        await response.json();




        const container =
        document.getElementById("requestsContainer");



        if(!container) return;




        if(requests.length === 0){


            container.innerHTML = `

                <p>
                    No requests yet.
                </p>

            `;


            return;


        }




        container.innerHTML = "";




        requests.forEach(request => {



            container.innerHTML += `


            <div class="card">


                <h2>

                    ${request.material.name}

                </h2>



                <p>

                    Requested by:
                    ${request.user.username}

                </p>



                <p>

                    Quantity:
                    ${request.quantity} kg

                </p>



                <p>

                    Location:
                    ${request.location}

                </p>



                <p>

                    Message:
                    ${request.message}

                </p>



                <button
onclick="acceptRequest('${request._id}')">

Accept

</button>



<button
onclick="rejectRequest('${request._id}')">

Reject

</button>

<button onclick="openChat('${request.chat}')">
    Open Chat 💬
</button>


            </div>


            `;



        });



    }


    catch(error){


        console.log(error);


    }


}






async function loadDashboardStats(){



    const ownerId =
    localStorage.getItem("userId");



    try{


        const materialResponse =
        await fetch(

            `http://localhost:5000/api/materials/owner/${ownerId}`

        );



        const materials =
        await materialResponse.json();




        document.getElementById("totalListings").innerText =
        materials.length;



        document.getElementById("activeListings").innerText =
        materials.length;



        let total =
        0;



        materials.forEach(material=>{


            total += Number(material.quantity);


        });



        document.getElementById("wasteShared").innerText =
        total + " kg";




        const requestResponse =
        await fetch(

            `http://localhost:5000/api/request/business/${ownerId}`

        );



        const requests =
        await requestResponse.json();



        document.getElementById("totalRequests").innerText =
        requests.length;



    }



    catch(error){


        console.log(error);


    }



}
function showAddMaterial(){


    document.getElementById("content").innerHTML = `


    <header>

        <h1>
            Add Material
        </h1>


        <p>
            List reusable materials for recyclers.
        </p>


    </header>




    <form id="materialForm">


        <label>
            Material Name
        </label>


        <input
        type="text"
        id="materialName"
        required>



        <label>
            Category
        </label>



        <select id="category" required>


            <option value="">
                Choose Category
            </option>


            <option value="Plastic">
                Plastic
            </option>


            <option value="Metal">
                Metal
            </option>


            <option value="Wood">
                Wood
            </option>


            <option value="Paper">
                Paper
            </option>


            <option value="Glass">
                Glass
            </option>


        </select>




        <label>
            Quantity (kg)
        </label>


        <input
        type="number"
        id="quantity"
        required>




        <label>
            Price per Kg
        </label>


        <input
        type="number"
        id="pricePerKg"
        required>




        <label>
            Location
        </label>


        <input
        type="text"
        id="location">




        <label>
            Description
        </label>


        <textarea id="description"></textarea>




        <label>
            Upload Images
        </label>


        <input
        type="file"
        id="images"
        multiple
        accept="image/*">



        <br><br>



        <button type="submit">

            Add Material

        </button>



    </form>


    `;


}








async function showMyListings(){



    document.getElementById("content").innerHTML = `


        <h1>
            My Listings
        </h1>



        <div id="listingsContainer">

            Loading...

        </div>



    `;



    try{


        const ownerId =
        localStorage.getItem("userId");



        const response =
        await fetch(

            `http://localhost:5000/api/materials/owner/${ownerId}`

        );



        const materials =
        await response.json();



        const container =
        document.getElementById("listingsContainer");



        if(materials.length === 0){


            container.innerHTML = `

                <p>
                You have no listings.
                </p>

            `;


            return;


        }



        container.innerHTML = "";




        materials.forEach(material=>{



            container.innerHTML += `



            <div class="card">


                <h2>
                    ${material.name}
                </h2>



                <p>
                Category:
                ${material.category}
                </p>



                <p>
                Quantity:
                ${material.quantity} kg
                </p>



                <p>
                Price:
                Rs.${material.pricePerKg}/kg
                </p>



                <p>
                Location:
                ${material.location}
                </p>



                <p>
                ${material.description}
                </p>



                <button
                onclick="editMaterial('${material._id}')">

                    Edit

                </button>




                <button
                onclick="deleteMaterial('${material._id}')">

                    Delete

                </button>



            </div>



            `;


        });



    }


    catch(error){


        console.log(error);

        alert("Could not load listings");


    }



}









document.addEventListener("submit", async(e)=>{


    if(e.target.id !== "materialForm")
    return;



    e.preventDefault();




    const formData =
    new FormData();




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





    const images =
    document.getElementById("images").files;



    for(let i=0;i<images.length;i++){


        formData.append(
            "images",
            images[i]
        );


    }






    try{


        const response =
        await fetch(

            "http://localhost:5000/api/materials",

            {

                method:"POST",


                headers:{


                    "Authorization":
                    localStorage.getItem("token")


                },


                body:formData

            }


        );



        const data =
        await response.json();




        if(response.ok){


            alert(
                "Material added successfully"
            );


            showDashboard();


        }


        else{


            alert(data.message);


        }



    }



    catch(error){


        console.log(error);

        alert(
            "Server error"
        );


    }



});









async function deleteMaterial(id){



    const confirmDelete =
    confirm(
        "Delete this material?"
    );



    if(!confirmDelete)
    return;




    try{


        const response =
        await fetch(

            `http://localhost:5000/api/materials/${id}`,

            {

                method:"DELETE"

            }

        );



        const data =
        await response.json();



        if(response.ok){


            alert(
                "Material deleted"
            );


            showMyListings();


        }



    }



    catch(error){


        console.log(error);


    }



}









async function editMaterial(id){



    const name =
    prompt("Material name");



    const quantity =
    prompt("Quantity");



    const pricePerKg =
    prompt("Price per kg");




    const response =
    await fetch(

        `http://localhost:5000/api/materials/${id}`,

        {

            method:"PUT",


            headers:{

                "Content-Type":
                "application/json"

            },


            body:JSON.stringify({

                name,

                quantity:Number(quantity),

                pricePerKg:Number(pricePerKg)

            })


        }

    );




    if(response.ok){


        alert(
            "Material updated"
        );


        showMyListings();


    }



}
// ===============================
// BUTTON EVENTS
// ===============================


document
.getElementById("addMaterialBtn")
.addEventListener(
    "click",
    showAddMaterial
);



document
.getElementById("dashboardBtn")
.addEventListener(
    "click",
    showDashboard
);



document
.getElementById("listingsBtn")
.addEventListener(
    "click",
    showMyListings
);

document
.getElementById("notificationsBtn")
.addEventListener(
    "click",
    showNotifications
);

document
.getElementById("requestsBtn")
.addEventListener(
    "click",
    loadRequestsPage
);

document
.getElementById("logoutBtn")
.addEventListener(
"click",
()=>{


    localStorage.clear();


    window.location.href =
    "login.html";


});






// ===============================
// START DASHBOARD
// ===============================


showDashboard();

async function acceptRequest(id){


    try{


        const response =
        await fetch(

        `http://localhost:5000/api/request/${id}/accept`,

        {

            method:"PUT"

        }

        );



        const data =
        await response.json();



        if(response.ok){


            alert(
                "Request accepted"
            );


            loadRequests();


        }



    }
    catch(error){

        console.log(error);

    }


}





async function rejectRequest(id){


    try{


        const response =
        await fetch(

        `http://localhost:5000/api/request/${id}/reject`,

        {

            method:"PUT"

        }

        );



        const data =
        await response.json();



        if(response.ok){


            alert(
                "Request rejected"
            );


            loadRequests();


        }



    }
    catch(error){

        console.log(error);

    }


}

async function showNotifications(){


    document.getElementById("content").innerHTML = `


        <header>

            <h1>
                Notifications
            </h1>

            <p>
                Stay updated with your material requests.
            </p>

        </header>



        <div id="notificationsContainer">

            Loading notifications...

        </div>


    `;



    const userId =
    localStorage.getItem("userId");



    try{


        const response =
        await fetch(

            `http://localhost:5000/api/notifications/${userId}`

        );



        const notifications =
        await response.json();



        const container =
        document.getElementById(
            "notificationsContainer"
        );



        if(notifications.length === 0){


            container.innerHTML = `

                <div class="card">

                    <p>
                    No notifications yet.
                    </p>

                </div>

            `;


            return;


        }




        container.innerHTML = "";



        notifications.forEach(notification=>{


            container.innerHTML += `


            <div class="card">


                <h3>
                🔔 Notification
                </h3>


                <p>

                ${notification.message}

                </p>



                <small>

                ${new Date(
                    notification.createdAt
                ).toLocaleString()}

                </small>


            </div>


            `;


        });



    }


    catch(error){


        console.log(error);


        document.getElementById(
            "notificationsContainer"
        ).innerHTML = `

        <p>
        Could not load notifications.
        </p>

        `;


    }



}

function loadRequestsPage(){


    document.getElementById("content").innerHTML = `


    <header>

        <h1>
        Incoming Requests
        </h1>

    </header>


    <div id="requestsContainer">

        Loading requests...

    </div>


    `;


    loadRequests();


}

function openChat(chatId){

    localStorage.setItem(
        "chatId",
        chatId
    );


    window.location.href="chat.html";

}
