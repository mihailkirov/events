// module variables
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const baseUrl = "https://www.residentadvisor.net";
// Setting the server parameters
const hostname = "0.0.0.0";
const port = 62000;
// requiring services
const http = require("http");
const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const server1 = http.Server(app);
const helmet = require("helmet");
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:63342');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
  res.setHeader('Content-Type', "text/plain");
  next();
});

app.options('*', function(req, res) {
  res.send(200);
});

server1.listen(port, hostname, (err) => {
  if(err){
    throw err;
  }
  else
    console.log(`Server running at http://${hostname}:${port}/`);
});
module.exports = server1;


app.post('/events', (req, res) => {
  // Query Resident advisor website
  requestResidentAdvisor(req.body.date, req.body.country).then(result => {
        // Setting the response code, headers and body
    res.statusCode = 200;
    res.end(JSON.stringify(result));
  });

});

// For contact-form submission
app.post('/contact', (req, res) => {
  console.log(req.body);
  res.statusCode = 200;
  res.end();
});


//Request for Resident Advisor
function requestResidentAdvisor(date, location) {
  // construct the url for the request
  let requestUrl =   baseUrl + "/events/" +  location + '/day/' + date;

  return new Promise((resolve, reject) => {
      https.get(requestUrl, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk; // recieve the chunk of data
        });
        resp.on('end', () => {
          resolve(parseDataHTML(data));
        });
      }).on('error', (err) => {
        console.log("Error" + err.message);
        return [];
      });
  });
}


function parseDataHTML(data){
  /**
   * ResidentAdvisor HTML page content parser
   * @type data - html in string
   */
  let events = []
  const dom = new JSDOM(data);
  let window = dom.window;
  let items = window.document.getElementById("items"); // events in the html
  let articles = items.querySelectorAll("li > article > a");
  items.querySelectorAll("li > article > .bbox").forEach(el => {
    // Parsing the box content information
    let obj = {}; // object
    obj.nameEvent = el.querySelector(".event-title").textContent;
    obj.placeEvent = el.querySelector(".grey").textContent;
    obj.lineup = el.querySelector("div").textContent;
    let tmpRef = el.querySelector(".event-title > a").getAttribute("href");
    obj.link = baseUrl + tmpRef;
    articles.forEach(art => {
        if(art.getAttribute("href") === tmpRef){
          obj.imageLink = baseUrl + art.querySelector("noscript > img")
            .getAttribute("src");
        }
    });
    events.push(obj);
  });

  return events;
}
