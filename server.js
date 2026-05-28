const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

let timeLeft = 30;
let interval;

// START TIMER
app.get("/start-timer", (req, res) => {
  const mode = req.query.mode;

  let duration = 30;

  if (mode === "easy") duration = 40;
  if (mode === "medium") duration = 30;
  if (mode === "hard") duration = 20;

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

// GET TIMER
app.get("/timer", (req, res) => {
  res.json({ timeLeft });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});