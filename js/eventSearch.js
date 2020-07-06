/*
Set the date to today
 */


Date.prototype.toDateInputValue = (function() {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0,10);
});

// Bindings
document.getElementById("submitSearch").addEventListener("click", getDataFromFields);
document.getElementById('dateEvent').value = new Date().toDateInputValue();

// Functions
function getDataFromFields() {
  // get the necessary data from the fields
  let date = document.getElementById("dateEvent").value;
  let loc = document.getElementById("country").value;

  switch (loc) {
    case "Berlin":
      loc = 'de/berlin' ;
      break;

    case "Ibiza":
      loc = 'es/ibiza';
      break;
    case "Paris":
      loc = 'fr/paris';
      break;
    default :
      loc = 'bulgaria';
  }

  apiRequest(loc, date);
}


function uploadContainer(data){
  /**
   * Dynamically feel the container in the index page with the events received in data
   * @type {HTMLElement}
   */

  let containerContent = document.getElementById("flex-content-container");
  if (data === []){ // no events
    let h1 = document.createElement("h1");
    h1.textContent = "No events in this location";
    containerContent.appendChild(h1);
  }
  else {
    data.forEach(el =>{
      console.log(el.nameEvent);
      console.log(el.placeEvent);
      console.log(el.lineup);
      console.log(el.link);
      console.log(el.imageLink);
    });
  }

}

//residentadvisor.net/events.aspx?ai=95&v=day&mn=7&yr=2020&dy=4​
function apiRequest(location, date) {
  /**
   * Request information from node js server and send received data to be shown
   */

  $.ajax({
    data : {
      date: date,
      country: location,
    },
    type: 'POST',
    url: 'http://0.0.0.0:62000/',
    json: true,
    error: function (err, status) {
      alert("something is wrong");
    }
  }).done(data => uploadContainer(JSON.parse(data)));
}
