const PORT = 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const newspapers = [
  {
    name: "TheNewYorkTimes",
    address: "https://www.nytimes.com/",
  },
  {
    name: "washingtonPost",
    address: "https://www.washingtonpost.com/",
  },
  {
    name: "The Guardian",
    address: "https://www.theguardian.com/uk/technology",
  },
  {
    name: "The Times",
    address: "https://www.thetimes.co.uk/",
  },
  {
    name: "The Telegraph",
    address: "https://www.telegraph.co.uk/#source=refresh",
  },
  {
    name: "The Independent",
    address: "https://www.independent.co.uk/?CMP=ILC-refresh",
  },
];

const articles = [];

app.listen(PORT, () => console.log(`server run on ${PORT}`));

app.get("/", (req, res) => {
  res.json("welcome");
});

app.get("/news", (req, res) => {
  axios
    .get("https://www.theguardian.com/uk/technology")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $('a:contains("ai")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");

        articles.push({
          title,
          url,
        });
      });

      res.json(articles);
    })
    .catch((err) => console.log(err));
});
