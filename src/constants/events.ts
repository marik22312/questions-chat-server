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
	CHAT__ERROR = 'CHAT_ERROR'
}