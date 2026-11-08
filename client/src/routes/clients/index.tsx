import { createFileRoute } from "@tanstack/react-router";
import { ClientsListPage } from "@/features/clients/pages/ClientsListPage";

export const Route = createFileRoute("/clients/")({
	component: ClientsListPage,
});
