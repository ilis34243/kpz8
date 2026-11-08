import { Event } from 'orm/entities/leisure/Event';

import { EventRegistrationSummaryDTO, FeedbackSummaryDTO, HallSummaryDTO } from './summaries';

export class EventResponseDTO {
  id: number;
  name: string;
  type: string;
  start_datetime: string | null;
  end_datetime: string | null;
  hall_id: number | null;
  hall: HallSummaryDTO | null;
  registrations: EventRegistrationSummaryDTO[];
  feedbacks: FeedbackSummaryDTO[];

  constructor(event: Event) {
    this.id = event.id;
    this.name = event.name;
    this.type = event.type;
    this.start_datetime = event.start_datetime ? event.start_datetime.toISOString() : null;
    this.end_datetime = event.end_datetime ? event.end_datetime.toISOString() : null;
    this.hall_id = event.hall ? event.hall.id : null;
    this.hall = event.hall ? new HallSummaryDTO(event.hall) : null;
    this.registrations = (event.registrations ?? []).map(
      (registration) => new EventRegistrationSummaryDTO(registration),
    );
    this.feedbacks = (event.feedbacks ?? []).map((feedback) => new FeedbackSummaryDTO(feedback));
  }
}
