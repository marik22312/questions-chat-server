import { Server as HttpServer } from "http";
import socketIo, { Server as SocketIoServer, Socket } from "socket.io";
import {
	ErrorEvents,
	MessageType,
	ChatEvents,
	ChatErrors,
} from "../constants/events";
import {
	ChatUser,
	ChatMessageResponse,
	ReadyForPeerDto,
	ChatMessageEvent,
} from "../constants/types";
import { QuestionsService } from "./QuestionsService";

interface EmitToPeersOptions {
	to: ChatUser;
	from: ChatUser;
	message: string;
	type: MessageType;
}

export class ChatService {
	private io: SocketIoServer;
	private waitingPeers: ChatUser[] = [];
	private activeChats: { [key: string]: ChatUser } = {};
	private connectedUsers: ChatUser[] = [];
	constructor(
		private httpServer: HttpServer,
		private questionsService: QuestionsService
	) {
		this.io = socketIo(this.httpServer);
	}

	public init() {
		this.io.on("connection", (socket: Socket) => {
			const socketId = socket.id;
			const emitToPeers = (options: EmitToPeersOptions) => {
				return this.emitToPeers(options, socket);
			};

			socket.on(
				ChatEvents.READY_FOR_PEERING,
				this.onReadyForPeering(socketId, socket)
			);

			socket.on(ChatEvents.CHAT_MESSAGE, (data: ChatMessageEvent) => {
				const from = this.connectedUsers.find(
					(user) => user.socketId === socket.id
				);
				if (!from) {
					return this.emitError(socket, ChatErrors.MISSING_FROM);
				}
				const to = this.activeChats[from.userId];

				if (!to) {
					return this.emitError(socket, ChatErrors.MISSING_TO);
				}

				emitToPeers({
					to,
					message: data.message,
					from,
					type: MessageType.MESSAGE,
				});
			});

			socket.on(ChatEvents.GET_QUESTION, async () => {
				// get question
				const question = await this.questionsService.getOneQuestion();
				const from = this.connectedUsers.find(
					(user) => user.socketId === socket.id
				);
				if (!from) {
					return this.emitError(socket, ChatErrors.MISSING_FROM);
				}
				const to = this.activeChats[from.userId];

				if (!to) {
					return this.emitError(socket, ChatErrors.MISSING_TO);
				}

				return emitToPeers({
					to,
					message: question,
					type: MessageType.QUESTION,
					from,
				});
			});

			socket.on("disconnect", () => {
				const user = this.connectedUsers.find((u) => u.socketId === socketId);
				if (!user) {
					return;
				}
				const userIndex = this.connectedUsers.findIndex(
					(u) => u.socketId === socketId
				);

				const peer = { ...this.activeChats[user.userId] };
				delete this.activeChats[user.userId];
				delete this.activeChats[peer.userId];
				this.connectedUsers.splice(userIndex, 1);
				this.io.to(peer.socketId).emit(ChatEvents.PEER_DISCONNECTED);
			});
		});
	}

	private onReadyForPeering(
		socketId: string,
		socket: socketIo.Socket
	): (...args: any[]) => void {
		return (data: ReadyForPeerDto) => {
			const user: ChatUser = {
				userId: data.userId,
				name: data.name,
				category: data.category,
				socketId,
			};
			this.connectedUsers.push(user);
			if (!this.waitingPeers.length) {
				this.waitingPeers.push(user);
			} else {
				const peerIndex = this.waitingPeers.findIndex(
					(u) => u.category === user.category
				);
				if (peerIndex === -1) {
					return this.waitingPeers.push(user);
				}
				const peer = this.waitingPeers[peerIndex];
				this.waitingPeers.splice(peerIndex, 1);
				this.activeChats[user.userId] = peer;
				this.activeChats[peer.userId] = user;
				socket.emit(ChatEvents.PEER_FOUND, peer);
				this.io
					.to(this.activeChats[user.userId].socketId)
					.emit(ChatEvents.PEER_FOUND, user);
			}
		};
	}

	private emitToPeers(options: EmitToPeersOptions, socket: socketIo.Socket) {
		const responseMessage: ChatMessageResponse = {
			message: options.message,
			from: options.from,
			to: options.to.userId,
			timestamp: Date.now(),
			type: options.type,
		};
		this.io
			.to(options.to.socketId)
			.emit(ChatEvents.CHAT_MESSAGE, responseMessage);
		socket.emit(ChatEvents.CHAT_MESSAGE, responseMessage);
	}

	private emitError(socket: socketIo.Socket, message: any) {
		return socket.emit(ErrorEvents.CHAT_ERROR, message);
	}
}
