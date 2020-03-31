# Welcome to questions-chat-api 👋
> Super simple random chat api!

## Usage
 
### Peering to a waiting chat
To join the waitlist, just send the `READY_FOR_PEERING` event with the following object
```typescript
interface ReadyForPeerDto {
	userId: string;
	name: string;
}
```
If a peer is waiting on the list, you will recieve the `PEER_FOUND` with the following data
```typescript
interface ChatUser {
	socketId: string;
	userId: string;
	name: string;
}
```

### Sending messages
Send `CHAT_MESSAGE` event
```typescript
interface ChatMessageEvent {
	to: string;
	message: string;
}
```

the server will handle the peering, and will respond with `CHAT_MESSAGE` to both peers:
```typescript
interface ChatMessageResponse {
	to: string;
	message: string;
	from: string;
}
```

### Peer disconnection
When a peer disconnects from the socket, his active chat parthner will receive a `PEER_DISCONNECTED` event.

## Errors

```typescript
enum ErrorEvents {
	CHAT__ERROR = 'CHAT_ERROR' // General chat error, will come with a string message.
}
```
## Author

👤 **Marik Shnitman <mark22312@gmail.com>**

* Twitter: [@marik_sh](https://twitter.com/marik_sh)
* Github: [@marik22312](https://github.com/marik22312)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/marik22312/question-something-api/issues).

## Show your support

Give a ⭐️ if this project helped you!



***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_