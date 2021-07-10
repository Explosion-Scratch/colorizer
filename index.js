var Vibrant = require("node-vibrant");
const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.static(__dirname));

app.get("/color", query, async (req, res) => {
  var colors = require("./colors.json");
  if (colors[req.query.q]) {
    return res.json(colors[req.query.q]);
  }
  var color;
  try {
    color = await Vibrant.from(req.query.q).getPalette();
  } catch (e) {
    console.log("There was an error: ", e);
    console.log(e.message);
    color = { error: true, message: e.message };
  }
  res.json(color);
  colors[req.query.q] = color;
  fs.writeFileSync("./colors.json", JSON.stringify(colors, null, 2));
});
app.get("/imgsearch", query, async (req, res) => {
  var gis = require("g-i-s");
  res.json(
    (
      await new Promise((resolve) => gis(req.query.q, (_, r) => resolve(r)))
    ).slice(0, 100)
  );
});
function query(req, res, next) {
  if (!req.query.q) {
    return res.json({ error: true, message: "No query parameter specified." });
  }
  return next();
}

app.listen(3000, () => console.log("Listening on port 3000"));
