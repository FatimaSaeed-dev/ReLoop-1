const params = new URLSearchParams(window.location.search);

const productId = params.get("id");


async function loadProduct(){


    try{


        const response = await fetch(
            `http://localhost:5000/api/materials/${productId}`
        );


        const material = await response.json();



        document.querySelector(".product-info h1").innerText =
        material.name;



        document.querySelector(".company").innerText =
        material.owner?.username || "Business";



        document.querySelector(".details").innerHTML = `

            <p>
            <strong>Category:</strong>
            ${material.category}
            </p>


            <p>
            <strong>Available:</strong>
            ${material.quantity} kg
            </p>


            <p>
            <strong>Location:</strong>
            ${material.location}
            </p>


            <p>
            <strong>Price:</strong>
            Rs. ${material.pricePerKg}/kg
            </p>

        `;



        document.querySelector(
            ".product-info > p:last-of-type"
        ).innerText =
        material.description;



        document.querySelector(
            ".product-image img"
        ).src =
        material.images[0];



    }


    catch(error){

        console.log(error);

    }


}



loadProduct();