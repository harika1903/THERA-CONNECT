import mongoose from "mongoose";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// --- FINAL FIX: Load the .env file from within this file ---
// This makes this module independent of the load order in server.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Resolve path to go one directory up to the 'backend' folder to find the .env file
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
// --- END FIX ---


export const Connection = async () => {
    const URL = process.env.MONGO_URI;

    // Add a definitive check to see if the URL was loaded
    if (!URL) {
        console.error("FATAL ERROR: MONGO_URI not found. Check that the .env file exists in the 'backend' directory and is configured correctly.");
        // Exit the application if the database connection string is not found
        return process.exit(1); 
    }

    try {
        // The options {useUnifiedTopology: true, useNewUrlParser: true} are removed
        // as they are no longer needed in the current version of the MongoDB driver.
        await mongoose.connect(URL);
        console.log ('Database connected successfully!!!');
    } catch (error) {
        console.log ('Error while connecting with the database', error.message);
    }
}

export default Connection;
 