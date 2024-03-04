import { Person } from './person';
import { Movement } from './movement';

export interface Workout {
    id: number,
    person: Person,
    name: string,
    date: string,
    notes: string,
    movementList: Movement[]
}
