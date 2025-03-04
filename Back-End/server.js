import express from 'express';
import cors from 'cors';
import helmet from "helmet"
import morgan from "morgan";
import "dotenv/config"
import authRoutes from './routes/authRoutes.js';
const app = express();

const PORT = process.env.PORT || 4000;

//Middleware
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(morgan('dev'));

app.use('/api/auth', authRoutes)

app.listen(PORT, ()=>{
    console.log(`Your server is listening at ${PORT}`)
})