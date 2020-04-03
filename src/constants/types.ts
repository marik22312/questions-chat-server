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
enum MessageType {
	MESSAGE = 'message',
	QUESTION = 'question'
}
interface ChatMessageResponse extends ChatMessageEvent {
	from: string;
	timestamp: number;
	type: MessageType
}

interface ChatUser {
	socketId: string;
	userId: string;
	name: string;
}

type ActiveChatResponse = ChatMessageResponse