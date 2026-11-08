import { createFileRoute } from "@tanstack/react-router";
import { HallRentalEditPage } from "@/features/hall-rentals/pages/HallRentalEditPage";

export const Route = createFileRoute("/hall-rentals/$rentalId")({
	component: HallRentalEditPage,
});
