import { Router } from "express";
import ScrapperController from "@api/controllers/ScraperController";
import { asyncHandler } from "@config/helpers";
import AuthController from "@api/controllers/AuthController";

const apiRouter = Router();

apiRouter.post("/login", asyncHandler(AuthController.login));
apiRouter.get("/search", asyncHandler(ScrapperController.searchByName));

export { apiRouter };
