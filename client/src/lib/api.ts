import type { AxiosError, AxiosResponse } from "axios";
import type { Path, UseFormSetError } from "react-hook-form";

type ValidationEntry = Record<string, string>;

interface ApiErrorBody {
	errorType?: string;
	errorMessage?: string;
	errors?: Array<string> | null;
	errorsValidation?: Array<ValidationEntry> | null;
}

export interface ApiSuccessBody<T> {
	message: string;
	data: T;
}

export class ApiRequestError extends Error {
	public readonly status: number;
	public readonly errorType: string;
	public readonly fieldErrors: Array<ValidationEntry>;

	public constructor(
		status: number,
		message: string,
		errorType: string,
		fieldErrors: Array<ValidationEntry>
	) {
		super(message);
		this.name = "ApiRequestError";
		this.status = status;
		this.errorType = errorType;
		this.fieldErrors = fieldErrors;
	}
}

export const unwrap = <T>(response: AxiosResponse<ApiSuccessBody<T>>): T =>
	response.data.data;

export const toApiRequestError = (
	error: AxiosError<unknown>
): ApiRequestError => {
	const body = (error.response?.data ?? {}) as ApiErrorBody;

	return new ApiRequestError(
		error.response?.status ?? 0,
		body?.errorMessage ?? error.message,
		body?.errorType ?? "Network",
		body?.errorsValidation ?? []
	);
};

export const describeApiError = (error: unknown): string =>
	error instanceof ApiRequestError
		? `${error.status}: ${error.message}`
		: String(error);

export const applyServerFieldErrors = <T extends Record<string, unknown>>(
	setError: UseFormSetError<T>,
	error: unknown
): boolean => {
	if (!(error instanceof ApiRequestError) || error.fieldErrors.length === 0) {
		return false;
	}

	for (const entry of error.fieldErrors) {
		const [field, message] = Object.entries(entry)[0] ?? [];
		if (field && message) {
			setError(field as Path<T>, { type: "server", message });
		}
	}

	return true;
};
