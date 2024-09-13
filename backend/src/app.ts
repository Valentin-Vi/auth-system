import('dotenv');

import express from "express";
import authRouter from "./routes/authRoutes";
const app = express();

const cookieParser = require('cookie-parser');
const cors = require('cors');

const PORT = process.env.PORT;

// Enable JSON
app.use(express.json());

// Enable cookie parsing
app.use(cookieParser());

// Enable Cross Origin Resource Sharing
app.use(cors({
    origin: ['http://localhost:4000', 'http://127.0.0.1:4000'],
    credentials: true
}));

// Routes
app.use('/auth', authRouter);

// Port
app.listen(PORT, () => {
    console.log('Listening to PORT:', PORT);
});