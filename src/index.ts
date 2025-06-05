import "module-alias/register";
import "source-map-support/register";
import express from "express";
import logger from "@config/helpers/logger";
import { errorHandler, notFoundHandler } from "@api/middlewares";
import { Config } from "@config/config";
import rateLimit from "express-rate-limit";
import { TooManyRequestsException } from "@config/exceptions/exceptions";
import { initializeUsers } from "@data/users";
import { authenticateJWT } from "@api/middlewares/authMiddleware";
import { authenticateInternalKey } from "@api/middlewares/internalMiddleware";
import { apiRouter } from "@api/routes/api";
import { internalRouter } from "@api/routes/internal";

const globalRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_, __, next, ___) => next(new TooManyRequestsException()),
});

const app = express();

app.use(globalRateLimiter);
app.use(express.json());

app.use("/api", authenticateJWT, apiRouter);
app.use("/internal", authenticateInternalKey, internalRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = Config.port;
app.listen(PORT, async () => {
    await initializeUsers();
    logger.info(`Servidor escuchando en http://localhost:${PORT}`);
});
