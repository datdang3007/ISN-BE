// const express = require('express');
// const app = express();
// const http = require('http');
// const cors = require('cors');
// const { Server } = require('socket.io');

// app.use(cors());

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST'],
//   },
// });

// io.on('connection', (socket) => {
//   console.log(`User connected ${socket.id}`);

//   // We can write our socket event listeners in here...
// });

// app.get('/', (req, res) => {
//   res.send('Hello world');
// });

// server.listen(4000, () => 'Server is running on port 4000');