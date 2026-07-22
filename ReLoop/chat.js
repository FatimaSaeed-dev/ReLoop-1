const chatId = localStorage.getItem("chatId");
const userId = localStorage.getItem("userId");

if (!chatId) {
    alert("No chat selected");
    window.location.href = "recycler-dashboard.html";
}

// ==========================
// LOAD MESSAGES
// ==========================
async function loadMessages() {
    try {
        const response = await fetch(
            `http://localhost:5000/api/messages/${chatId}`
        );

        const messages = await response.json();

        if (!response.ok) {
            console.log("Server error:", messages);
            throw new Error(messages.message || "Failed loading messages");
        }

        if (!Array.isArray(messages)) {
            console.log("Invalid messages:", messages);
            throw new Error("Messages are not an array");
        }

        const container = document.getElementById("messages");
        container.innerHTML = "";

        if (messages.length === 0) {
            container.innerHTML = `
                <p class="empty-state">
                    No messages yet. Start the conversation.
                </p>
            `;
            return;
        }

        messages.forEach(msg => {
            const isSentByMe = (msg.sender?._id || msg.sender) === userId;
            
            container.innerHTML += `
                <div class="message ${isSentByMe ? 'sent' : ''}">
                    <strong>${msg.sender?.username || "User"}</strong>
                    <p>${msg.text}</p>
                    <small>${new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                </div>
            `;
        });

        // Auto scroll to bottom
        container.scrollTop = container.scrollHeight;

    } catch (error) {
        console.log("Loading messages failed:", error);
        document.getElementById("messages").innerHTML = `
            <p class="empty-state">
                Could not load messages.
            </p>
        `;
    }
}

// ==========================
// SEND MESSAGE
// ==========================
async function sendMessage() {
    const input = document.getElementById("messageInput");
    const text = input.value.trim();

    if (!text) return;

    try {
        const response = await fetch(
            "http://localhost:5000/api/messages",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chat: chatId,
                    sender: userId,
                    text: text
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        input.value = "";
        loadMessages();

    } catch (error) {
        console.log("Sending message failed:", error);
        alert("Message could not be sent");
    }
}

// ==========================
// EVENT LISTENERS & INIT
// ==========================
document.getElementById("messageInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

// Load messages when page opens
loadMessages();