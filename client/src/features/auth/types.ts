import { z } from "zod";

export interface AuthUser {
	email: string;
	name: string;
	role: string;
	expiresAt: number | null;
}

export const loginSchema = z.object({
	email: z.email("Некоректний email"),
	password: z.string().min(1, "Пароль обов'язковий"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
