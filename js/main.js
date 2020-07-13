
// Setting the server parameters
const hostname = "0.0.0.0";
const port = 62000;
// requiring services
const http = require("http");
const https = require("https");
const express = require("express");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const baseUrl = "https://www.residentadvisor.net";

const server = http.createServer((req, res) => {

  if(req.method !== 'POST'){
    // for contact form
    res.statusCode = 200;
    console.log(req.method);
    res.setHeader('Content-Type', 'text/plain');
    return;
  }


  let body = [];
  req.on('data', (chunk) => {
      body.push(chunk);

  }).on('end', () =>{
    body = Buffer.concat(body).toString();
    body = body.split('&');
    body = body.map(token => {
      return token.split('=')[1];
    });
    // if not correct message
    if(body.length !== 2) {
      res.statusCode = 404; // change to code for inappropriate content
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
      res.end();
    }
    else {
      // Query Resident advisor website
      requestResidentAdvisor(body[0], body[1]).then(result => {
        //console.log(result );
        // Setting the response code, headers and body
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:63342");
        res.end(JSON.stringify(result));
      });
    }
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);

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
