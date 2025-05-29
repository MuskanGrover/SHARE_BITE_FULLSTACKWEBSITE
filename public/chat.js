document.addEventListener("DOMContentLoaded", () => {
    const chatbotBtn = document.getElementById("chatbot-btn");
    console.log("Chatbot Button:", chatbotBtn); // ✅ Debugging check

    if (chatbotBtn) {
        chatbotBtn.addEventListener("click", () => {
            console.log("Chatbot button clicked!"); // ✅ Confirm event firing
            window.location.href = "/chatbot"; // ✅ Match the route defined in chatbotRoutes.js
        });
    }
});
