function showDashboard(){

const username = localStorage.getItem("username");

document.getElementById("content").innerHTML = `

<header>

<h1>
Welcome back, ${username}!
</h1>

<p>
Manage your material requests.
</p>

</header>

<section class="stats">

<div class="card">

<h2 id="totalRequests">
0
</h2>

<p>
Requests Sent
</p>

</div>

<div class="card">

<h2 id="acceptedRequests">
0
</h2>

<p>
Accepted
</p>

</div>

<div class="card">

<h2 id="completedRequests">
0
</h2>

<p>
Completed
</p>

</div>

</section>

<section class="requests-section">

<h2>
My Requests
</h2>

<div id="requestsContainer">

Loading...

</div>

</section>

`;

loadUserStats();

showRequestsOnDashboard();

}




async function loadUserStats(){


const userId = localStorage.getItem("userId");


try{


const response = await fetch(

`http://localhost:5000/api/request/user/${userId}`

);



const requests = await response.json();



document.getElementById("totalRequests").innerHTML =
requests.length;



document.getElementById("acceptedRequests").innerHTML =
requests.filter(
r=>r.status==="accepted"
).length;



document.getElementById("completedRequests").innerHTML =
requests.filter(
r=>r.status==="completed"
).length;



}

catch(error){

console.log(error);

}


}





async function showRequests(){


document.getElementById("content").innerHTML = `

<h1>
My Requests
</h1>

<div id="requestsContainer">
Loading...
</div>

`;



const userId = localStorage.getItem("userId");


try{


const response = await fetch(

`http://localhost:5000/api/request/user/${userId}`

);



const requests = await response.json();



const container =
document.getElementById("requestsContainer");



container.innerHTML="";



if(requests.length===0){

container.innerHTML = `

<p>
No requests yet.
</p>

`;

return;

}



requests.forEach(request=>{


container.innerHTML += `


<div class="card">


<h2>
${request.material.name}
</h2>


<p>
Business:
${request.business.username}
</p>


<p>
Quantity:
${request.quantity} kg
</p>


<p>
Status:
${request.status}
</p>



${
request.chat
?
`
<button onclick="openChat('${request.chat._id}')">
Message Business 💬
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

console.log(error);


document.getElementById("requestsContainer").innerHTML = `

<p>
Could not load requests.
</p>

`;

}



}

async function showRequestsOnDashboard(){

const userId = localStorage.getItem("userId");

try{

const response = await fetch(

`http://localhost:5000/api/request/user/${userId}`

);

const requests = await response.json();

const container =
document.getElementById("requestsContainer");

if(!container) return;

container.innerHTML = "";

if(requests.length===0){

container.innerHTML = `

<p>
No requests yet.
</p>

`;

return;

}

requests.forEach(request=>{

    const highlight =
localStorage.getItem("highlightRequest") === request._id;

container.innerHTML += `

<div class="card ${highlight ? "highlight-card" : ""}">

<h3>
${request.material.name}
</h3>

<p>
Business:
${request.business.username}
</p>

<p>
Status:
${request.status}
</p>

</div>

`;

});

localStorage.removeItem(
    "highlightRequest"
);

}
catch(error){

console.log(error);

}
}


async function showNotifications(){

    document.getElementById("content").innerHTML = `

    <h1>
    Notifications
    </h1>

    <div id="notificationsContainer">
        Loading...
    </div>

    `;

    const userId = localStorage.getItem("userId");

    try{

        const response = await fetch(
            `http://localhost:5000/api/notifications/${userId}`
        );

        const notifications = await response.json();

        const container =
        document.getElementById("notificationsContainer");

        container.innerHTML = "";

        if(!notifications.length){

            container.innerHTML = `
                <p>No notifications yet.</p>
            `;

            return;
        }

        notifications.forEach(async(notification)=>{

            container.innerHTML += `

            <div class="card">

                <h3>🔔 Notification</h3>

    <p>${notification.message}</p>

<button onclick="openNotification('${notification.request?._id}')">

View Request

</button>

<small>
    ${new Date(notification.createdAt).toLocaleString()}
</small>

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

    }
    catch(error){

        console.log(error);

        document.getElementById("notificationsContainer").innerHTML = `
            <p>Could not load notifications.</p>
        `;

    }

}






document.getElementById("dashboardBtn")
.onclick=showDashboard;



document.getElementById("requestsBtn")
.onclick=showRequests;



document.getElementById("notificationsBtn")
.onclick=showNotifications;


document.getElementById("messagesBtn")
.onclick=showMessages;


document.getElementById("logoutBtn")
.onclick=()=>{


localStorage.clear();


window.location.href="login.html";


};






showDashboard();








async function confirmRequest(id){


const confirm = window.confirm(
"Confirm this material request?"
);



if(!confirm){

return;

}


try{


const response = await fetch(

`http://localhost:5000/api/request/${id}/confirm`,

{

method:"PUT",

headers:{

"Content-Type":"application/json"

}

}

);




const data = await response.json();



if(response.ok){


alert("Request confirmed!");


showRequests();


}

else{


alert(data.message);


}



}

catch(error){


console.log(error);


alert("Confirmation failed");


}



}






async function showMessages(){

    const userId = localStorage.getItem("userId");


    document.getElementById("content").innerHTML = `

    <h1>
    Messages 💬
    </h1>

    <div id="chatList">

        Loading chats...

    </div>

    `;



    try{


        const response = await fetch(

            `http://localhost:5000/api/messages/user/${userId}`

        );


        const chats = await response.json();



        const container =
        document.getElementById("chatList");



        container.innerHTML = "";



        if(chats.length === 0){

            container.innerHTML = `

            <p>
            No chats yet.
            </p>

            `;

            return;

        }



        chats.forEach(chat=>{


            const otherUser =
            chat.participants.find(
                user => user._id !== userId
            );



            container.innerHTML += `


            <div class="card">


                <h3>
                ${otherUser.username}
                </h3>


                <button onclick="openChat('${chat._id}')">

                Open Chat 💬

                </button>


            </div>


            `;


        });


    }


    catch(error){


        console.log(error);


        document.getElementById("chatList").innerHTML = `

        <p>
        Chats not loaded.
        </p>

        `;


    }


}

function openChat(chatId){

    console.log("Opening chat:", chatId);


    if(!chatId){

        alert("Chat ID missing");

        return;

    }


    localStorage.setItem(
        "chatId",
        chatId
    );


    window.location.href="chat.html";

}

function openNotification(requestId){

    if(!requestId){

        alert("Request not found.");

        return;

    }

    localStorage.setItem(
        "highlightRequest",
        requestId
    );

    showRequests();

}