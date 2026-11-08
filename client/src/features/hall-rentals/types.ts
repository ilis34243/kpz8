import { z } from "zod";

import {
	RENTAL_STATUSES,
	type ClientSummary,
	type HallSummary,
} from "@/features/shared/types";

export interface HallRental {
	id: number;
	hall_id: number | null;
	client_id: number | null;
	hall: HallSummary | null;
	client: ClientSummary | null;
	start_datetime: string | null;
	end_datetime: string | null;
	total_cost: number;
	status: (typeof RENTAL_STATUSES)[number];
}

export const hallRentalSchema = z
	.object({
		hall_id: z.coerce.number().int().positive("Оберіть зал"),
		client_id: z.coerce.number().int().positive("Оберіть клієнта"),
		start_datetime: z.string().min(1, "Початок обов'язковий"),
		end_datetime: z.string().min(1, "Завершення обов'язкове"),
		total_cost: z.coerce
			.number()
			.min(0, "Вартість не може бути від'ємною")
			.refine(
				(value) => /^\d+(\.\d{1,2})?$/.test(String(value)),
				"Дозволено максимум два знаки після коми"
			),
		status: z.enum(RENTAL_STATUSES),
	})
	.refine(
		(values) =>
			Date.parse(values.start_datetime) < Date.parse(values.end_datetime),
		{
			path: ["end_datetime"],
			message: "Завершення має бути пізніше за початок",
		}
	);

export type HallRentalFormValues = z.infer<typeof hallRentalSchema>;

export type HallRentalFormInput = z.input<typeof hallRentalSchema>;
