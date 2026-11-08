import { createFileRoute } from "@tanstack/react-router";
import { HallsListPage } from "@/features/halls/pages/HallsListPage";

export const Route = createFileRoute("/halls/")({
	component: HallsListPage,
});
