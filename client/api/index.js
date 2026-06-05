import { config } from 'dotenv';
import { connectDB } from './config/db.js';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { categoryRouter } from './routes/category.route.js';
import { recipeRouter } from './routes/recipe.route.js';
import { userRouter } from './routes/user.route.js';
import { errorHandler, notFound } from './middlewares/errorHandling.middleware.js';

config();
connectDB();
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));
app.use(cors());

app.use('/api/category', categoryRouter);
app.use('/api/recipe', recipeRouter);
app.use('/api/user', userRouter);
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