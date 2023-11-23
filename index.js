const PORT = 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

//just to check that works
app.listen(PORT, () => console.log(`server run on localhost:${PORT}`));

app.get("/", (req, res) => {
  res.json("welcome");
});

//source of news
const newspapers = [
  {
    name: "TheNewYorkTimes",
    address: "https://www.nytimes.com/section/business",
    base: "https://www.thenewyorktimes.com/",
  },
  {
    name: "washingtonPost",
    address: "https://www.washingtonpost.com/business/",
    base: "https://www.washingtonpost.com/",
  },
  {
    name: "The Guardian",
    address: "https://www.theguardian.com/business",
    base: "https://www.theguardian.com/",
  },
  {
    name: "The Times",
    address: "https://www.thetimes.co.uk/business",
    base: "https://www.thetimes.co.uk/",
  },
  {
    name: "The Telegraph",
    address: "https://www.telegraph.co.uk/business",
    base: "",
  },
  {
    name: "The Independent",
    address: "https://www.independent.co.uk/business",
    base: "https://www.independent.co.uk/",
  },
];

//will be filled after search
const articles = [];

//get articles abput a specific topic from each source
function runSearch(searchLog) {
  console.log("running search");
  const mySearch = searchLog;
  newspapers.forEach((newspaper) => {
    axios
      .get(newspaper.address)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        //to define with search
        $("a:contains(" + mySearch + ")", html).each(function () {
          const title = $(this).text();
          const url = $(this).attr("href");

          articles.push({
            title,
            url: newspaper.base + url,
            source: newspaper.name,
          });
        });
      })
      .catch((err) => console.log(err));
  });

  console.log("search completed");
}

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/update", (req, res) => {
  res.json(articles);
});

app.get("/news/:mySearch", async (req, res) => {
  const mySearch = req.params.mySearch;
  console.log(mySearch);

  newspapers.forEach((newspaper) => {
    axios
      .get(newspaper.address)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        $("a:contains(" + mySearch + ")", html).each(function () {
          const title = $(this).text();
          const url = $(this).attr("href");

          articles.push({
            title,
            url: newspaper.base + url,
            source: newspaper.name,
          });
        });
      })
      .catch((err) => console.log(err));
    res.json(articles);
  });
});
