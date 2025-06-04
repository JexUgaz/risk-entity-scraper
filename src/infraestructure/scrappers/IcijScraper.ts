import { ScrappingResult } from "@domain/interfaces/ScrappingResult";
import { ScrappingSource } from "@domain/interfaces/ScrappingSource";
import { IScraper } from "@domain/services/IScraper";
import { Page } from "puppeteer";

export class ICijScraper implements IScraper {
    constructor(private readonly page: Page) {}

    async getData(query: string): Promise<ScrappingSource> {
        const searchUrl = `https://offshoreleaks.icij.org/search?q=${encodeURIComponent(query)}&c=&j=&d=`;

        await this.page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        );
        await this.page.goto(searchUrl, { waitUntil: "domcontentloaded" });

        const results = await this.page.evaluate((): ScrappingResult[] => {
            const data: ScrappingResult[] = [];

            const container = document.getElementById("search_results");
            if (!container) return [];

            const table = container.querySelector("table");
            if (!table) return [];

            const rows = table.querySelectorAll("tbody tr");

            rows.forEach((tr) => {
                const tds = tr.querySelectorAll("td");
                if (tds.length === 4) {
                    data.push({
                        name: tds[0].innerText.trim(),
                        address: tds[2].innerText.trim(),
                    });
                }
            });
            return data;
        });

        return {
            name: "OFFSHORE_LEAKS",
            hits: results.length,
            results: results,
        };
    }
}
