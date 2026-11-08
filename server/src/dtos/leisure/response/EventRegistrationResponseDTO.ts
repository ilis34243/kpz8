import { EventRegistration } from 'orm/entities/leisure/EventRegistration';

import { ClientSummaryDTO, EventSummaryDTO } from './summaries';

export class EventRegistrationResponseDTO {
  id: number;
  event_id: number | null;
  client_id: number | null;
  seats: number;
  event: EventSummaryDTO | null;
  client: ClientSummaryDTO | null;

  constructor(registration: EventRegistration) {
    this.id = registration.id;
    this.event_id = registration.event ? registration.event.id : null;
    this.client_id = registration.client ? registration.client.id : null;
    this.seats = Number(registration.seats);
    this.event = registration.event ? new EventSummaryDTO(registration.event) : null;
    this.client = registration.client ? new ClientSummaryDTO(registration.client) : null;
  }
}
