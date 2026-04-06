import express from 'express';
import { connectdb, disconnectdb} from "./config/db.js";
import { config } from "dotenv";

// Import Routes
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import watchListRoutes from "./routes/watchListRoutes.js";

config();
connectdb();

const app =  express();

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// API Routes
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);
app.use("/watchlist", watchListRoutes);


const server = app.listen(process.env.PORT || 5001, () => {
    console.log(`Server is running on port ${process.env.PORT || 5001}`);
});

// Handle unhandled promise rejections e.g Database connection errors

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection: ", err);
    server.close(async () => {
         await disconnectdb();
         process.exit(1);
    });
});

process.on("uncaughtException", async (err) => {
    console.log("Uncaught Exception: ", err);
    await disconnectdb();
    process.exit(1);
});

process.on("SIGTERM", async() => {
    console.error("SIGTERM received, shutting down gracefully");
    server.close(async () => {
         await disconnectdb();
         process.exit(0);
    });
});

