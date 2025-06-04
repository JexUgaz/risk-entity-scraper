import { Request, Response } from "express";
import { BadRequestException } from "@config/exceptions/exceptions";
import { IRiskEntitySearcher } from "@domain/services/IRiskEntitySearcher";
import { RiskEntitySearcher } from "@infraestructure/services/RiskEntitySearcher";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { ApiResponse } from "@config/helpers";
import { Config } from "@config/config";

class ScrapperController {
    public static async searchByName(req: Request, res: Response) {
        const { name } = req.query;

        if (!name || typeof name !== "string") {
            throw new BadRequestException('El parámetro "name" es requerido y debe ser un string.');
        }

        puppeteer.use(StealthPlugin());
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox"],
            executablePath: Config.chromeExecutablePath,
        });
        const pages = await Promise.all([browser.newPage(), browser.newPage()]);

        const searcherService: IRiskEntitySearcher = new RiskEntitySearcher(pages);

        const scrappingResponse = await searcherService.search(name);

        const message =
            scrappingResponse.totalHits === 0
                ? `No results found for '${name}' in selected sources.`
                : "Search completed successfully.";
        const response = ApiResponse.success(message, scrappingResponse);

        res.json(response);
    }
}

export default ScrapperController;
