import { SourceName } from "@domain/enums/SourceName";
import { ScrappingResult } from "@domain/interfaces/ScrappingResult";
import { ScrappingSource } from "@domain/interfaces/ScrappingSource";
import { IScraper } from "@domain/services/IScraper";
import { Page } from "puppeteer";

export class OfacScraper implements IScraper {
    constructor(private readonly page: Page) {}

    sourceName: SourceName = SourceName.OFAC;

    async getData(query: string): Promise<ScrappingSource> {
        const searchUrl = `https://sanctionssearch.ofac.treas.gov/`;

        await this.page.goto(searchUrl, { waitUntil: "domcontentloaded" });

        await this.page.evaluate((query: string): boolean => {
            const input = document.getElementById(
                "ctl00_MainContent_txtLastName",
            ) as HTMLInputElement | null;

            if (!input) return false;

            input.value = query;

            const searchButton = document.getElementById("ctl00_MainContent_btnSearch");

            if (!searchButton) return false;

            searchButton.click();
            return true;
        }, query);

        await this.page.waitForNavigation({ waitUntil: "load" });

        const results = await this.getTableResults();

        return {
            name: this.sourceName,
            hits: results.length,
            results: results,
        };
    }

    private async getTableResults(): Promise<ScrappingResult[]> {
        return await this.page.evaluate((): ScrappingResult[] => {
            const table = document.getElementById("gvSearchResults");
            if (!table) return [];

            const rows = Array.from(table.querySelectorAll("tbody tr"));

            return rows
                .filter((row) => row.querySelectorAll("td").length === 6)
                .map((row): ScrappingResult => {
                    const cells = Array.from(row.querySelectorAll("td"));
                    return {
                        name: cells[0].innerText.trim(),
                        address: cells[1].innerText.trim(),
                        sanctionPrograms: cells[3].innerText.trim(),
                    };
                });
        });
    }
}
