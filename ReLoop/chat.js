const chatId =
localStorage.getItem("chatId");


const userId =
localStorage.getItem("userId");

const chatId = localStorage.getItem("chatId");

if(!chatId){
    alert("No chat selected");
    window.location.href="recycler-dashboard.html";
}
async function loadMessages(){


    const response =
    await fetch(
        `http://localhost:5000/api/messages/${chatId}`
    );


    const messages =
    await response.json();



    const container =
    document.getElementById("messages");



    container.innerHTML="";



    messages.forEach(msg=>{


        container.innerHTML += `


        <div class="message">


            <strong>

            ${msg.sender.username}

            </strong>


            <p>

            ${msg.text}

            </p>


        </div>


        `;


    });


}




async function sendMessage(){


    const text =
    document.getElementById(
        "messageInput"
    ).value;



    if(!text) return;



    await fetch(
        "http://localhost:5000/api/messages",
        {

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                chat:chatId,

                sender:userId,

                text:text

            })

        }
    );



    document.getElementById(
        "messageInput"
    ).value="";


    loadMessages();


}



loadMessages();