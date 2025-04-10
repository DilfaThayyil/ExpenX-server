import morgan from 'morgan';
import { createStream } from 'rotating-file-stream';
import path from 'path';
import fs from 'fs';

const logDirectory = path.resolve(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const accessLogStream = createStream('access.log', {
  interval: process.env.LOG_INTERVAL || '1d', 
  path: logDirectory,
});

const loggers = [
  morgan('combined', { stream: accessLogStream }),
  morgan('dev'),
];

export default loggers