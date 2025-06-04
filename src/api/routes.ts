import { Router } from "express";
import ScrapperController from "@api/controllers/ScraperController";
import { asyncHandler } from "@config/helpers";
import AuthController from "@api/controllers/AuthController";

const router = Router();

router.post("/login", asyncHandler(AuthController.login));
router.get("/search", asyncHandler(ScrapperController.searchByName));

export default router;
