import { z } from "zod";

import type { HallRentalSummary } from "@/features/shared/types";

export interface Client {
	id: number;
	full_name: string;
	email: string;
	phone: string;
	rentals: Array<HallRentalSummary>;
}

export const clientSchema = z.object({
	full_name: z
		.string()
		.trim()
		.min(1, "ПІБ обов'язкове")
		.max(80, "ПІБ не довше за 80 символів"),
	email: z.email("Некоректний email"),
	phone: z
		.string()
		.trim()
		.min(1, "Телефон обов'язковий")
		.regex(
			/^\+?[\d\s-]{6,20}$/,
			"Дозволені цифри, пробіли, дефіси та '+' на початку"
		),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
