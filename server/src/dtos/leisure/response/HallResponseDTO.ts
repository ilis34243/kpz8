import { Hall } from 'orm/entities/leisure/Hall';

import { EventSummaryDTO } from './summaries';

export class HallResponseDTO {
  id: number;
  name: string;
  capacity: number;
  description: string | null;
  events: EventSummaryDTO[];

  constructor(hall: Hall) {
    this.id = hall.id;
    this.name = hall.name;
    this.capacity = Number(hall.capacity);
    this.description = hall.description ?? null;
    this.events = (hall.events ?? []).map((event) => new EventSummaryDTO(event));
  }
}
