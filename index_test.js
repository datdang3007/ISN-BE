const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http');
const cors = require('cors');
let path = require( 'path' );
const { Server } = require('socket.io');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = http.createServer(app);

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
  const userID = socket.id;
  // console.log(`User connected ${userID}`);

  socket.on('on-chat', (data) => {
    io.emit('user-chat', userID, data.message)
  });

  // Meeting:
  socket.on('join-room', (meetingCode) => {
    socket.join(meetingCode);
    const socketIDsInRoom = io.sockets.adapter.rooms.get(meetingCode);
    let socketIDsArray = socketIDsInRoom ? Array.from(socketIDsInRoom.keys()) : [];

    console.log('userID:', userID);

    socketIDsArray = socketIDsArray.filter(val => val != userID);
    console.log(socketIDsArray);

    // const indexToRemove = socketIDsArray.indexOf(socket.id);
    // if (indexToRemove !== -1) {
    //   socketIDsArray.splice(indexToRemove, 1);
    // }

    io.to(meetingCode).emit('user-connected', socketIDsArray);
  });
});

server.listen(4000, () => 'Server is running on port 4000');