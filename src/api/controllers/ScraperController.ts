import { Request, Response } from "express";
import { BadRequestException } from "@config/exceptions/exceptions";
import { IRiskEntitySearcher } from "@domain/services/IRiskEntitySearcher";
import { RiskEntitySearcher } from "@infraestructure/services/RiskEntitySearcher";
import puppeteer from "puppeteer";
import { ApiResponse } from "@config/helpers";
import { SourceName } from "@domain/enums/SourceName";
import { Config } from "@config/config";

class ScrapperController {
    public static async searchByName(req: Request, res: Response) {
        const { name } = req.query;

        if (!name || typeof name !== "string") {
            throw new BadRequestException('The "name" parameter is required and must be a string.');
        }

        const sources = ScrapperController.getSourcesFilter(
            req.query.sources as undefined | string,
        );

        const browser = await puppeteer.launch({
            headless: true,
            executablePath: Config.chromeExecutablePath,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const pages = await Promise.all([browser.newPage(), browser.newPage()]);

        const searcherService: IRiskEntitySearcher = new RiskEntitySearcher(pages);

        const scrappingResponse = await searcherService.search(name, sources);

        const message =
            scrappingResponse.totalHits === 0
                ? `No results found for '${name}' in selected sources.`
                : "Search completed successfully.";
        const response = ApiResponse.success(message, scrappingResponse);

        res.json(response);
    }

    private static getSourcesFilter(data?: undefined | string): SourceName[] {
        if (!data) return [SourceName.OFAC, SourceName.OFFSHORE_LEAKS, SourceName.WORLD_BANK];
        return data
            .split(",")
            .map((s) => s.trim().toUpperCase())
            .filter((s) => Object.values(SourceName).includes(s as SourceName)) as SourceName[];
    }
}

export default ScrapperController;
