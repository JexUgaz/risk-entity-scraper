import { Router } from "express";
import ScrapperController from "@api/controllers/ScraperController";
import { asyncHandler } from "@config/helpers";

const internalRouter = Router();

internalRouter.get("/screening", asyncHandler(ScrapperController.searchByName));

export { internalRouter };
