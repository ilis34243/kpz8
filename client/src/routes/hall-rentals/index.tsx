import { createFileRoute } from "@tanstack/react-router";
import { HallRentalsListPage } from "@/features/hall-rentals/pages/HallRentalsListPage";

export const Route = createFileRoute("/hall-rentals/")({
	component: HallRentalsListPage,
});
