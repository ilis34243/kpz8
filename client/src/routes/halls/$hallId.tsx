import { createFileRoute } from "@tanstack/react-router";
import { HallEditPage } from "@/features/halls/pages/HallEditPage";

export const Route = createFileRoute("/halls/$hallId")({
	component: HallEditPage,
});
