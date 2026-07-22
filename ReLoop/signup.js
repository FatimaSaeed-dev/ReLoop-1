document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const role = document.getElementById("role").value;

    // Check passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password,
                role
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Account created successfully!");
            window.location.href = "login.html";
        } else {
            alert(data.message || "Registration failed.");
        }

    } catch (error) {
        console.error(error);
        alert("Cannot connect to the server.");
    }
});