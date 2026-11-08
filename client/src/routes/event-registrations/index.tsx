import { createFileRoute } from "@tanstack/react-router";
import { EventRegistrationsListPage } from "@/features/event-registrations/pages/EventRegistrationsListPage";

export const Route = createFileRoute("/event-registrations/")({
	component: EventRegistrationsListPage,
});
