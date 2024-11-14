// Get all hero cards
const heroCards = document.querySelectorAll(".hero-card");

// Add click event listener to each card
heroCards.forEach((card) => {
    card.addEventListener("click", () => {
        const hero = card.dataset.hero; // Get hero name from data attribute

        // Check which hero was selected and redirect
        if (hero === "Hero 1") {
            window.location.href = "../asep/asep.html"; // Redirect to Asep's page
        } else if (hero === "Hero 2") {
            window.location.href = "../dadang/dadang.html"; // Redirect to Dadang's page
        } else if (hero === "Hero 3") {
            window.location.href = "../hendra/hendra.html"; // Redirect to Hendra's page
        } else if (hero === "Hero 4") {
            window.location.href = "../siti/siti.html"; // Redirect to Siti's page
        } else {
            alert("Hero page not available yet!"); // Default fallback
        }
    });
});
