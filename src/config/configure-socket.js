/*import { Server } from 'socket.io';
import { chatFunctions } from '../Service/chat.service.js';

export default async function configureSocket(httpServer){
    const io = new Server(httpServer)
    io.on('connection', async (socket) =>{
        console.log(`socket conectado `);
        socket.on('message', async data=>{
            await chatFunctions.create(data);
            const allMessage = await chatFunctions.getAll();
            io.emit('messageLogs', allMessage)
        })
        socket.on('new_user', async data=>{
            socket.emit('messageLogs', await chatFunctions.getAll());
            socket.broadcast.emit('user', data);
        })
        socket.on('registrado', async (data)=>{
            socket.emit('usuario', data);
        })
    })

}*/