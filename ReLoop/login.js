document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const role = document.getElementById("role").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                role,
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("LOGIN SUCCESS", data);

            // Save login information
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.user.username);
            localStorage.setItem("email", data.user.email);
            localStorage.setItem("role", data.user.role);
            localStorage.setItem("userId", data.user.id || data.user._id);

            Swal.fire({
                icon: 'success',
                title: 'Login Successful!',
                text: 'Welcome back!',
                timer: 1400,
                showConfirmButton: false
            }).then(() => {
                // Check if user was attempting to request a product before logging in
                const redirectUrl = localStorage.getItem("redirectAfterLogin");

                if (redirectUrl) {
                    localStorage.removeItem("redirectAfterLogin");
                    window.location.href = redirectUrl; // Returns straight to product.html!
                } else if (data.user.role === "business") {
                    window.location.href = "business-dashboard.html";
                } else if (data.user.role === "recycler") {
                    window.location.href = "recycler-dashboard.html";
                } else {
                    window.location.href = "index.html";
                }
            });

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: data.message || "Invalid credentials.",
                confirmButtonColor: '#2E7D32'
            });
        }
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'Connection Error',
            text: 'Cannot connect to the server.',
            confirmButtonColor: '#2E7D32'
        });
    }
});