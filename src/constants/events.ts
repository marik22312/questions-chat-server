export enum ChatEvents {
	CONNECTED_TO_SERVER = 'CONNECTED_TO_SERVER',
	DISCONNECTED_FROM_SERVER = 'DISCONNECTED_FROM_SERVER',
	READY_FOR_PEERING = 'READY_FOR_PEERING',
	SEARCHING_FOR_PEER = 'SEARCHING_FOR_PEER',
	PEER_FOUND = 'PEER_FOUND',
	CHAT_MESSAGE = 'CHAT_MESSAGE',
	PEER_DISCONNECTED = 'PEER_DISCONNECTED',
	GET_QUESTION = 'GET_QUESTION'
}

export enum ErrorEvents {
	CHAT_ERROR = 'CHAT_ERROR'
}

export enum ChatErrors {
	MISSING_FROM = 'You are not participating in any chats at the moment. please peer again.',
	MISSING_TO = `Couldn't find your recipient, please be sure you didn't receive a 'PEER_DISCONNECTED' event.`
}

export enum MessageType {
	MESSAGE = 'message',
	QUESTION = 'question'
}