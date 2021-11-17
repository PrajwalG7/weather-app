const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const hbs = require("hbs");
const fetch = require("node-fetch");
const port = process.env.PORT || 8000;

// public folder's static_path
const static_path = path.join(__dirname, "../public");

// setting view engine and its path
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../templates/views"));
hbs.registerPartials(path.join(__dirname, "../templates/partials/"));
app.use(express.static(static_path));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/weather", (req, res) => {
  res.render("weather", {
    city: null,
    des: null,
    temp: null,
  });
});

app.get("*", (req, res) => {
  res.render("404page", {
    errorMsg: "Oops! Page Not Found",
  });
});

// post req
app.post("/weather", (req, res) => {
  const city = req.body.cityName;
  const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}`;

  try {
    fetch(api)
      .then((res) => res.json())
      .then((data) => {
        if (data.message == "city not found") {
          res.render("weather", {
            city: data.message,
            des: null,
            temp: null,
          });
        } else {
          const city = data.name;
          const des = data.weather[0].description;
          let temp = data.main.temp;
          //convert kelvin to celsius
          temp = Math.round(temp - 273.15);
          res.render("weather", {
            city,
            des,
            temp,
          });
        }
      });
  } catch (err) {
    res.render("weather", {
      city: "something went wrong",
      des: null,
      temp: null,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
