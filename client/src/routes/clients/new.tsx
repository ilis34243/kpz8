import { createFileRoute } from "@tanstack/react-router";
import { ClientCreatePage } from "@/features/clients/pages/ClientCreatePage";

export const Route = createFileRoute("/clients/new")({
	component: ClientCreatePage,
});
