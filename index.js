const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");

// getting data from a custom json file unsing sync function
// because sync function will load first when the page is loaded and this will be loaded once because it is outsite od the server
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  const { query, pathname } = url.parse(req.url, true);

  // over view page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const temData = dataObj.map((el) => replaceTemplate(tempCard, el)).join("");
    const output = tempOverview.replace("{% PRODUCT_CARD %}", temData);

    res.end(output);
    // product page
  } else if (pathname == "/product") {
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    console.log(query);
    res.end(output);
    // api
  } else if (pathName === "/api") {
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello world",
    });
    res.end("<h1> page not found </h1>");
  }
});

server.listen(3000, () => {
  console.log("server is working");
});
