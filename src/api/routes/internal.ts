import { Router } from "express";
import ScrapperController from "@api/controllers/ScraperController";

const internalRouter = Router();

internalRouter.get("/screening", ScrapperController.searchByName);

export { internalRouter };
