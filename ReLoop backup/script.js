document.addEventListener("DOMContentLoaded", () => {

let stats = JSON.parse(localStorage.getItem("reloop_stats")) || {
    biz: 30,
    kg: 9830,
    items: 6850
};


// ===============================
// STATS
// ===============================

function renderStats(){

    document.getElementById("biz").innerText = stats.biz;
    document.getElementById("kg").innerText = stats.kg;
    document.getElementById("items").innerText = stats.items;

}


function save(){

    localStorage.setItem(
        "reloop_stats",
        JSON.stringify(stats)

    );
}



function businessJoins(){

    stats.biz++;

    save();
    renderStats();

}


function materialReLooped(kgAmount){

    stats.kg += kgAmount;
    stats.items++;

    save();
    renderStats();

}


renderStats();


// Remove these if you don't want fake automatic updates
/*
setTimeout(() => businessJoins(),3000);
setTimeout(() => materialReLooped(120),5000);
setTimeout(() => materialReLooped(45),8000);
*/



// ===============================
// LOGIN POPUP
// ===============================


const requestButtons =
document.querySelectorAll(".request-btn");


const popup =
document.getElementById("loginPopup");


const closeButton =
document.querySelector(".close-btn");



if(popup && closeButton){


requestButtons.forEach(button => {

    button.addEventListener("click",()=>{

        popup.style.display="flex";

    });

});


closeButton.addEventListener("click",()=>{

    popup.style.display="none";

});


popup.addEventListener("click",(event)=>{

    if(event.target === popup){

        popup.style.display="none";

    }

});


}



// ===============================
// SEARCH + FILTER
// ===============================


const searchInput =
document.getElementById("searchInput");


const cards =
document.querySelectorAll(".product-card");


const selects =
document.querySelectorAll(".filter-group select");



function filterProducts(){


if(!searchInput) return;


const search =
searchInput.value.toLowerCase();



const category =
selects[0]?.value || "All Categories";


const location =
selects[1]?.value || "All Cities";


let visibleProducts = 0;



cards.forEach(card=>{


const title =
card.querySelector("h3")?.textContent.toLowerCase() || "";


const text =
card.textContent.toLowerCase();



const matchesSearch =
text.includes(search);



const matchesCategory =
category==="All Categories" ||
text.includes(category.toLowerCase());



const matchesLocation =
location==="All Cities" ||
text.includes(location.toLowerCase());



if(
matchesSearch &&
matchesCategory &&
matchesLocation
){

card.style.display="block";

visibleProducts++;

}

else{

card.style.display="none";

}



});


showEmptyMessage(visibleProducts);


}




if(searchInput){

searchInput.addEventListener(
"input",
filterProducts
);

}



selects.forEach(select=>{

select.addEventListener(
"change",
filterProducts
);

});




// ===============================
// EMPTY MESSAGE
// ===============================


function showEmptyMessage(number){


let message =
document.getElementById("emptyMessage");



if(!message){

message =
document.createElement("h2");

message.id="emptyMessage";

message.style.textAlign="center";

message.style.marginTop="50px";

message.style.color="#666";


document.querySelector(".products")
.after(message);

}



if(number===0){

message.textContent=
"No materials match your search.";

}

else{

message.textContent="";

}



}


});

window.openDashboard = function () {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    if (role === "business") {
        window.location.href = "business-dashboard.html";
    } else {
        window.location.href = "recycler-dashboard.html";
    }

};