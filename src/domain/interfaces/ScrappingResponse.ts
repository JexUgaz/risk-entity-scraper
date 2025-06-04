import { ScrappingSource } from "./ScrappingSource";

export interface ScrappingResponse {
    query: string;
    totalHits: number;
    sources: ScrappingSource[];
}
