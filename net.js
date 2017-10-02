const server = require('net').createServer();

let counter = 0; // to keep a record of socket ids. 

let sockets = {}; // to store every socket that gets created every time a client is connected.

server.on('connection', socket => {
    socket.id = counter++;

    console.log('Client Conencted');
    socket.write('Please type your name: ');

    socket.on('data', data => {

        // very first data written on socket would be identified as name
        if (!sockets[socket.id]) {
            socket.name = data.toString().trim();
            socket.write(`Welcome ${socket.name}!\n`);

            // registering
            sockets[socket.id] = socket;
            return;
        }
        // looping over the sockets object and write data to each socket
        for (let [key, cs] of Object.entries(sockets)){
            
            // 0 == '0' return true 
            if (socket.id == key ) {
                continue;
            }
            cs.write(`${socket.name}: `);
            cs.write(data);
        }
    });

    socket.on('end', () => {
        delete sockets[socket.id];
        console.log('Client disconnected');
    })
});

server.listen(8000, () => console.log('Server bound'));

