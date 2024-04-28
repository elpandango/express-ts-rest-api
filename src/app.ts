import express, {Request, Response, NextFunction} from 'express';
import mongoose from "mongoose";
import bodyParser from 'body-parser';
import path from "path";
import dotenv from 'dotenv';
dotenv.config();

import multer from 'multer';

import feedRoutes from './routes/feed';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';

const app = express();
import http from 'http';
const server = http.createServer(app);

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'dist/images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/webp' ||
      file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(multer({
  storage: fileStorage,
  fileFilter: fileFilter
})
  .single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use('/auth', authRoutes);
app.use('/feed', feedRoutes);
app.use('/user', userRoutes);

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
