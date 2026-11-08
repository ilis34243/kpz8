import { Client } from 'orm/entities/leisure/Client';

import { HallRentalSummaryDTO } from './summaries';

export class ClientResponseDTO {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  rentals: HallRentalSummaryDTO[];

  constructor(client: Client) {
    this.id = client.id;
    this.full_name = client.full_name;
    this.email = client.email;
    this.phone = client.phone;
    this.rentals = (client.rentals ?? []).map((rental) => new HallRentalSummaryDTO(rental));
  }
}
