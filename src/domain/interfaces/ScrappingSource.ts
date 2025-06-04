import { ScrappingResult } from "./ScrappingResult";

export interface ScrappingSource {
    name: "OFAC" | "WORLD_BANK" | "OFFSHORE_LEAKS";
    hits: number;
    results: ScrappingResult[];
}
