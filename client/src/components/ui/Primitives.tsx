import type { FunctionComponent } from "@/common/types";
import type { ReactNode } from "react";

export const Loading = ({
	label = "Завантаження…",
}: {
	label?: string;
}): FunctionComponent => (
	<div className="flex items-center gap-3 p-6">
		<span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
		<span className="text-slate-600">{label}</span>
	</div>
);

export const ErrorMessage = ({
	message,
}: {
	message: string;
}): FunctionComponent => (
	<div className="m-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
		{message}
	</div>
);

export const PageHeader = ({
	title,
	children,
}: {
	title: string;
	children?: ReactNode;
}): FunctionComponent => (
	<div className="mb-4 flex items-center justify-between">
		<h1 className="text-2xl font-bold text-slate-800">{title}</h1>
		<div className="flex gap-2">{children}</div>
	</div>
);

export const Field = ({
	label,
	htmlFor,
	error,
	children,
}: {
	label: string;
	htmlFor?: string;
	error?: string;
	children: ReactNode;
}): FunctionComponent => (
	<div className="mb-4">
		<label className="mb-1 block font-medium text-slate-700" htmlFor={htmlFor}>
			{label}
		</label>
		{children}
		{error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
	</div>
);
