interface PeerFoundObjectDto {
	userId: string;
	name: string;
}

interface ReadyForPeerDto {
	userId: string;
	name: string;
}

interface ChatMessageDto {
	from: string;
	to: string;
	message: string;
}

interface ChatUser {
	socketId: string;
	userId: string;
	name: string;
}