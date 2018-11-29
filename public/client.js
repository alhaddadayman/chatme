/// Make connection to server

var socket = io.connect("https://tranquil-shelf-86845.herokuapp.com/");

/// Query DOM
var form = document.getElementById("form");
message = document.getElementById("message");
userName = document.getElementById("username");
outPut = document.getElementById("output");
btn = document.getElementById("send");
feedback = document.getElementById("feedback");


// Emit events

form.addEventListener("submit", e => {
  e.preventDefault();
  let localeDate = new Date();
  let stringDate = localeDate.toLocaleTimeString();

  ///Emit the data to be sent
  socket.emit("chat", {
    name: userName.value,
    message: message.value,
    time: stringDate
  });
  form.reset();
});
///Display data in empty div
socket.on("chat", data => {
  feedback.innerHTML = "";
  outPut.innerHTML +=
    "<div><p><strong>" + data.name + "</strong>" + " : " + data.message + "</p>" +"<p>"+ data.time+ "</p></div>";
  

});
/// Add User is Typing on keypress event
message.addEventListener("keypress", () => {
  socket.emit("typing", userName.value);
  // console.log(userName.value);
});

socket.on("Online", data => {
  let online = document.getElementById("online");
  online.innerHTML = "User/s :  " + data.userOn + ' is Online' ;
});


socket.on("exception", data => {
  outPut.innerHTML = data.fielderr;
  console.log("Error");
});

socket.on("typing", data => {
  feedback.innerHTML = "<p>" + data + " is typing...</p>";
  
  console.log(data);
});