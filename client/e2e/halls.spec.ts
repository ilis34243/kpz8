import { expect, test } from "@playwright/test";

test("список залів отримує дані з REST API", async ({ page }) => {
	await page.goto("/halls");

	await expect(page.getByRole("heading", { name: "Зали" })).toBeVisible();
	await expect(page.getByRole("link", { name: "Створити зал" })).toBeVisible();
	await expect(page.getByRole("row")).not.toHaveCount(1);
});

test("форма створення показує помилки валідації Zod", async ({ page }) => {
	await page.goto("/halls/new");

	await page.fill("#name", "x".repeat(100));
	await page.fill("#capacity", "0");
	await page.getByRole("button", { name: "Створити" }).click();

	await expect(page.getByText("Назва не довша за 80 символів")).toBeVisible();
	await expect(page.getByText("Місткість має бути більше 0")).toBeVisible();
});

test("захищений список користувачів доступний лише після входу", async ({
	page,
}) => {
	await page.goto("/users");
	await expect(page.getByText("checkJwt")).toBeVisible();

	await page.goto("/login");
	await page.fill("#email", "admin@admin.com");
	await page.fill("#password", "pass1");
	await page.getByRole("button", { name: "Увійти" }).click();
	await expect(page).toHaveURL("/halls");

	await page.goto("/users");
	await expect(
		page.getByRole("heading", { name: "Користувачі" })
	).toBeVisible();
	await expect(page.getByRole("cell", { name: "ADMINISTRATOR" })).toBeVisible();
});
