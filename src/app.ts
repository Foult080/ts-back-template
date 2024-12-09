import dotenv from 'dotenv';
dotenv.config();
import express, { Express, Request, Response } from 'express';
import router from './router/';
import cors from 'cors';
import { debug } from 'console';
import { errorHandler } from './middlewares/errors-handler';
import path from 'path';

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', router);
app.use(errorHandler);
app.use(express.static(path.join(__dirname, '../', 'build')));
app.use('*', (req: Request, res: Response) => res.sendFile(path.resolve(__dirname, '../', 'build', 'index.html')));

const server = app.listen(PORT, () => console.info(`[SERVER]: Server is running at http://localhost:${PORT}`));

const onServerClose = async (msg: string) => {
  console.info('[Server]: ' + msg);
  server.close(() => debug('HTTP server closed'));
};

process.on('SIGTERM', async () => onServerClose('Call SIGTERM. Server is shutdown'));
process.on('SIGINT', async () => onServerClose('Call SIGINT. Server is shutdown'));
