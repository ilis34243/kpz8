import { HallRental } from 'orm/entities/leisure/HallRental';

import { ClientSummaryDTO, HallSummaryDTO, toIsoString } from './summaries';

export class HallRentalResponseDTO {
  id: number;
  hall_id: number | null;
  client_id: number | null;
  hall: HallSummaryDTO | null;
  client: ClientSummaryDTO | null;
  start_datetime: string | null;
  end_datetime: string | null;
  total_cost: number;
  status: string;

  constructor(rental: HallRental) {
    this.id = rental.id;
    this.hall_id = rental.hall ? rental.hall.id : null;
    this.client_id = rental.client ? rental.client.id : null;
    this.hall = rental.hall ? new HallSummaryDTO(rental.hall) : null;
    this.client = rental.client ? new ClientSummaryDTO(rental.client) : null;
    this.start_datetime = toIsoString(rental.start_datetime);
    this.end_datetime = toIsoString(rental.end_datetime);
    this.total_cost = Number(rental.total_cost);
    this.status = rental.status;
  }
}
