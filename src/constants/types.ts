import { MessageType } from './events';

export interface PeerFoundObjectDto {
	userId: string;
	name: string;
}

export interface ReadyForPeerDto {
	userId: string;
	name: string;
}

export interface ChatMessageEvent {
	to: string;
	message: string;
}
export interface ChatMessageResponse extends ChatMessageEvent {
	from: ChatUser;
	timestamp: number;
	type: MessageType
}

export interface ChatUser {
	socketId: string;
	userId: string;
	name: string;
}

export type ActiveChatResponse = ChatMessageResponse