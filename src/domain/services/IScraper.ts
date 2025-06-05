import { SourceName } from "@domain/enums/SourceName";
import { ScrappingSource } from "@domain/interfaces/ScrappingSource";

export abstract class IScraper {
    abstract readonly sourceName: SourceName;
    abstract getData(query: string): Promise<ScrappingSource>;
}
