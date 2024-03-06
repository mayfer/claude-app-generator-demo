
import http from "http";
import { Server } from "socket.io";
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

export const app = express();
export const server = http.createServer(app);
export const io = new Server(server);

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// serve static files
app.get('/client/:file', (req, res) => {
    // res.sendFile(__dirname + '../client/' + req.params.file);
    const filepath = path.join(__dirname, '../client', req.params.file);
    try {
        res.sendFile(filepath);
    } catch (e) {
        res.send("");
    }
})

const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log('Server is running on port ' + port);
});
