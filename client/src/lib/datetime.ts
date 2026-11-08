export const toInputDateTime = (value: string | null): string => {
	if (!value) {
		return "";
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return "";
	}

	const pad = (part: number): string => String(part).padStart(2, "0");

	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
		date.getMinutes()
	)}`;
};

export const fromInputDateTime = (value: string): string =>
	new Date(value).toISOString();

export const formatDate = (value: string | null): string =>
	value ? new Date(value).toLocaleString("uk-UA") : "—";
