import { Server } from 'socket.io'

var CountdownInterval
var counter = 0

const SocketHandler = (req, res) => {
    if (res.socket.server.io) {
        console.log('Socket is already running')
    } else {
        console.log('Socket is initializing')
        const io = new Server(res.socket.server)
        res.socket.server.io = io

        io.on('connection', socket => {
            socket.on('start', msg => {
                console.log(msg)
                counter = parseInt(msg)
                clearInterval(CountdownInterval);
                CountdownInterval = setInterval(function () {
                    io.emit('counter', counter);
                    // socket.broadcast.emit('counter', counter);
                    counter--
                    if (counter === 0) {
                        io.emit('counter', "Counter completed");
                        // socket.broadcast.emit('counter', "Counter completed");
                        clearInterval(CountdownInterval);
                    }
                }, 100);
            })
        });
    }
    res.end()
}

export default SocketHandler