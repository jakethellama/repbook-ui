import { Sset } from './sset';

export interface Movement {
    id: number,
    movType: string,
    restAfter: number,
    notes: string,
    ssetList: Sset[]
}
