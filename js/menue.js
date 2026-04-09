let selectedDifficulty = "Easy";



const easyBtn = document.getElementById("easyBtn");
const mediumBtn = document.getElementById("mediumBtn");
const hardBtn = document.getElementById("hardBtn");
const startbutton = document.getElementById("startgame");

const buttons = [easyBtn, mediumBtn, hardBtn];

function setDifficulty(difficulty, button) {
    selectedDifficulty = difficulty;

    // save difficulty for next page
    localStorage.setItem("difficulty", difficulty);

    buttons.forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
}
startbutton.addEventListener("click",() => {location.href = "shootingfloor.html"});
easyBtn.addEventListener("click", () => setDifficulty("Easy", easyBtn));
mediumBtn.addEventListener("click", () => setDifficulty("Medium", mediumBtn));
hardBtn.addEventListener("click", () => setDifficulty("MEGA HARD", hardBtn));

// higlight standard
setDifficulty("Easy", easyBtn);