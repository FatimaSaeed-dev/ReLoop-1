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
localStorage.setItem("userId", data.user.id);
    alert("Login successful!");

    // Redirect based on role
    
    alert("Login successful!");

console.log("ROLE:", data.user.role);
    
if (data.user.role === "business") {

    window.location.href = "business-dashboard.html";

} else if (data.user.role === "recycler") {

    window.location.href = "recycler-dashboard.html";

}

} else {

    alert(data.message || "Login failed.");
}
    } catch (error) {
        console.error(error);
        alert("Cannot connect to the server.");
    }
});