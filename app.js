/// Require Library
const express = require("express");
const socketIO = require("socket.io");
/// create express server
const app = express();
var port = process.env.PORT || 8003;

app.use(express.static("public"));
/// GET , POST, PUT, DELETE
/* app.get('/', (req, res)=>{
    res.send('Hello');
});

app.get('/api', (req, res)=>{
    res.send(JSON.stringify([1, 2, 3]));
}); */
///Start server and listen on a port
let server = app.listen(port, () => {
  console.log("srever is running in port 9005");
});

/// use  server on port 8080 for socketIO connections
const io = socketIO(server);

var connections = [];
let onlineUsers = 0;

io.on("connection", socket => {
  connections.push(socket);
  onlineUsers++;
  io.sockets.emit("Online", { userOn: onlineUsers });
  console.log(`${connections.length}user/s is Connected`);

  socket.on("disconnect", () => {
    onlineUsers--;
    io.sockets.emit("Online", { userOn: onlineUsers });
    connections.splice(connections.indexOf(socket), 1);
    console.log(`${connections.length}user/s is Disconnected`);
  });
 
  socket.on("chat", data => {

    let usernameData = data.userName;
    let messageData = data.message;
    let errmsg = "write a Message";

    if (usernameData == "" || messageData == "") {
        socket.emit("exception", { fielderr: errmsg });
      } else {
        io.sockets.emit("chat", data);
      }
  });
  socket.on("typing", data => {
    socket.broadcast.emit("typing", data);
  });
 
});
