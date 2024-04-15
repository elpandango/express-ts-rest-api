import express, {Request, Response, NextFunction} from 'express';
import mongoose from "mongoose";
import {json} from 'body-parser';
import path from "path";
import dotenv from 'dotenv';
dotenv.config();

// const multer = require('multer');

import adminRoutes from './routes/feed';
import authRoutes from './routes/auth';

const app = express();
import http from 'http';
const server = http.createServer(app);

// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'images');
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString() + '-' + file.originalname);
//   }
// });
//
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === 'image/png' ||
//     file.mimetype === 'image/jpg' ||
//     file.mimetype === 'image/jpeg') {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

app.use(json());
// app.use(multer({
//   storage: fileStorage,
//   fileFilter: fileFilter
// })
//   .single('image'));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);


app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  const status = (<any>error).statusCode || 500;
  const message: string = error.message;
  const data = (<any>error).data;

  console.log('!!!ERROR!!!', error);

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
