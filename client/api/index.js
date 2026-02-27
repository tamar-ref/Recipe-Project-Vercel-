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

/**
 * הפתרון ללא vercel.json:
 * אנחנו מגדירים ראוטר מרכזי שתופס את כל הנתיבים שתחת /api
 */
const mainRouter = express.Router();

mainRouter.use('/categories', categoryRouter);
mainRouter.use('/recipes', recipeRouter);
mainRouter.use('/users', userRouter);

mainRouter.get('/', (req, res) => {
  res.send('Hello World!');
});

// כאן הקסם: אנחנו אומרים לאפליקציה להשתמש בראוטר הזה עבור הכתובת של הקובץ
app.use('/api', mainRouter);

/**
 * חשוב מאוד: ב-Vercel, כשאין הגדרות, הקובץ index.js בתיקיית api
 * מקבל לעיתים את הנתיב כאילו הוא בשורש. השורה הבאה מוודאת שגם
 * נתיבים "ערומים" יעבדו.
 */
app.use('/', mainRouter); 

app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
}

export default app;