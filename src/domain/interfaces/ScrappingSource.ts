import { SourceName } from "@domain/enums/SourceName";
import { ScrappingResult } from "./ScrappingResult";

export interface ScrappingSource {
    name: SourceName;
    hits: number;
    results: ScrappingResult[];
}
