import { z } from "zod";

import type { ClientSummary, EventSummary } from "@/features/shared/types";

export interface EventRegistration {
	id: number;
	event_id: number | null;
	client_id: number | null;
	seats: number;
	event: EventSummary | null;
	client: ClientSummary | null;
}

export const eventRegistrationSchema = z.object({
	event_id: z.coerce.number().int().positive("Оберіть подію"),
	client_id: z.coerce.number().int().positive("Оберіть клієнта"),
	seats: z.coerce
		.number()
		.int("Кількість місць — ціле число")
		.positive("Кількість місць має бути додатною"),
});

export type EventRegistrationFormValues = z.infer<
	typeof eventRegistrationSchema
>;

export type EventRegistrationFormInput = z.input<
	typeof eventRegistrationSchema
>;
