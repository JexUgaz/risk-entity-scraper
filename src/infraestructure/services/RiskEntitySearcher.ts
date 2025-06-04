import { ScrappingResponse } from "@domain/interfaces/ScrappingResponse";
import { IRiskEntitySearcher } from "@domain/services/IRiskEntitySearcher";
import { IScraper } from "@domain/services/IScraper";
import { OfacScraper, WorldBankScraper } from "@infraestructure/scrappers";
import { Page } from "puppeteer";

export class RiskEntitySearcher implements IRiskEntitySearcher {
    private readonly ofacScraper: IScraper;
    private readonly worldBankScraper: IScraper;

    constructor(pages: Page[]) {
        this.ofacScraper = new OfacScraper(pages[0]);
        this.worldBankScraper = new WorldBankScraper(pages[1]);
        // new ICijScraper(pages[0]),
    }

    async search(entityName: string): Promise<ScrappingResponse> {
        const [ofacResults, worldBankResults] = await Promise.all([
            this.ofacScraper.getData(entityName),
            this.worldBankScraper.getData(entityName),
        ]);

        const sources = [ofacResults, worldBankResults].filter((source) => source.hits > 0);
        const totalHits = ofacResults.hits + worldBankResults.hits;
        return {
            query: entityName,
            totalHits,
            sources,
        };
    }
}
