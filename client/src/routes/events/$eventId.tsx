import { createFileRoute } from "@tanstack/react-router";
import { EventEditPage } from "@/features/events/pages/EventEditPage";

export const Route = createFileRoute("/events/$eventId")({
	component: EventEditPage,
});
