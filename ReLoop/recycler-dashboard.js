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



`;

loadUserStats();

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






async function showNotifications(){


document.getElementById("content").innerHTML = `

<h1>
Notifications
</h1>

<p>
Coming soon...
</p>

`;



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