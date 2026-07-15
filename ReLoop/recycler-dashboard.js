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
request.status==="accepted"

?

`<button onclick="confirmRequest('${request._id}')">
Confirm Request
</button>`

:

""

}



</div>



`;


});



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

${
request.status==="accepted" && request.chat
?
`
<button onclick="openChat('${request.chat._id}')">
Message Business 💬
</button>
`
:
""
}

function openChat(chatId){

    localStorage.setItem(
        "chatId",
        chatId
    );

    window.location.href="chat.html";

}