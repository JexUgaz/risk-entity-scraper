import { ScrappingSource } from "@domain/interfaces/ScrappingSource";

export abstract class IScraper {
    abstract getData(query: string): Promise<ScrappingSource>;
}
