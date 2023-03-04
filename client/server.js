const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

app.use(express.json());

const port = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, "/wagmilabsTradingTool/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/wagmilabsTradingTool/build/index.html"));
});

app.listen(port, () => console.log("app listening on port " + port));
