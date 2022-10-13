import express, { Express } from 'express';
import * as http from 'http';
import next, { NextApiHandler } from 'next';
import * as socketio from 'socket.io';
import bodyParser from 'body-parser';
import passport from 'passport';
import { getGoogleStrategy } from './auth/GoogleAuth';
import { handleSocketIOConnections } from './game/gameLogic';
import { authSocketPolicy } from './auth/socketPolicy';
import { connectToMongo } from './db/dataBase';

const port: number = parseInt(process.env.PORT || '3000', 10);
const dev: boolean = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
    const app: Express = express();
    const server: http.Server = http.createServer(app);
    const io: socketio.Server = new socketio.Server();

    connectToMongo();

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(passport.initialize());

    passport.use(getGoogleStrategy());

    io.attach(server);
    io.use(authSocketPolicy);

    handleSocketIOConnections(io);

    app.all('*', (req: any, res: any) => nextHandler(req, res));

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});