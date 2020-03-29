import express from 'express';
import nativeHttpDriver from 'http';
import socketIo from 'socket.io';

const app = express();

const httpServer = new nativeHttpDriver.Server(app);
const io = socketIo(httpServer);
httpServer.listen(3000);
// WARNING: app.listen(80) will NOT work here!

app.get('/', function (req, res) {
  res.send('Omer Ya Beiza');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});