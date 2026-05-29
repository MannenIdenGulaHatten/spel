console.log("SERVER VERSION 123 RUNNING");

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, "js")));

let timeLeft = 30;
let interval;

// ----------------------
// START TIMER
// ----------------------
app.get("/timer/start", (req, res) => {
  const mode = req.query.mode;

  let duration = 30;

  if (mode === "easy") duration = 40;
  if (mode === "medium") duration = 30;
  if (mode === "hard") duration = 20;
  if (mode === "megahard") duration = 10;

  timeLeft = duration;

  clearInterval(interval);

  interval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
    } else {
      clearInterval(interval);
    }
  }, 1000);

  res.json({
    success: true,
    timeLeft
  });
});

// ----------------------
// GET TIMER
// ----------------------
app.get("/timer", (req, res) => {
  res.json({ timeLeft });
});

console.log("testa log");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});