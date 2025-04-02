const express = require('express');
const app = express();
const http = require('http');
const path = require('path');

const server = http.createServer(app);
const socketio = require('socket.io');

const io = socketio(server);

app.set('view engine', "ejs");
app.use(express.static(path.join(__dirname,"public")));

io.on("connection", function(socket) {
    console.log("User connected");
    socket.on("send-location", function(data){
        io.emit("receive-location", { id: data.id, ...data})
    })
    socket.on("disconnect", function(){
        io.emit("user-disconnected", socket.id)
    })
})
app.get('/', (req,res)=>{
    res.render("index");
})

app.get('/res',(req, res)=>{
    res.send("Hello world!");
})
server.listen(3000);
