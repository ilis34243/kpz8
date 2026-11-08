import { createFileRoute } from "@tanstack/react-router";
import { EventRegistrationEditPage } from "@/features/event-registrations/pages/EventRegistrationEditPage";

export const Route = createFileRoute("/event-registrations/$registrationId")({
	component: EventRegistrationEditPage,
});
