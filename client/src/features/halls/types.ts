import { z } from "zod";

import type { EventSummary } from "@/features/shared/types";

export interface Hall {
	id: number;
	name: string;
	capacity: number;
	description: string | null;
	events: Array<EventSummary>;
}

export const hallSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, "Назва зали обов'язкова")
		.max(80, "Назва не довша за 80 символів"),
	capacity: z.coerce
		.number()
		.int("Місткість має бути цілим числом")
		.positive("Місткість має бути більше 0"),
	description: z
		.string()
		.trim()
		.max(500, "Опис не довший за 500 символів")
		.optional(),
});

export type HallFormValues = z.infer<typeof hallSchema>;

export type HallFormInput = z.input<typeof hallSchema>;
