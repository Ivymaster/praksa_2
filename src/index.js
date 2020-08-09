//Uvođenje modula kreiranih od strane trećih lica
const path = require("path");//uvođenje modula za kreiranje putanja
const http = require("http");//uvpđenje modula za kreiranje http servera
const express = require("express"); // uvođenje ekspres izvršnog okvira
const socketio = require("socket.io"); // uvođenje modula za kreiranje webSocket veze
const qs = require("qs")

const { generateMessage, generateLocationMessage } = require("../utils/messages")
const { addUser, removeUser, getUser, getUsersInRoom } = require("../utils/users")

const app = express();//kreiranje funkcije za pokretanje servera ekspres
const server = http.createServer(app);//kreiranje http servera pomocu express servera
const io = socketio(server) //povezivanje socket.io sa serverom

const port = process.env.PORT || 3000; // definiranje porta u slučaju javnog deplojmenta, kao i u slučaju pokretanja istog na lokalnom uređadju
const publicDirectoryPath = path.join(__dirname, "../public"); // kreiranje putanje public direktorija

app.use(express.static(publicDirectoryPath));//specifikacija public direktorija serveru

io.on("connection", (socket) => {//osluškivanje za prisustvo nove konekcije na Socket.io


    socket.on("join", (locString, callback) => {
        let { username, room } = qs.parse(locString, { ignoreQueryPrefix: true })//parsiranje pretrazivacke rijeci
        const { error, user } = addUser({ id: socket.id, username, room })
        if (error) {
            return callback(error)
        }

        socket.join(user.room)//kreiranje sobe, specificirane od strane korisnika

        socket.emit("message", generateMessage("Admin", "Welcome!"))
        socket.broadcast.to(user.room).emit("message", generateMessage("Admin", user.username + " joined")) // slanje događaja tipa "broadcast"
        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
    })

    socket.on("clientMessage", (message) => { // primanje klijentove poruke
        const user = getUser(socket.id)
        io.to(user.room).emit("serverMessage", generateMessage(user.username, message));
        console.log(message);
    })

    socket.on("sendLocation", (coords, callback) => { // funkcija za primanje događaja slanja pozicije
        const user = getUser(socket.id)
        io.to(user.room).emit("locationMessage", generateLocationMessage(user.username, "https://google.com/maps?q=" + coords.latitude + "," + coords.longitude));//Krerianje poveznice sa primljenim podacima
        callback(); // pozivanje callback fje
    })

    socket.on("disconnect", () => {// događaj pri prekidanju povezanosti
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit("message", generateMessage("Admin", user.username + " disconnected"));
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
});

//Pokretanje servera na određenom portu
server.listen(port, () => {
    console.log("server is running");
});

