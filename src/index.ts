import express from 'express';

const server = express();

server.listen(process.env.PORT || 3000);

server.get('/', (req, res) => {
	res.send('Omer Ya Ashah!');
})