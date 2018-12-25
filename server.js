const path = require("path");
const express = require("express");
const app = express();

app.use(express.static("src"));
app.listen(3000);
