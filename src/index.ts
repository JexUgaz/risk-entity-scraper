import "module-alias/register";
import "express-async-errors";

import logger from "@config/helpers/logger";
import { Config } from "@config/config";
import "source-map-support/register";
import express from "express";
import { errorHandler, notFoundHandler } from "@api/middlewares";
import rateLimit from "express-rate-limit";
import { TooManyRequestsException } from "@config/exceptions/exceptions";
import { authenticateJWT } from "@api/middlewares/authMiddleware";
import { authenticateInternalKey } from "@api/middlewares/internalMiddleware";
import { apiRouter } from "@api/routes/api";
import { internalRouter } from "@api/routes/internal";
import { initializeUsers } from "@data/users";

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
