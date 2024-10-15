import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import nocache from "nocache";
import { messagesRouter } from "./messages/messages.router";
import { secretsRouter } from './secrets/secrets.router'
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";
import { connect, disconnect } from './mongo/connection';

dotenv.config();

if (!process.env.CLIENT_ORIGIN_URL) {
  throw new Error(
    "Missing required environment variables. Check docs for more info."
  );
}

const CLIENT_ORIGIN_URL = process.env.CLIENT_ORIGIN_URL;

export const app = express();
const apiRouter = express.Router();

// Middleware setup
app.use(express.json());
app.set("json spaces", 2);

app.use(
  helmet({
    hsts: { maxAge: 31536000 },
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        "default-src": ["'none'"],
        "frame-ancestors": ["'none'"],
      },
    },
    frameguard: { action: "deny" },
  })
);

app.use(nocache());

app.use(
  cors({
    origin: CLIENT_ORIGIN_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 86400,
  })
);

// Response content type middleware
app.use((req, res, next) => {
  res.contentType("application/json; charset=utf-8");
  next();
});

// API Routes
app.use("/api", apiRouter);
apiRouter.use("/health", messagesRouter);
apiRouter.use("/secrets", secretsRouter);

// Error handling middleware
app.use(errorHandler);
app.use(notFoundHandler);

