import express from 'express';
import cors from 'cors';
import helmet from "helmet"
import morgan from "morgan";
import "dotenv/config"
import sequelize from './config/database.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

//Middleware
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}))
// app.use(morgan('dev'));

app.use('/api/auth/', authRoutes)

const PORT = process.env.PORT || 4000;
sequelize
    .sync()
    .then(()=>{
        app.listen(PORT, console.log(`Server is running on port ${PORT}`));
    })
    .catch((error)=> console.log("Database connection error",  error));
