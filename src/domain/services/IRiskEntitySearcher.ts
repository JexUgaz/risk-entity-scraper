import { SourceName } from "@domain/enums/SourceName";
import { ScrappingResponse } from "@domain/interfaces/ScrappingResponse";

export abstract class IRiskEntitySearcher {
    abstract search(entityName: string, sources: SourceName[]): Promise<ScrappingResponse>;
}
