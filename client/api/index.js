import { config } from 'dotenv';
import { connectDB } from './config/db.js';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { categoryRouter, recipeRouter, userRouter } from './routes/routes.js';
import { errorHandler, notFound } from './middlewares/errorHandling.middleware.js';

config();
connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());

app.use('/api/categories', categoryRouter);
app.use('/api/recipes', recipeRouter);
app.use('/api/users', userRouter);
app.get('/api', (req, res) => {
  res.send('Hello World!');
});

app.use(notFound);
app.use(errorHandler);
if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
}
export default app;