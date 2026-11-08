import { createFileRoute } from "@tanstack/react-router";
import { EventRegistrationCreatePage } from "@/features/event-registrations/pages/EventRegistrationCreatePage";

export const Route = createFileRoute("/event-registrations/new")({
	component: EventRegistrationCreatePage,
});
