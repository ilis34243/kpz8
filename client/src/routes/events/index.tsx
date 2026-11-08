import { createFileRoute } from "@tanstack/react-router";
import { EventsListPage } from "@/features/events/pages/EventsListPage";

export const Route = createFileRoute("/events/")({
	component: EventsListPage,
});
