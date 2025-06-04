import { ScrappingResponse } from "@domain/interfaces/ScrappingResponse";

export abstract class IRiskEntitySearcher {
    abstract search(entityName: string): Promise<ScrappingResponse>;
}
