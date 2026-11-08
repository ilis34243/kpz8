import { describe, expect, it } from "vitest";

import { formatDate, fromInputDateTime, toInputDateTime } from "@/lib/datetime";

describe("toInputDateTime", () => {
	it("повертає порожній рядок для відсутнього або непарситься значення", () => {
		expect(toInputDateTime(null)).toBe("");
		expect(toInputDateTime("не дата")).toBe("");
	});

	it("дає формат, який розуміє datetime-local", () => {
		expect(toInputDateTime("2026-11-14T17:00:00.000Z")).toMatch(
			/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
		);
	});
});

describe("fromInputDateTime", () => {
	it("робить зворотне перетворення без втрати хвилини", () => {
		const iso = "2026-11-14T17:00:00.000Z";
		const round = fromInputDateTime(toInputDateTime(iso));
		expect(new Date(round).getTime()).toBe(
			new Date(iso.slice(0, 16) + ":00.000Z").getTime(),
		);
	});

	it("повертає ISO-рядок з мілісекундами для бекенду", () => {
		expect(fromInputDateTime("2026-11-14T17:00")).toMatch(
			/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
		);
	});
});

describe("formatDate", () => {
	it("показує тире за відсутності дати", () => {
		expect(formatDate(null)).toBe("—");
	});
});
