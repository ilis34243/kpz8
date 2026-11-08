export const inputClass = (invalid: boolean): string =>
	`w-full rounded border p-2 ${invalid ? "border-red-400 bg-red-50" : "border-slate-300"} focus:border-blue-500 focus:outline-none`;
