import express, { Express } from 'express';
import * as http from 'http';
import next, { NextApiHandler } from 'next';
import * as socketio from 'socket.io';
import bodyParser from 'body-parser';
import passport from 'passport';
import { getGoogleStrategy } from './auth/GoogleAuth';
import { authSocketPolicy } from './auth/socketPolicy';
import { connectToMongo } from './db/dataBase';
import { GameManager } from './game/GameManager';
import { Log } from '../utils/console';
import { setCookie } from 'cookies-next';

const port: number = parseInt(process.env.PORT || '3000', 10);
const dev: boolean = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
    const app: Express = express();
    const server: http.Server = http.createServer(app);
    const io: socketio.Server = new socketio.Server();
    const gameManager: GameManager = new GameManager(io);

    connectToMongo();



    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(passport.initialize());

    passport.use(getGoogleStrategy());

    io.attach(server);
    io.use(authSocketPolicy);

    app.get('/api/google/', (req, res, next) => {
        passport.authenticate('google', {
            scope: ['profile', 'email'],
        })(req, res, next);
    });

    app.get('/api/google/callback', (req, res, next) => {
        passport.authenticate('google', (err, user, info) => {
            if (err || !user) {
              return res.redirect('/?a=auth_fail');
            }
    
            Log(`Google auth callback message ${info.message}`, 'info');
        
            // set cookie and send redirect
            setCookie("token", user.token, {
              req,
              res,
            });
            res.redirect('/game');
        })(req, res, next);
    });

    gameManager.handleConnections();

    app.all('*', (req: any, res: any) => nextHandler(req, res));

    server.listen(port, () => {
        Log(`> Ready on http://localhost:${port}`, 'info');
    });
});