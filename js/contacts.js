

function submitForm() {
  /**
   * Taking the output from the user
   *
   */
  let name = document.getElementById("fname");
  let lastName = document.getElementById("lname");
  let loc = document.getElementById("cityForm");
  let subject = document.getElementById("subject");


  // temporary solution
  if(subject.value !== "" && name.value !== ""
    && lastName.value !== ""){
    $.ajax({
      data : {
        name: location,
        lastName: lastName,
        subject: subject
      },
      type: 'POST',
      url: 'http://0.0.0.0:62000/',
      json: true,
      error: function (err, status) {
        alert("something went wrong with the server");
      }
    }).done(alert("Message send. Administrator will contact you soon."));
  }
}
