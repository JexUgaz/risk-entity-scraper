import { SourceName } from "@domain/enums/SourceName";
import { ScrappingResult } from "@domain/interfaces/ScrappingResult";
import { ScrappingSource } from "@domain/interfaces/ScrappingSource";
import { IScraper } from "@domain/services/IScraper";
import { Page } from "puppeteer";

export class WorldBankScraper implements IScraper {
    constructor(private readonly page: Page) {}
    sourceName: SourceName = SourceName.WORLD_BANK;

    async getData(query: string): Promise<ScrappingSource> {
        const searchUrl = `https://projects.worldbank.org/en/projects-operations/procurement/debarred-firms`;

        await this.page.goto(searchUrl, { waitUntil: "domcontentloaded" });

        await this.waitUntilFinishLoading();

        const results1 = await this.getFirstTableData(query);
        const results2 = await this.getSecondTableData(query);

        const finalResult = [...results1, ...results2];

        return {
            url: searchUrl,
            name: this.sourceName,
            hits: finalResult.length,
            results: finalResult,
        };
    }

    private async getSecondTableData(query: string): Promise<ScrappingResult[]> {
        return await this.page.evaluate((query: string): ScrappingResult[] => {
            const tables = Array.from(document.querySelectorAll("table"));

            const targetTable = tables.find((table) => {
                const prev = table.previousElementSibling as HTMLElement | null;
                if (!prev) return false;
                const text = prev.innerText?.toLowerCase() ?? "";
                return text.includes("table 2");
            });

            if (!targetTable) return [];

            const tbody = targetTable.querySelector("tbody");
            if (!tbody) return [];

            const rows = Array.from(tbody.querySelectorAll("tr"));

            const dataRows = rows.slice(1);

            return dataRows
                .map((tr): ScrappingResult | null => {
                    const tds = tr.querySelectorAll("td");
                    const firstTd = tds[0];

                    const firstBold = firstTd.querySelector("b");
                    const name = firstBold ? firstBold.innerText.trim() : null;

                    const fullText = firstTd.innerText.trim();
                    const address = fullText
                        .replace(name ?? "", "")
                        .replace(/\*\d+/, "")
                        .trim()
                        .replace(/\n+/g, ", ")
                        .replace(/^\s*,\s*/, "");

                    const fullName = `${name} ${address}`;

                    if (!fullName.toLowerCase().includes(query.toLowerCase())) return null;

                    return {
                        name: name ?? address,
                        address: address,
                        date: tds[1]?.innerText.trim(),
                        sanctionImposed: tds[2]?.innerText.trim(),
                        grounds: tds[3]?.innerText.trim(),
                    };
                })
                .filter((d) => d !== null);
        }, query);
    }

    private async getFirstTableData(query: string): Promise<ScrappingResult[]> {
        return this.page.evaluate((query: string): ScrappingResult[] => {
            const container = document.getElementById("k-debarred-firms");
            if (!container) return [];

            const gridContent = container.querySelector(".k-grid-content");
            if (!gridContent) return [];

            const table = gridContent.querySelector("table");
            if (!table) return [];

            const tbody = table.querySelector("tbody");
            if (!tbody) return [];

            const trs = tbody.querySelectorAll("tr");
            const arrayRows = Array.from(trs);

            return arrayRows
                .map((tr): ScrappingResult | null => {
                    const tds = tr.querySelectorAll("td");
                    if (tds.length < 7) return null;

                    const name = tds[0].innerText.trim();
                    if (!name.toLowerCase().includes(query.toLowerCase())) return null;

                    return {
                        name,
                        address: `${tds[2].innerText.trim()}, ${tds[3].innerText.trim()}`,
                        date: `${tds[4].innerText.trim()} - ${tds[5].innerText.trim()}`,
                        grounds: tds[6].innerText.trim(),
                    };
                })
                .filter((d) => d !== null);
        }, query);
    }

    private async waitUntilFinishLoading() {
        while (true) {
            const display = await this.page.evaluate(() => {
                const el = document.getElementsByClassName("ajax-div")[0];
                if (!el) return null;

                const data =
                    document.getElementById("k-debarred-firms")?.innerText.trim().length ?? 0;

                if (data === 0) return null;

                return window.getComputedStyle(el).getPropertyValue("display");
            });

            if (display === "none") break;
            await new Promise((r) => setTimeout(r, 1000));
        }
    }
}
