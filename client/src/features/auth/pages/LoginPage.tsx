import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { FunctionComponent } from "@/common/types";
import { ErrorMessage, Field, PageHeader } from "@/components/ui/Primitives";
import { inputClass } from "@/components/ui/inputClass";
import { useLogin } from "@/features/auth/api";
import { loginSchema, type LoginFormValues } from "@/features/auth/types";
import { describeApiError } from "@/lib/api";

export const LoginPage = (): FunctionComponent => {
	const login = useLogin();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});

	const onSubmit = handleSubmit((values) => {
		login.mutate(values);
	});

	return (
		<div className="p-4">
			<PageHeader title="Вхід у систему" />

			<form noValidate className="max-w-md" onSubmit={onSubmit}>
				<Field error={errors.email?.message} htmlFor="email" label="Email">
					<input
						className={inputClass(Boolean(errors.email))}
						id="email"
						type="email"
						{...register("email")}
					/>
				</Field>

				<Field
					error={errors.password?.message}
					htmlFor="password"
					label="Пароль"
				>
					<input
						className={inputClass(Boolean(errors.password))}
						id="password"
						type="password"
						{...register("password")}
					/>
				</Field>

				{login.isError ? (
					<ErrorMessage message={describeApiError(login.error)} />
				) : null}

				<button
					className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
					disabled={login.isPending}
					type="submit"
				>
					{login.isPending ? "Перевірка…" : "Увійти"}
				</button>

				<p className="mt-4 text-sm text-slate-500">
					Демонстраційний акаунт: admin@admin.com / pass1
				</p>
			</form>
		</div>
	);
};
