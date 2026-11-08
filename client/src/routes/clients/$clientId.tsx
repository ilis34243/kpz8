import { createFileRoute } from "@tanstack/react-router";
import { ClientEditPage } from "@/features/clients/pages/ClientEditPage";

export const Route = createFileRoute("/clients/$clientId")({
	component: ClientEditPage,
});
