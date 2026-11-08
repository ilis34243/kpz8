import { createFileRoute } from "@tanstack/react-router";
import { FeedbackEditPage } from "@/features/feedbacks/pages/FeedbackEditPage";

export const Route = createFileRoute("/feedbacks/$feedbackId")({
	component: FeedbackEditPage,
});
