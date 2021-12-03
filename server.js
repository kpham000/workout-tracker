const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();

const PORT = process.env.PORT || 3002;

const app = express();

const routes = require("./controllers")

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/workout');

app.use(express.urlencoded({ extended:true }));
app.use(express.json());

app.use(express.static("public"));

// routes?
app.use(routes)

app.listen(PORT, () => {
    console.log(`App run on port ${PORT}!`);
});