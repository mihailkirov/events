

function submitForm() {
  /**
   * Taking the output from the user
   *
   */
  let name = document.getElementById("name");
  let email = document.getElementById("email");
  let loc = document.getElementById("cityForm");
  let subject = document.getElementById("subject");

  // temporary solution
  if(subject.value !== "" && name.value !== ""
    && email.value !== ""){
    $.ajax({
      data : {
        name: loc.value,
        email: email.value,
        subject: subject.value,
      },
      type: 'POST',
      url: 'http://0.0.0.0:62000/contact',
      json: true,
      error: function (err, status) {
        alert("something went wrong with the server");
      }
    }).done(alert("Message send. Administrator will contact you soon."));
  }
}
