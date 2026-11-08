import { z } from "zod";

import type { ClientSummary, EventSummary } from "@/features/shared/types";

export interface Feedback {
	id: number;
	client_id: number | null;
	event_id: number | null;
	rating: number;
	comment: string | null;
	client: ClientSummary | null;
	event: EventSummary | null;
}

export const feedbackSchema = z.object({
	client_id: z.coerce.number().int().positive("Оберіть клієнта"),
	event_id: z.coerce.number().int().positive("Оберіть подію"),
	rating: z.coerce
		.number()
		.int("Оцінка — ціле число")
		.min(1, "Оцінка від 1 до 5")
		.max(5, "Оцінка від 1 до 5"),
	comment: z.string().trim().max(500, "Максимум 500 символів").optional(),
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export type FeedbackFormInput = z.input<typeof feedbackSchema>;
