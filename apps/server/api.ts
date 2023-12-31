import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import { MongoInstance } from './lib/helpers/db';
import { log } from '@mhgo/utils';

import { routerV1 } from './lib/routerV1';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

dotenv.config();
const app = express();

const allowedOrigins = [
  process.env.CORS_CLIENT ?? 'http://localhost:3091',
  process.env.CORS_ADMIN ?? 'http://localhost:3093',
];

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: false }));
app.use(
  cors({
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    origin: allowedOrigins,
  }),
);
app.set('trust proxy', 1);

app.use('/api/v1', routerV1);

app.listen(process.env.PORT, async () => {
  log.INFO(`Server listening at port ${process.env.PORT}!`);
});

/**
 * Initializing the database
 */

export const mongoInstance = new MongoInstance();
