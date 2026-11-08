import { createFileRoute } from "@tanstack/react-router";
import { UsersListPage } from "@/features/users/pages/UsersListPage";

export const Route = createFileRoute("/users/")({
	component: UsersListPage,
});
