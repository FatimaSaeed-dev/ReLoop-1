// ===============================
// BUSINESS DASHBOARD
// ===============================
function showDashboard() {

    const username = localStorage.getItem("username") || "Business";


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

            <div class="card">

<h2 id="acceptedRequests">
0
</h2>

<p>
Accepted Requests
</p>

</div>



<div class="card">

<h2 id="completedRequests">
0
</h2>

<p>
Completed Requests
</p>

</div>
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

            Loading requests...

        </div>


    </section>


    `;


    loadRequests();

    loadDashboardStats();

}




// ===============================
// LOAD REQUESTS
// ===============================


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



        if(!container)
        return;



        if(!Array.isArray(requests)){


            container.innerHTML = `

            <p>
            Could not load requests.
            </p>

            `;

            return;

        }




        if(requests.length === 0){


            container.innerHTML = `

            <p>
            No requests yet.
            </p>

            `;

            return;

        }



        container.innerHTML = "";



        requests.forEach(request=>{


            const materialName =
            request.material?.name || "Material";



            const username =
            request.user?.username || "User";



            const chatId =
            request.chat?._id || request.chat;



            container.innerHTML += `


            <div class="card">


                <h2>
                    ${materialName}
                </h2>



                <p>
                    Requested by:
                    ${username}
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
                    ${request.message || "No message"}
                </p>




                ${
                    request.status === "pending"

                    ?

                    `

                    <button onclick="acceptRequest('${request._id}')">

                    Accept

                    </button>



                    <button onclick="rejectRequest('${request._id}')">

                    Reject

                    </button>

                    `

                    :

                    ""

                }




                ${
                    chatId

                    ?

                    `

                    <button onclick="openChat('${chatId}')">

                    Open Chat 💬

                    </button>

                    `

                    :

                    ""

                }

${
    request.status === "accepted"

    ?

    `

    <button onclick="businessComplete('${request._id}')">

    Mark Exchange Complete ✅

    </button>

    `

    :

    ""

}

            </div>


            `;


        });



    }


    catch(error){


        console.log(
            "Loading requests error:",
            error
        );


    }


}





// ===============================
// DASHBOARD STATS
// ===============================


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



        if(Array.isArray(materials)){


            document.getElementById(
                "totalListings"
            ).innerText = materials.length;



            document.getElementById(
                "activeListings"
            ).innerText = materials.length;



            let total = 0;



            materials.forEach(material=>{


                total += Number(
                    material.quantity || 0
                );


            });



            document.getElementById(
                "wasteShared"
            ).innerText =
            total + " kg";


        }





        const requestResponse =
        await fetch(

        `http://localhost:5000/api/request/business/${ownerId}`

        );



        const requests =
        await requestResponse.json();




        if(Array.isArray(requests)){



            const completed =
            requests.filter(
                request =>
                request.status === "completed"
            ).length;




            const accepted =
            requests.filter(
                request =>
                request.status === "accepted"
            ).length;




            document.getElementById(
                "totalRequests"
            ).innerText =
            requests.length;



            document.getElementById(
                "acceptedRequests"
            ).innerText =
            accepted;



            document.getElementById(
                "completedRequests"
            ).innerText =
            completed;




            console.log(
                "Business Requests:",
                {
                    total: requests.length,
                    accepted,
                    completed
                }
            );


        }



    }


    catch(error){


        console.log(
            "Stats error:",
            error
        );


    }


}

// ===============================
// ADD MATERIAL
// ===============================


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
            Images
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




// ===============================
// ADD MATERIAL SUBMIT
// ===============================


document.addEventListener(
"submit",
async(e)=>{


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

                Authorization:
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


            alert(
                data.message
            );


        }


    }


    catch(error){


        console.log(
            "Adding material error:",
            error
        );


        alert(
            "Server error"
        );


    }


});






// ===============================
// MY LISTINGS
// ===============================


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
        document.getElementById(
            "listingsContainer"
        );



        if(!Array.isArray(materials)){


            container.innerHTML =
            "<p>Unable to load listings</p>";

            return;

        }




        if(materials.length===0){


            container.innerHTML =
            "<p>No listings yet.</p>";

            return;


        }




        container.innerHTML="";



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
                ${material.description || ""}
                </p>




                <button onclick="editMaterial('${material._id}')">

                Edit

                </button>




                <button onclick="deleteMaterial('${material._id}')">

                Delete

                </button>



            </div>



            `;


        });



    }


    catch(error){


        console.log(
            "Listings error:",
            error
        );


    }


}






// ===============================
// DELETE MATERIAL
// ===============================


async function deleteMaterial(id){


    if(!confirm("Delete this material?"))
    return;



    try{


        const response =
        await fetch(

        `http://localhost:5000/api/materials/${id}`,

        {

            method:"DELETE"

        }

        );



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





// ===============================
// EDIT MATERIAL
// ===============================


