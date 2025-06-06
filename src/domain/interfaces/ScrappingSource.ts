import { SourceName } from "@domain/enums/SourceName";
import { ScrappingResult } from "./ScrappingResult";

export interface ScrappingSource {
    url: string;
    name: SourceName;
    hits: number;
    results: ScrappingResult[];
}
