interface PeerFoundObjectDto {
	userId: string;
	name: string;
}

interface ReadyForPeerDto {
	userId: string;
	name: string;
}

interface ChatMessageEvent {
	to: string;
	message: string;
}

interface ChatMessageResponse extends ChatMessageEvent {
	from: string;
}

interface ChatUser {
	socketId: string;
	userId: string;
	name: string;
}

type ActiveChatResponse = ChatMessageResponse