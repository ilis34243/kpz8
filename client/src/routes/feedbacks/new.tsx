import { createFileRoute } from "@tanstack/react-router";
import { FeedbackCreatePage } from "@/features/feedbacks/pages/FeedbackCreatePage";

export const Route = createFileRoute("/feedbacks/new")({
	component: FeedbackCreatePage,
});
