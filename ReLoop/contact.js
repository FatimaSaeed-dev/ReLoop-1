document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", handleContactSubmit);
    }
});

async function handleContactSubmit(event) {
    event.preventDefault();

    const submitBtn = event.target.querySelector(".contact-btn");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const subjectInput = document.getElementById("subject");
    const messageInput = document.getElementById("message");

    const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        subject: subjectInput.value.trim(),
        message: messageInput.value.trim()
    };

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        showMessage("Please fill out all fields before submitting.", "error");
        return;
    }

    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
        const response = await fetch("http://localhost:5000/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showMessage("Thank you! Your message has been sent successfully.", "success");
            event.target.reset();
        } else {
            throw new Error(data.message || "Failed to send message.");
        }

    } catch (error) {
        console.error("Contact Form Error:", error.message);
        showMessage(error.message || "Something went wrong. Please try again.", "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
}

function showMessage(text, type) {
    const existingMsg = document.querySelector(".form-status-msg");
    if (existingMsg) {
        existingMsg.remove();
    }

    const msgDiv = document.createElement("div");
    msgDiv.className = `form-status-msg ${type}`;
    msgDiv.textContent = text;

    msgDiv.style.padding = "12px 16px";
    msgDiv.style.borderRadius = "10px";
    msgDiv.style.fontSize = "14px";
    msgDiv.style.fontWeight = "600";
    msgDiv.style.marginBottom = "20px";
    msgDiv.style.textAlign = "center";

    if (type === "success") {
        msgDiv.style.background = "#e8f5e9";
        msgDiv.style.color = "#1b5e20";
        msgDiv.style.border = "1px solid #a3d9a5";
    } else {
        msgDiv.style.background = "#fef2f2";
        msgDiv.style.color = "#991b1b";
        msgDiv.style.border = "1px solid #fca5a5";
    }

    const form = document.getElementById("contactForm");
    form.parentNode.insertBefore(msgDiv, form);

    setTimeout(() => {
        if (msgDiv) msgDiv.remove();
    }, 5000);
}
async function handleContactSubmit(event) {
    event.preventDefault();

    const submitBtn = event.target.querySelector(".contact-btn");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const subjectInput = document.getElementById("subject");
    const messageInput = document.getElementById("message");

    const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        subject: subjectInput.value.trim(),
        message: messageInput.value.trim()
    };

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        showMessage("Please fill out all fields before submitting.", "error");
        return;
    }

    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
        const response = await fetch("http://localhost:5000/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        // Check if the response is actually JSON before parsing
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error(`Server returned status ${response.status} (${response.statusText}). Check your route URL!`);
        }

        const data = await response.json();

        if (response.ok) {
            showMessage("Thank you! Your message has been sent successfully.", "success");
            event.target.reset();
        } else {
            throw new Error(data.message || "Failed to send message.");
        }

    } catch (error) {
        console.error("Contact Form Error:", error.message);
        showMessage(error.message, "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
}