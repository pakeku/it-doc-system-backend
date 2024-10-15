import * as dotenv from "dotenv";
import { connect, disconnect } from './mongo/connection';
import { app } from "./app";
dotenv.config();

if (!process.env.PORT) {
  throw new Error(
    "Missing required environment variables. Check docs for more info."
  );
}

const PORT = parseInt(process.env.PORT, 10);

// Start server and handle graceful shutdown
const startServer = async () => {
  try {
    await connect(); // Connect to the database

    const server = app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log("Shutting down server...");
      await disconnect(); // Close MongoDB connection
      server.close(() => {
        console.log("Server closed.");
        process.exit(0);
      });
    };

    // Catch termination signals
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); // Exit with failure code if server can't start
  }
};

startServer();