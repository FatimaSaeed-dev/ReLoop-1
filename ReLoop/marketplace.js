async function loadMaterials(){

    const products = document.querySelector(".products");


    try {

        const response = await fetch(
            "http://localhost:5000/api/materials"
        );


        const materials = await response.json();


        products.innerHTML = "";


        materials.forEach(material => {


            const card = document.createElement("article");


            card.className = "product-card";


            card.innerHTML = `

                <img 
                src="${material.images?.[0] || 'images/default.jpg'}">


                <h3>
                    ${material.name}
                </h3>


                <p class="business">
                    ${material.owner?.username || "Business"}
                </p>


                <p>
                    📍 ${material.location || "Unknown"}
                </p>


                <p>
                    ${material.quantity} kg Available
                </p>


                <p>
                    Rs. ${material.pricePerKg}/kg
                </p>


                <button class="request-btn">
                    View Product
                </button>

            `;


            products.appendChild(card);



            card.querySelector(".request-btn")
            .addEventListener("click",()=>{


                window.location.href =
                `product.html?id=${material._id}`;


            });


        });


    }


    catch(error){

        console.log(error);

        products.innerHTML =
        "<h3>Unable to load materials</h3>";

    }


}



loadMaterials();