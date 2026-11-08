import { z } from "zod";

import {
	EVENT_TYPES,
	type EventRegistrationSummary,
	type FeedbackSummary,
	type HallSummary,
} from "@/features/shared/types";

export interface LeisureEvent {
	id: number;
	name: string;
	type: (typeof EVENT_TYPES)[number];
	start_datetime: string | null;
	end_datetime: string | null;
	hall_id: number | null;
	hall: HallSummary | null;
	registrations: Array<EventRegistrationSummary>;
	feedbacks: Array<FeedbackSummary>;
}

export const eventSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(1, "Назва події обов'язкова")
			.max(120, "Назва не довша за 120 символів"),
		type: z.enum(EVENT_TYPES, "Оберіть тип події"),
		start_datetime: z.string().min(1, "Початок обов'язковий"),
		end_datetime: z.string().min(1, "Завершення обов'язкове"),
		hall_id: z.coerce
			.number()
			.int("Зал має бути цілим id")
			.positive("Оберіть зал"),
	})
	.refine(
		(values) =>
			Date.parse(values.start_datetime) < Date.parse(values.end_datetime),
		{
			path: ["end_datetime"],
			message: "Завершення має бути пізніше за початок",
		}
	);

export type EventFormValues = z.infer<typeof eventSchema>;

export type EventFormInput = z.input<typeof eventSchema>;
