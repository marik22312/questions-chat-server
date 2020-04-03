import "./env";

import express from 'express';
import nativeHttpDriver from 'http';
import socketIo from 'socket.io';
import { ChatEvents, ErrorEvents, ChatErrors } from './constants/events';

const app = express();

const httpServer = new nativeHttpDriver.Server(app);
const io = socketIo(httpServer);
// WARNING: app.listen(80) will NOT work here!

const waitingPeers: ChatUser[] = [];
const activeChats: { [key: string]: ChatUser; } = {};
const connectedUsers: ChatUser[] = [];

app.get('/', (req, res) => {
	res.send('Omer Ya Beiza');
});

io.on('connection', (socket) => {
	const socketId = socket.id;

	const emitError = (message: any) => {
		socket.emit(ErrorEvents.CHAT__ERROR, message)
	}

	interface EmitToPeersOptions {
		to: ChatUser,
		event: ChatEvents
		message: any
	}
	const emitToPeers = (options: EmitToPeersOptions) => {
		io.to(options.to.socketId).emit(options.event, options.message);
		socket.emit(options.event, options.message);
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
			return emitError(ChatErrors.MISSING_FROM)
		}
		const to = activeChats[from.userId];

		if (!to) {
			return emitError(ChatErrors.MISSING_TO)
		}

		const message: ChatMessageResponse = {
			...data,
			from: from.name,
			timestamp: Date.now(),
			type: MessageType.MESSAGE
		}

		emitToPeers({to, message, event: ChatEvents.CHAT_MESSAGE});
	})

	socket.on(ChatEvents.GET_QUESTION, () => {
		// get question
		const question = {
			question: 'How much wood would a woodchuck chuck if a woodchuck would chuck wood?'
		}

		const from = connectedUsers.find(user => user.socketId === socket.id);
		if (!from) {
			return emitError(ChatErrors.MISSING_FROM)
		}
		const to = activeChats[from.userId];

		if (!to) {
			return emitError(ChatErrors.MISSING_TO)
		}


		emitToPeers({to, message: question, event: ChatEvents.GET_QUESTION});
	})

	socket.on('disconnect', () => {
		const user = connectedUsers.find(u => u.socketId === socketId);
		if (!user) {
			return;
		}
		const userIndex = connectedUsers.findIndex(u => u.socketId === socketId);

		const peer = {...activeChats[user.userId]};
		delete activeChats[user.userId];
		delete activeChats[peer.userId];
		connectedUsers.splice(userIndex, 1);
		io.to(peer.socketId).emit(ChatEvents.PEER_DISCONNECTED)
	})
})

httpServer.listen(parseInt(process.env.PORT, 10) || 3000, () => {
	// tslint:disable-next-line: no-console
	console.log('Server is connected');
});