"use strict";

const express = require("express");
const app = express();
const path = require("path");
const axios = require("axios");
const ejsMate = require("ejs-mate");
const AppError = require("./ExpressError");

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});

app.post("/search", async (req, res, next) => {
  try {
    const { movie } = req.body;

    const response = await axios.get(
      `https://api.tvmaze.com/singlesearch/shows?q=${movie}`
    );
    const movieResult = response.data;
    res.render("show", { movieResult });
  } catch (err) {
    next(err);
  }
});

app.all("*", (req, res, next) => {
  next(new AppError("page not found", 404));
});

app.use((err, req, res, next) => {
  const { message = "oh no! something went wrong", statusCode = 500 } = err;
  res.status(statusCode).render("error", { err });
});


const port = process.env.PORT || 3000;

app.listen(port, (req, res) => {
  console.log(`listening on port ${port}`);
});
