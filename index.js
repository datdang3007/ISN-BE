const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http');
const cors = require('cors');
let path = require( 'path' );
const { Server } = require('socket.io');
const { ExpressPeerServer } = require("peer");
const { log } = require('console');
const opinions = {
  debug: true,
}

const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/peerjs", ExpressPeerServer(server, opinions));
app.use(express.static("public"));

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const ListMeetingRoom = []

app.post('/join-meeting-room', (req, res) => {
  const meetingCode = req.body.meetingCode;
  if (ListMeetingRoom.includes(meetingCode)) {
    res.status(200).json({ isExist: true });
    return;
  }
  res.status(200).json({ isExist: false });
});

function generateRandomMeetingCode() {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar characters
  let code = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
}

app.post('/create-meeting', (req, res) => {
  const meetingCode = generateRandomMeetingCode();
  ListMeetingRoom.push(meetingCode);
  res.status(200).json({ meetingCode });
});

io.on('connection', (socket) => {
  socket.on('on-chat', (data) => {
    io.emit('user-chat', socket.id, data.name, data.message)
  });

  socket.on("join-room", (roomID, userID) => {
    socket.join(roomID);
    setTimeout(()=>{
      console.log(roomID, userID);
      socket.to(roomID).emit("user-connected", userID);
    }, 1000)
  });
});

server.listen(4000, () => 'Server is running on port 4000');
