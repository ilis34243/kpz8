import { Client } from 'orm/entities/leisure/Client';
import { Event } from 'orm/entities/leisure/Event';
import { EventRegistration } from 'orm/entities/leisure/EventRegistration';
import { Feedback } from 'orm/entities/leisure/Feedback';
import { Hall } from 'orm/entities/leisure/Hall';
import { HallRental } from 'orm/entities/leisure/HallRental';

export const toIsoString = (value: Date | string | undefined | null): string | null => {
  if (value === undefined || value === null) {
    return null;
  }
  return value instanceof Date ? value.toISOString() : String(value);
};

export class HallSummaryDTO {
  id: number;
  name: string;
  capacity: number;

  constructor(hall?: Hall | null) {
    if (hall) {
      this.id = hall.id;
      this.name = hall.name;
      this.capacity = Number(hall.capacity);
    }
  }
}

export class ClientSummaryDTO {
  id: number;
  full_name: string;
  email: string;

  constructor(client?: Client | null) {
    if (client) {
      this.id = client.id;
      this.full_name = client.full_name;
      this.email = client.email;
    }
  }
}

export class EventSummaryDTO {
  id: number;
  name: string;
  type: string;
  start_datetime: string | null;
  end_datetime: string | null;
  hall: HallSummaryDTO | null;

  constructor(event?: Event | null) {
    if (event) {
      this.id = event.id;
      this.name = event.name;
      this.type = event.type;
      this.start_datetime = toIsoString(event.start_datetime);
      this.end_datetime = toIsoString(event.end_datetime);
      this.hall = event.hall ? new HallSummaryDTO(event.hall) : null;
    }
  }
}

export class HallRentalSummaryDTO {
  id: number;
  start_datetime: string | null;
  end_datetime: string | null;
  total_cost: number;
  status: string;

  constructor(rental?: HallRental | null) {
    if (rental) {
      this.id = rental.id;
      this.start_datetime = toIsoString(rental.start_datetime);
      this.end_datetime = toIsoString(rental.end_datetime);
      this.total_cost = Number(rental.total_cost);
      this.status = rental.status;
    }
  }
}

export class EventRegistrationSummaryDTO {
  id: number;
  seats: number;
  client: ClientSummaryDTO | null;

  constructor(registration?: EventRegistration | null) {
    if (registration) {
      this.id = registration.id;
      this.seats = Number(registration.seats);
      this.client = registration.client ? new ClientSummaryDTO(registration.client) : null;
    }
  }
}

export class FeedbackSummaryDTO {
  id: number;
  rating: number;
  comment: string | null;
  client: ClientSummaryDTO | null;

  constructor(feedback?: Feedback | null) {
    if (feedback) {
      this.id = feedback.id;
      this.rating = Number(feedback.rating);
      this.comment = feedback.comment ?? null;
      this.client = feedback.client ? new ClientSummaryDTO(feedback.client) : null;
    }
  }
}
