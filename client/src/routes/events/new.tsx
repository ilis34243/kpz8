import { createFileRoute } from "@tanstack/react-router";
import { EventCreatePage } from "@/features/events/pages/EventCreatePage";

export const Route = createFileRoute("/events/new")({
	component: EventCreatePage,
});
