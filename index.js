var Vibrant = require('node-vibrant');
const express = require("express");
const app = express();

app.use(express.static(__dirname))

app.get("/color", query, async (req, res) => {
    res.json(await Vibrant.from(req.query.q).getPalette())
})

function query(req, res, next){
    if (!req.query.q){
        return res.json({error: true, message: "No query parameter specified."})
    }
    return next();
}

app.listen(3000)