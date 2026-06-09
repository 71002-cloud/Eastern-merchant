const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

let cellData = "";

app.post("/api/members", (req, res) => {
    cellData = req.body.cell;

    res.sendStatus(200);
});

// API endpoint
app.get("/api/message", (req, res) => {
  res.json({
    text: cellData || "No data received yet",
    time: new Date().toLocaleTimeString()
  });
});

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});