
const baseUrl = "residentadvisor.net/events.aspx";

Date.prototype.toDateInputValue = (function() {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0,10);
});

document.getElementById('dateEvent').value = new Date().toDateInputValue();

function searchEvents() {
  let date = new Date(document.getElementById("dateEvent").value);
  let loc = document.getElementById("country").textContent;
  console.log(date.getUTCMonth());
  console.log(document.getElementById("dateEvent").value)
  let code;
  switch (loc) {
    case "Bulgaria" :
      code = 95;
      break;
    case "Germany":
      code = 34;
      break;

    case "Spain":
      code = 25;
      break;
    case "France":
      code = 45;
      break;
  }
  apiRequest(date.getUTCDay(), date.getFullYear(), date.getUTCMonth(), code);
}

//residentadvisor.net/events.aspx?ai=95&v=day&mn=7&yr=2020&dy=4​
function apiRequest(day, year, mounth, codeCountry) {
  const http = require('http');

  let requestUrl = baseUrl + "?ai=" + codeCountry + "&v=day&mn=" + mounth + "&yr=" + year +"&dy=" +day;

  // TODO the get request + parse of the list of dat

  }
