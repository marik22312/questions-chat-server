import express from 'express';
import nativeHttpDriver from 'http';
import socketIo from 'socket.io';

const app = express();

const httpServer = new nativeHttpDriver.Server(app);
const io = socketIo(httpServer);
// WARNING: app.listen(80) will NOT work here!

app.get('/', function (req, res) {
	res.send('Omer Ya Beiza');
});

io.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('message', function (data) {
		console.log(data);
		socket.emit('messageRecieved', data)
	});
});
httpServer.listen(process.env.PORT || 3000);