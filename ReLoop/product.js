const params = new URLSearchParams(window.location.search);

const productId = params.get("id");

let currentMaterial = null;

async function loadProduct() {

    try {

        const response = await fetch(
            `http://localhost:5000/api/materials/${productId}`
        );


        const material = await response.json();
currentMaterial = material;

        console.log(material);


        // Image

    const mainImage = document.getElementById("mainImage");

const thumbnailContainer =
document.getElementById("thumbnailContainer");


mainImage.src =
material.images?.[0] || "images/default.jpg";



material.images.forEach(image => {


    const img = document.createElement("img");


    img.src = image;


    img.className = "thumbnail";


    img.onclick = () => {

        mainImage.src = image;

    };


    thumbnailContainer.appendChild(img);


});


        // Name

        document.querySelector(".product-info h1").innerText =
            material.name;



        // Business name

        document.querySelector(".company").innerText =
            material.owner?.username || "Business";



        // Details

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
                ${material.location || "Not provided"}
            </p>


            <p>
                <strong>Price:</strong>
                Rs. ${material.pricePerKg}/kg
            </p>

        `;



        // Description

        document.querySelector(".product-info h3 + p").innerText =
            material.description || "No description available";


    }


    catch(error){

        console.log(error);

    }

}


loadProduct();

document
.getElementById("requestMaterialBtn")
.addEventListener("click",()=>{


    document
    .getElementById("requestPopup")
    .style.display="flex";


});



document
.getElementById("closeRequestBtn")
.addEventListener("click",()=>{


    document
    .getElementById("requestPopup")
    .style.display="none";


});



document
.getElementById("sendRequestBtn")
.addEventListener("click",async()=>{


    const requestData = {


        user: localStorage.getItem("userId"),


        business: currentMaterial.owner._id,


        material: currentMaterial._id,


        quantity:
        document.getElementById("requestQuantity").value,


        location:
        document.getElementById("requestLocation").value,


        message:
        document.getElementById("requestMessage").value


    };



    try{


        const response = await fetch(

            "http://localhost:5000/api/requests",

            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify(requestData)

            }

        );



        const data = await response.json();



        if(response.ok){


            alert("Request sent successfully!");


            document
            .getElementById("requestPopup")
            .style.display="none";


        }
        else{


            alert(data.message);


        }


    }catch(error){


        console.log(error);

        alert("Server error");


    }



});