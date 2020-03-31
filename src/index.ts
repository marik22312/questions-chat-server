import express from 'express';
import nativeHttpDriver from 'http';
import socketIo from 'socket.io';
import { ChatEvents, ErrorEvents } from './constants/events';

const app = express();

const httpServer = new nativeHttpDriver.Server(app);
const io = socketIo(httpServer);
// WARNING: app.listen(80) will NOT work here!

const waitingPeers: ChatUser[] = [];
const activeChats: { [key: string]: ChatUser; } = {};
const connectedUsers: ChatUser[] = [];

app.get('/', function (req, res) {
	res.send('Omer Ya Beiza');
});

io.on('connection', function (socket) {
	const socketId = socket.id;

	const emitError = (message: any) => {
		socket.emit(ErrorEvents.CHAT__ERROR, message)
	}

	socket.on(ChatEvents.READY_FOR_PEERING, (data: ReadyForPeerDto) => {
		const user: ChatUser = {
			userId: data.userId,
			name: data.name,
			socketId,
		}
		connectedUsers.push(user);
		if (!waitingPeers.length) {
			waitingPeers.push(user);
		} else {
			const peer = waitingPeers.shift();
			if (peer) {
				activeChats[user.userId] = peer;
				activeChats[peer.userId] = user;
				socket.emit(ChatEvents.PEER_FOUND, peer);
				io.to(activeChats[user.userId].socketId).emit(ChatEvents.PEER_FOUND, user);
			}

		}
	})

	socket.on(ChatEvents.CHAT_MESSAGE, (data: ChatMessageEvent) => {
		const from = connectedUsers.find(user => user.socketId === socket.id);
		if (!from) {
			return;
		}
		const to = activeChats[from.userId];
		if (!to) {
			return;
		}

		const message: ChatMessageResponse = {
			...data,
			from: from.name
		}

		socket.emit(ChatEvents.CHAT_MESSAGE, message);
		io.to(to.socketId).emit(ChatEvents.CHAT_MESSAGE, message);
		console.log('from', from,'to',to)
	})

	// socket.on(ChatEvents.GET_QUESTION, () => {
	// 	// get question
	// 	const question = {
	// 		question: 'How much wood would a woodchuck chuck if a woodchuck would chuck wood?'
	// 	}

	// 	const from = connectedUsers.find(user => user.socketId === socket.id);
	// 	const to = activeChats[from.userId];

		
	// 	// serve question to both
	// })

	socket.on('DEBUG', (data) => {
		console.log('Peers', waitingPeers);
		console.log('Peered', activeChats);
	})

	socket.on('disconnect', () => {
		const user = connectedUsers.find(user => user.socketId === socketId);
		if (!user) {
			return;
		}
		const userIndex = connectedUsers.findIndex(user => user.socketId === socketId);

		const peer = {...activeChats[user.userId]};
		delete activeChats[user.userId];
		delete activeChats[peer.userId];
		connectedUsers.splice(userIndex, 1);
		io.to(peer.socketId).emit(ChatEvents.PEER_DISCONNECTED)
	})
})

httpServer.listen(process.env.PORT || 3000);