async function editMaterial(id){


    const name =
    prompt("Material name");


    const quantity =
    prompt("Quantity");


    const pricePerKg =
    prompt("Price per kg");



    try{


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


    catch(error){


        console.log(error);


    }


}

async function showMessages(){

    const userId = localStorage.getItem("userId");


    document.getElementById("content").innerHTML = `

    <header>
        <h1>
        Messages 💬
        </h1>
    </header>


    <div id="chatList">

        Loading chats...

    </div>

    `;



    try{


        const response = await fetch(

            `http://localhost:5000/api/messages/user/${userId}`

        );


        const chats = await response.json();



        console.log("Chats:", chats);



        const container =
        document.getElementById("chatList");



        container.innerHTML = "";



        if(!Array.isArray(chats)){

            throw new Error("Invalid chats response");

        }



        if(chats.length === 0){


            container.innerHTML = `

            <div class="card">

                <p>
                No chats available.
                </p>

            </div>

            `;

            return;

        }





        chats.forEach(chat=>{



            const otherUser =
            chat.participants?.find(
                user => user._id !== userId
            );



            if(!otherUser)
            return;



            container.innerHTML += `


            <div class="card">


                <h3>
                ${otherUser.username}
                </h3>



                <button 
                onclick="openChat('${chat._id}')">

                    Open Chat 💬

                </button>


            </div>


            `;


        });



    }


    catch(error){


        console.log(
            "Messages Error:",
            error
        );


        document.getElementById("chatList").innerHTML = `


        <div class="card">

            <p>
            Chats not loaded.
            </p>

        </div>


        `;


    }


}







async function showNotifications(){


    document.getElementById("content").innerHTML = `


    <header>

        <h1>
        Notifications
        </h1>

    </header>


    <div id="notificationsContainer">

    Loading...

    </div>


    `;


    const userId =
    localStorage.getItem("userId");



    try{


        const response = await fetch(

        `http://localhost:5000/api/notifications/${userId}`

        );



        const notifications =
        await response.json();



        const container =
        document.getElementById(
            "notificationsContainer"
        );



        if(!notifications.length){


            container.innerHTML = `


            <div class="card">

                <p>
                No notifications yet.
                </p>

            </div>


            `;


            return;

        }




        container.innerHTML="";



     container.innerHTML += `


<div class="card">


<h3>
🔔 Notification
</h3>


<p>
${notification.message}
</p>



<button onclick="openNotification('${notification.request?._id}')">

View Request

</button>


</div>


`;



    }

container.innerHTML = "";

notifications.forEach(async(notification)=>{

    container.innerHTML += `

    <div class="card">

        <h3>
            🔔 Notification
        </h3>

        <p>
            ${notification.message}
        </p>

        <small>
            ${new Date(notification.createdAt).toLocaleString()}
        </small>

        <button onclick="openNotification('${notification.request?._id}')">

            View Request

        </button>

    </div>

    `;

    if(!notification.read){

        try{

            await fetch(

                `http://localhost:5000/api/notifications/${notification._id}/read`,

                {

                    method:"PUT"

                }

            );

        }

        catch(error){

            console.log(error);

        }

    }

});

    catch(error){

        console.log(error);


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


    if(!chatId){

        alert(
            "Chat ID missing"
        );

        return;

    }



    localStorage.setItem(
        "chatId",
        chatId
    );



    window.location.href =
    "chat.html";


}

async function businessComplete(id){


    const confirmComplete =
    confirm(
        "Mark this exchange as completed?"
    );


    if(!confirmComplete)
    return;



    try{


        const response =
        await fetch(

        `http://localhost:5000/api/request/${id}/business-confirm`,

        {

            method:"PUT"

        }

        );



        const data =
        await response.json();



        if(response.ok){


            alert(
                "Waiting for recycler confirmation ✅"
            );


            loadRequests();


        }
        else{


            alert(data.message);


        }



    }
    catch(error){


        console.log(error);


        alert(
            "Could not confirm completion"
        );


    }


}
// ===============================
// SIDEBAR BUTTONS
// ===============================


document
.getElementById("dashboardBtn")
.onclick = showDashboard;


document
.getElementById("listingsBtn")
.onclick = showMyListings;


document
.getElementById("addMaterialBtn")
.onclick = showAddMaterial;


document
.getElementById("requestsBtn")
.onclick = loadRequestsPage;


document
.getElementById("messagesBtn")
.onclick = showMessages;


document
.getElementById("notificationsBtn")
.onclick = showNotifications;


document
.getElementById("logoutBtn")
.onclick = ()=>{

    localStorage.clear();

    window.location.href="login.html";

};



// START PAGE

showDashboard();
async function acceptRequest(id){


    try{


        const response = await fetch(

            `http://localhost:5000/api/request/${id}/accept`,

            {
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                }
            }

        );



        const data =
        await response.json();



        if(response.ok){


            alert("Request accepted");


            showDashboard();


        }
        else{


            alert(data.message);


        }


    }
    catch(error){


        console.log(
            "Accept error:",
            error
        );


        alert("Could not accept request");


    }


}
async function rejectRequest(id){


    try{


        const response = await fetch(

            `http://localhost:5000/api/request/${id}/reject`,

            {
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                }
            }

        );



        const data =
        await response.json();



        if(response.ok){


            alert("Request rejected");


            showDashboard();

loadNotificationBadge();


        }
        else{


            alert(data.message);


        }


    }
    catch(error){


        console.log(
            "Reject error:",
            error
        );


        alert("Could not reject request");


    }


}

async function loadNotificationBadge(){


const userId =
localStorage.getItem("userId");



try{


const response = await fetch(

`http://localhost:5000/api/notifications/${userId}`

);



const notifications =
await response.json();



const badge =
document.getElementById(
"notificationBadge"
);



if(!badge)
return;



if(notifications.length > 0){


badge.innerText =
notifications.length;


badge.style.display =
"inline-block";


}
else{


badge.style.display =
"none";


}



}


catch(error){

console.log(
"Badge error:",
error
);

}


}

function openNotification(requestId){


if(!requestId){

alert("Request not found");

return;

}



showRequests();


}