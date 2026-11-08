import { createFileRoute } from "@tanstack/react-router";
import { HallRentalCreatePage } from "@/features/hall-rentals/pages/HallRentalCreatePage";

export const Route = createFileRoute("/hall-rentals/new")({
	component: HallRentalCreatePage,
});
