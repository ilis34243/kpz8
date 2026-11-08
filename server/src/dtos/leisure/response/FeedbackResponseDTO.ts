import { Feedback } from 'orm/entities/leisure/Feedback';

import { ClientSummaryDTO, EventSummaryDTO } from './summaries';

export class FeedbackResponseDTO {
  id: number;
  client_id: number | null;
  event_id: number | null;
  rating: number;
  comment: string | null;
  client: ClientSummaryDTO | null;
  event: EventSummaryDTO | null;

  constructor(feedback: Feedback) {
    this.id = feedback.id;
    this.client_id = feedback.client ? feedback.client.id : null;
    this.event_id = feedback.event ? feedback.event.id : null;
    this.rating = Number(feedback.rating);
    this.comment = feedback.comment ?? null;
    this.client = feedback.client ? new ClientSummaryDTO(feedback.client) : null;
    this.event = feedback.event ? new EventSummaryDTO(feedback.event) : null;
  }
}
