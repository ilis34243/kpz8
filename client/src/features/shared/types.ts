export const EVENT_TYPES = [
	"MASTER_CLASS",
	"CONCERT",
	"EXHIBITION",
	"TOURNAMENT",
	"LESSON",
] as const;

export const RENTAL_STATUSES = [
	"RESERVED",
	"CONFIRMED",
	"COMPLETED",
	"CANCELED",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export type RentalStatus = (typeof RENTAL_STATUSES)[number];

export interface HallSummary {
	id: number;
	name: string;
	capacity: number;
}

export interface ClientSummary {
	id: number;
	full_name: string;
	email: string;
}

export interface EventSummary {
	id: number;
	name: string;
	type: EventType;
	start_datetime: string | null;
	end_datetime: string | null;
	hall: HallSummary | null;
}

export interface HallRentalSummary {
	id: number;
	start_datetime: string | null;
	end_datetime: string | null;
	total_cost: number;
	status: RentalStatus;
}

export interface EventRegistrationSummary {
	id: number;
	seats: number;
	client: ClientSummary | null;
}

export interface FeedbackSummary {
	id: number;
	rating: number;
	comment: string | null;
	client: ClientSummary | null;
}
