Date.prototype.toDateInputValue = (function() {
    /**
    Set the date to today
   **/
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0,10);
});

// global variables
let events = []; // container for event objects
const loader = document.createElement("div");
loader.classList.add("loader");


// Bindings
document.getElementById("submitSearch").addEventListener("click", getDataFromFields);
document.getElementById('dateEvent').value = new Date().toDateInputValue();


function getDataFromFields() {
  /**
   * Extracting the data and location from the form fields on submit
   */

  // Adding loader and clearing content
  let containerContent = document.getElementById("flex-content-container");
  containerContent.textContent = '';
  loader.style.display = "block";
  containerContent.appendChild(loader);
  containerContent.style.justifyContent = "center";

  // Parsing the fields
  let date = document.getElementById("dateEvent").value;
  let loc = document.getElementById("city").value;

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


function togglePopup(event) {
  /**
   * adding popup for additional info about givent event
   * */

  // activating the pop-up
  document.getElementById("popUp-1").classList.toggle("active");

  let overlay = document.getElementsByClassName("overlay")[0];

  // Filling content relative to the chosen element
  let eventHeader = document.getElementById("event-title-pop1");
  eventHeader.append(document.createTextNode(event.nameEvent));

  // event location
  let location = document.getElementById("event-location-pop1");
  location.append(document.createTextNode("at " + event.placeEvent))
  // event line-up
  lineup = document.getElementById("event-line-up-pop1");
  lineup.append(document.createTextNode("artists: " + event.lineup));
  let clsbtn = document.getElementById("close-pop-up-1");
  // event image

  let contImg = document.getElementById("pop-up-1-img");
  let img = document.createElement("img");
  img.setAttribute("src", event.imageLink);
  img.setAttribute("width", "152");
  img.setAttribute("height", "76");
  contImg.appendChild(img);

  // Close the pop-up with close button or with a click outside of the last one
  clsbtn.addEventListener("click", function () {
    location.innerText = '';
    lineup.innerText = '';
    eventHeader.innerText = '';
    contImg.removeChild(img);
    document.getElementById("popUp-1").classList.remove("active");
  }, false);

  window.onclick = function (event) {

    if(event.target === overlay){
      location.innerText = '';
      lineup.innerText = '';
      eventHeader.innerText = '';
      contImg.removeChild(img);
      document.getElementById("popUp-1").classList.remove("active");
    }
  }
}

function uploadContainer(data){
  /**
   * Dynamically feel the container in the index page with the events received in data
   * @type {HTMLElement}
   */

  let containerContent = document.getElementById("flex-content-container");
  containerContent.textContent = '';

  if (data.length === 0){ // no events
    let h1 = document.createElement("h1");
    let text  = document.createTextNode("No events in this location");
    h1.append(text);
    containerContent.appendChild(h1);
  }
  // Dynamically adding div container
  else {
    events = [];
    let i=0;
    data.forEach(el => {
      let contdynamic = document.createElement("div");
      contdynamic.classList.add("event");

      events.push(el);
      // title
      let h1 = document.createElement("h1");
      h1.classList.add("event-title");
      let a = document.createElement("a");
      a.setAttribute("href", "#");
      a.addEventListener("click", function () {
        openInNewTab(el.link);
      }, false);
      a.append(document.createTextNode(el.nameEvent));
      h1.append(a);
      contdynamic.appendChild(h1);

      // image container
      let contimg = document.createElement("div");
      contimg.classList.add("container-img");
      let img = document.createElement("img");
      img.setAttribute("src", el.imageLink);
      img.setAttribute("width", "152");
      img.setAttribute("height", "76");

      contimg.appendChild(img);
      contdynamic.appendChild(contimg);

      // button for more info

      let button = document.createElement("button");
      button.append(document.createTextNode("More info"));
      button.addEventListener("click", function (){togglePopup(el)}, false);
      contdynamic.append(button);

      containerContent.appendChild(contdynamic);
    });

    containerContent.style.justifyContent = "flex-start";
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
      alert("something went wrong with the server");
    }
  }).done(data => uploadContainer(JSON.parse(data)));
}

function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}

