const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

let gameDuration = 30;
let timeLeft = gameDuration;
let timerRunning = false;

// Start timer
app.get("/timer", (req, res) => {

    const mode = req.query.mode;
  
    let duration = 30;
  
    if (mode === "easy") duration = 40;
    if (mode === "medium") duration = 30;
    if (mode === "hard") duration = 20;
  
    res.json({
      timeLeft,
      mode
    });
  });

// Get timer
app.get("/timer", (req, res) => {

  res.json({
    timeLeft
  });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});