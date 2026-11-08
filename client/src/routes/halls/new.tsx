import { createFileRoute } from "@tanstack/react-router";
import { HallCreatePage } from "@/features/halls/pages/HallCreatePage";

export const Route = createFileRoute("/halls/new")({
	component: HallCreatePage,
});
