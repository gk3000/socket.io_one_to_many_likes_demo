const express = require('express');
const app = express();

const http = require('http')
const server = http.createServer(app)

const {Server} = require('socket.io')
const io = new Server(
	server,
	{cors: {
		origin: "*"}
	}
	)

const connectedUsers = []

io.on('connection', (socket) => {
	console.log(socket.id)
	connectedUsers.push({id:socket.id, name:'',likedBy:[]})
	socket.on('disconnect', () => {
		const userIndex = connectedUsers.findIndex((user) => user.id === socket.id)
		connectedUsers.splice(userIndex, 1)
	})

	setInterval(()=>{
		socket.emit('liveUsers', {date: new Date(), usersNumber:connectedUsers.length})
	}, 1000)

	socket.on('fromClient', (msg) => {
		io.emit('fromServer', msg)
	})

	socket.on('newUser', (userName) => {
		const userIndex = connectedUsers.findIndex((user) => user.id === socket.id)
		if(userIndex !== -1){
			connectedUsers[userIndex].name = userName
		}else{
			connectedUsers.push({id:socket.id, name:userName, likedBy:[]})
		}
		io.emit('connectedUsers', connectedUsers)
	})

	socket.on('like', (recepient, sender) => {
		const recepientIndex = connectedUsers.findIndex((user) => user.name === recepient)
		if(recepientIndex !== -1 && !connectedUsers[recepientIndex].likedBy.includes(sender)){
			connectedUsers[recepientIndex].likedBy.push(sender)
		}
		socket.to(connectedUsers[recepientIndex].id).emit('connectedUsers', connectedUsers)
	})

})


require("dotenv").config()
const PORT = process.env.PORT || 4545

server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})