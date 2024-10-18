import dotenv from 'dotenv'
dotenv.config() // Load environment variables

import express from 'express'
import cors from 'cors' // Handle CORS policy errors
import connectDB from './config/connectdb.js' // Import the database connection function
import userRoutes from './routes/userRoutes.js'

const app = express();
const port = process.env.PORT || 8000; // Set the port (default 8000)
const DATABASE_URL = process.env.DATABASE_URL; // Get database URL from environment variables

// CORS policy middleware
app.use(cors());

// Database connection
connectDB(DATABASE_URL);

//JSON response middleware
app.use(express.json());

// Load routes
app.use("/api/user",userRoutes)

// Start the server
app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});
