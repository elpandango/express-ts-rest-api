import express, {Request, Response, NextFunction} from 'express';
import mongoose from "mongoose";
import {json} from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();

import adminRoutes from './routes/feed';
import authRoutes from './routes/auth';

const app = express();
import http from 'http';
const server = http.createServer(app);

app.use(json());

app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);


app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  const status = (<any>error).statusCode || 500;
  const message: string = error.message;
  const data = (<any>error).data;
  res.status(status).json({
    message: message,
    data: data
  });
});

const DBApiKey: any = process.env.DB_URL;

mongoose.connect(DBApiKey)
  .then(result => {
    server.listen(8080, () => {
      console.log('listening on *:8080');
    });
  })
  .catch(err => console.log(err));
