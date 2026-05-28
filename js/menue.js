let selectedDifficulty = "Easy";
let iceMode = false;

const easyBtn = document.getElementById("easyBtn");
const mediumBtn = document.getElementById("mediumBtn");
const hardBtn = document.getElementById("hardBtn");
const startbutton = document.getElementById("startgame");
const iceBtn = document.getElementById("icemode");

const buttons = [easyBtn, mediumBtn, hardBtn];

function setDifficulty(difficulty, button) {
    selectedDifficulty = difficulty;

    // save difficulty for next page
    localStorage.setItem("difficulty", difficulty);

    buttons.forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
}

// ----------------------
// Ice mode toggle
// ----------------------
iceBtn.addEventListener("click", () => {
    iceMode = !iceMode;

    localStorage.setItem("iceMode", iceMode);

    iceBtn.classList.toggle("selected", iceMode);
});

// ----------------------
// Difficulty buttons
// ----------------------
easyBtn.addEventListener("click", () => setDifficulty("Easy", easyBtn));
mediumBtn.addEventListener("click", () => setDifficulty("Medium", mediumBtn));
hardBtn.addEventListener("click", () => setDifficulty("MEGAHARD", hardBtn));

// ----------------------
// Start game
// ----------------------
startbutton.addEventListener("click", () => {
    location.href = "shootingfloor.html";
});

// ----------------------
// Highlight defaults on load
// ----------------------
function loadSavedSettings() {
    const savedDifficulty = localStorage.getItem("difficulty");
    const savedIceMode = localStorage.getItem("iceMode") === "true";

    // Difficulty UI
    if (savedDifficulty === "Easy") setDifficulty("Easy", easyBtn);
    if (savedDifficulty === "Medium") setDifficulty("Medium", mediumBtn);
    if (savedDifficulty === "MEGAHARD") setDifficulty("MEGAHARD", hardBtn);
    if (!savedDifficulty) setDifficulty("Easy", easyBtn);

    // Ice mode UI
    if (savedIceMode) {
        iceMode = true;
        iceBtn.classList.add("selected");
        localStorage.setItem("iceMode", true);
    }
}

loadSavedSettings();