const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.send('<h1>Sup!</h1>');
});

io.on('connection', (socket) => {
  console.log('New connection');
  socket.on('join', (room) => {
    console.log('User joined: ', room);
    socket.join(room);
  });
  socket.on('user-input', (id, data) => {
    io.to(id).emit('message', 'Thanks for the data!');
    io.to(id).emit('update-chart', data);
    console.log('User data: ', data);
  });
});

const port = 3000;

http.listen(port, () => {
  console.log('Running locally on port:', port);
});
