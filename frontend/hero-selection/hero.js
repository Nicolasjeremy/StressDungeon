const heroCards = document.querySelectorAll(".hero-card");

heroCards.forEach((card) => {
    card.addEventListener("click", () => {
        const hero = card.dataset.hero;

        if (hero === "Hero 1") {
            window.location.href = "/StressDungeon/frontend/asep/asep.html";
        } else if (hero === "Hero 2") {
            window.location.href = "/StressDungeon/frontend/dadang/dadang.html";
        } else if (hero === "Hero 3") {
            window.location.href = "/StressDungeon/frontend/hendra/hendra.html";
        } else if (hero === "Hero 4") {
            window.location.href = "/StressDungeon/frontend/siti/siti.html";
        } else {
            alert("Hero page not available yet!");
        }
    });
});
