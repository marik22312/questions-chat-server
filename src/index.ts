import "./env";

import express from 'express';
import nativeHttpDriver from 'http';
import socketIo from 'socket.io';

import { ChatUser } from './constants/types';
import { PORT, BASE_QUESTION_URI, DB_CONNECTION } from './config';
import { QuestionsService } from './services/QuestionsService';
import { AuthRouter } from './routes/Auth.router';
import { connect, getStatus } from './models';
import { ChatService } from './services/ChatService';
import { handleError } from './helpers/ErrorHandler';



const app = express();
connect(DB_CONNECTION).then(() => {
	// tslint:disable-next-line: no-console
	console.log('MongoDB Connected Successfully!');
});

const httpServer = new nativeHttpDriver.Server(app);
const io = socketIo(httpServer);
// WARNING: app.listen(80) will NOT work here!

const waitingPeers: ChatUser[] = [];
const activeChats: { [key: string]: ChatUser; } = {};
const connectedUsers: ChatUser[] = [];

const questionsService = new QuestionsService(BASE_QUESTION_URI);

const chatService = new ChatService(httpServer, questionsService);

app.get('/', (req, res) => {
	res.redirect('https://github.com/marik22312/questions-chat-server/tree/master/docs');
});

app.get('/status', (req, res) => {
	return res.json({
		server: true,
		database: getStatus() === 1 ? true : false
	})
})

app.use('/', AuthRouter);
app.use((err, req, res, next) => {
	handleError(err, res)
})
chatService.init();

// io.on('connection', (socket) => {
// 	const socketId = socket.id;

// 	const emitError = (message: any) => {
// 		socket.emit(ErrorEvents.CHAT_ERROR, message)
// 	}

// 	interface EmitToPeersOptions {
// 		to: ChatUser,
// 		from: ChatUser,
// 		message: string,
// 		type: MessageType
// 	}
// 	const emitToPeers = (options: EmitToPeersOptions) => {
// 		const responseMessage: ChatMessageResponse = {
// 			message: options.message,
// 			from: options.from,
// 			to: options.to.userId,
// 			timestamp: Date.now(),
// 			type: options.type
// 		}
// 		io.to(options.to.socketId).emit(ChatEvents.CHAT_MESSAGE, responseMessage);
// 		socket.emit(ChatEvents.CHAT_MESSAGE, responseMessage);
// 	}

// 	socket.on(ChatEvents.READY_FOR_PEERING, (data: ReadyForPeerDto) => {
// 		const user: ChatUser = {
// 			userId: data.userId,
// 			name: data.name,
// 			socketId,
// 		}
// 		connectedUsers.push(user);
// 		if (!waitingPeers.length) {
// 			waitingPeers.push(user);
// 		} else {
// 			const peer = waitingPeers.shift();
// 			if (peer) {
// 				activeChats[user.userId] = peer;
// 				activeChats[peer.userId] = user;
// 				socket.emit(ChatEvents.PEER_FOUND, peer);
// 				io.to(activeChats[user.userId].socketId).emit(ChatEvents.PEER_FOUND, user);
// 			}

// 		}
// 	})

// 	socket.on(ChatEvents.CHAT_MESSAGE, (data: ChatMessageEvent) => {
// 		const from = connectedUsers.find(user => user.socketId === socket.id);
// 		if (!from) {
// 			return emitError(ChatErrors.MISSING_FROM)
// 		}
// 		const to = activeChats[from.userId];

// 		if (!to) {
// 			return emitError(ChatErrors.MISSING_TO)
// 		}

// 		emitToPeers({to, message: data.message, from, type: MessageType.MESSAGE});
// 	})

// 	socket.on(ChatEvents.GET_QUESTION, async () => {
// 		// get question
// 		const question = await questionsService.getOneQuestion();
// 		const from = connectedUsers.find(user => user.socketId === socket.id);
// 		if (!from) {
// 			return emitError(ChatErrors.MISSING_FROM)
// 		}
// 		const to = activeChats[from.userId];

// 		if (!to) {
// 			return emitError(ChatErrors.MISSING_TO)
// 		}


// 		return emitToPeers({to, message: question, type: MessageType.QUESTION, from});
// 	})

// 	socket.on('disconnect', () => {
// 		const user = connectedUsers.find(u => u.socketId === socketId);
// 		if (!user) {
// 			return;
// 		}
// 		const userIndex = connectedUsers.findIndex(u => u.socketId === socketId);

// 		const peer = {...activeChats[user.userId]};
// 		delete activeChats[user.userId];
// 		delete activeChats[peer.userId];
// 		connectedUsers.splice(userIndex, 1);
// 		io.to(peer.socketId).emit(ChatEvents.PEER_DISCONNECTED)
// 	})
// })

httpServer.listen(parseInt(PORT, 10), () => {
	// tslint:disable-next-line: no-console
	console.log('Server is Listening on port', PORT);
});

export {app, httpServer};