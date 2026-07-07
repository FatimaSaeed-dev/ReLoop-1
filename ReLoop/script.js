<script>
let stats = JSON.parse(localStorage.getItem("reloop_stats")) || {
  biz: 30,
  kg: 9830,
  items: 6850
};

function renderStats(){
  document.getElementById("biz").innerText = stats.biz;
  document.getElementById("kg").innerText = stats.kg;
  document.getElementById("items").innerText = stats.items;
}

function businessJoins(){
  stats.biz += 1;

  save();
  renderStats();
}

function materialReLooped(kgAmount){
  stats.kg += kgAmount;
  stats.items += 1;

  save();
  renderStats();
}

function save(){
  localStorage.setItem("reloop_stats", JSON.stringify(stats));
}

renderStats();

setTimeout(() => businessJoins(), 3000);
setTimeout(() => materialReLooped(120), 5000);
setTimeout(() => materialReLooped(45), 8000);


const requestButtons = document.querySelectorAll(".request-btn");

const popup = document.getElementById("loginPopup");

const closeButton = document.querySelector(".close-btn");

const searchInput = document.getElementById("searchInput");

const cards = document.querySelectorAll(".product-card");

const selects = document.querySelectorAll(".filter-group select");


// =====================================
// LOGIN POPUP
// =====================================

requestButtons.forEach(button => {

    button.addEventListener("click", () => {

        popup.style.display = "flex";

    });

});

closeButton.addEventListener("click", () => {

    popup.style.display = "none";

});

popup.addEventListener("click", (event) => {

    if(event.target === popup){

        popup.style.display = "none";

    }

});


// =====================================
// SEARCH
// =====================================

searchInput.addEventListener("keyup", filterProducts);


// =====================================
// FILTERS
// =====================================

selects.forEach(select => {

    select.addEventListener("change", filterProducts);

});


// =====================================
// MAIN FILTER FUNCTION
// =====================================

function filterProducts(){

    const search = searchInput.value.toLowerCase();

    const category = selects[0].value;

    const location = selects[1].value;

    let visibleProducts = 0;

    cards.forEach(card => {

        const title =
            card.querySelector("h3").textContent.toLowerCase();

        const business =
            card.querySelector(".business").textContent.toLowerCase();

        const text =
            card.textContent.toLowerCase();

        // Search

        const matchesSearch =

            title.includes(search) ||

            business.includes(search) ||

            text.includes(search);


        // Category

        let matchesCategory = true;

        if(category !== "All Categories"){

            matchesCategory =

                title.includes(category.toLowerCase());

        }


        // Location

        let matchesLocation = true;

        if(location !== "All Cities"){

            matchesLocation =

                text.includes(location.toLowerCase());

        }


        if(matchesSearch && matchesCategory && matchesLocation){

            card.style.display = "block";

            visibleProducts++;

        }

        else{

            card.style.display = "none";

        }

    });

    showEmptyMessage(visibleProducts);

}


// =====================================
// EMPTY RESULTS
// =====================================

function showEmptyMessage(number){

    let message = document.getElementById("emptyMessage");

    if(!message){

        message = document.createElement("h2");

        message.id = "emptyMessage";

        message.style.textAlign = "center";

        message.style.marginTop = "50px";

        message.style.color = "#666";

        document.querySelector(".products").after(message);

    }

    if(number === 0){

        message.textContent =

        "No materials match your search.";

    }

    else{

        message.textContent = "";

    }

}
</script>