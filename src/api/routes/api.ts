import { Router } from "express";
import ScrapperController from "@api/controllers/ScraperController";
import AuthController from "@api/controllers/AuthController";

const apiRouter = Router();

apiRouter.post("/login", AuthController.login);
apiRouter.get("/search", ScrapperController.searchByName);

export { apiRouter };
