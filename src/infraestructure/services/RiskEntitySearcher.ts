import { SourceName } from "@domain/enums/SourceName";
import { ScrappingResponse } from "@domain/interfaces/ScrappingResponse";
import { ScrappingSource } from "@domain/interfaces/ScrappingSource";
import { IRiskEntitySearcher } from "@domain/services/IRiskEntitySearcher";
import { IScraper } from "@domain/services/IScraper";
import { OfacScraper, WorldBankScraper } from "@infraestructure/scrappers";
import { Page } from "puppeteer";

export class RiskEntitySearcher implements IRiskEntitySearcher {
    private readonly scrappers: IScraper[];

    constructor(pages: Page[]) {
        this.scrappers = [new OfacScraper(pages[0]), new WorldBankScraper(pages[1])];
        // new ICijScraper(pages[0]),
    }

    async search(entityName: string, sources: SourceName[]): Promise<ScrappingResponse> {
        const sourcesResponse = await this.getSourcesResponse(entityName, sources);
        const totalHits = sourcesResponse.reduce((acc, s) => acc + (s.hits ?? 0), 0);
        return {
            query: entityName,
            totalHits,
            sources: sourcesResponse,
        };
    }

    private async getSourcesResponse(
        entityName: string,
        sources: SourceName[],
    ): Promise<ScrappingSource[]> {
        const responses: ScrappingSource[] = [];

        for (const scraper of this.scrappers) {
            if (!sources.includes(scraper.sourceName)) continue;

            const result = await scraper.getData(entityName);
            if (result.hits > 0) responses.push(result);
        }

        return responses;
    }
}
