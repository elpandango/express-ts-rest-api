import express, {Request, Response, NextFunction} from 'express';
import mongoose from "mongoose";
import {json} from 'body-parser';

import adminRoutes from './routes/feed';

const app = express();
import http from 'http';
const server = http.createServer(app);

app.use(json());

app.use('/admin', adminRoutes);


app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  const status = (<any>error).statusCode || 500;
  const message = error.message;
  const data = (<any>error).data;
  res.status(status).json({
    message: message,
    data: data
  });
});

// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   res.status(500).json({
//     message: err.message
//   });
// });

// app.listen(3000);


mongoose.connect('mongodb+srv://radchenko_eugen:123Spider.123@eugencluster.i3ssgtk.mongodb.net/blog')
  .then(result => {
    server.listen(8080, () => {
      console.log('listening on *:8080');
    });
  })
  .catch(err => console.log(err));
