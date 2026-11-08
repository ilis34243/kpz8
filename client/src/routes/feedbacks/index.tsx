import { createFileRoute } from "@tanstack/react-router";
import { FeedbacksListPage } from "@/features/feedbacks/pages/FeedbacksListPage";

export const Route = createFileRoute("/feedbacks/")({
	component: FeedbacksListPage,
});
