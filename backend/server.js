import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import userRoutes from './routes/route.js';
import Connection from './database/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

// --- FINAL FIX: Explicitly define path to and load the .env file ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });
// --- END FIX ---


mongoose.set('strictQuery', true);

const app = express();
const server = http.createServer(app); // Create HTTP server


app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  credentials: true,

}));
// In backend/server.js
app.use(cors({
  origin: "*", // Allow all origins for now
  credentials: true,
}));


app.use(cookieParser());
app.use (bodyParser.json ({extended: true}));
app.use (bodyParser.urlencoded({extended: true}));

// This will now correctly use the SESSION_SECRET loaded from the .env file
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// Use the __dirname variable defined at the top
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/upload1', express.static(path.join(__dirname, 'upload1')));

// This function will now correctly use the MONGO_URI from the .env file
Connection();

app.use('/', userRoutes);

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log("Server is running on port", port);
});
