const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, function () {
    console.log("ACITY CONNECT running on port " + PORT);
});
