import { Link } from "@tanstack/react-router";
import type { FunctionComponent } from "@/common/types";
import { ErrorMessage, Loading, PageHeader } from "@/components/ui/Primitives";
import { useDeleteFeedback, useFeedbacks } from "@/features/feedbacks/api";
import { describeApiError } from "@/lib/api";

export const FeedbacksListPage = (): FunctionComponent => {
	const { data: feedbacks, isLoading, isError, error } = useFeedbacks();
	const deleteFeedback = useDeleteFeedback();

	const handleDelete = (id: number): void => {
		if (window.confirm(`Видалити відгук №${id}?`)) {
			deleteFeedback.mutate(id);
		}
	};

	if (isLoading) {
		return <Loading label="Завантаження відгуків…" />;
	}

	if (isError) {
		return <ErrorMessage message={describeApiError(error)} />;
	}

	return (
		<div className="p-4">
			<PageHeader title="Відгуки">
				<Link
					className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
					to="/feedbacks/new"
				>
					Новий відгук
				</Link>
			</PageHeader>

			<table className="min-w-full border-collapse bg-white">
				<thead>
					<tr className="bg-slate-100 text-left">
						<th className="border-b px-4 py-2">ID</th>
						<th className="border-b px-4 py-2">Клієнт</th>
						<th className="border-b px-4 py-2">Подія</th>
						<th className="border-b px-4 py-2">Оцінка</th>
						<th className="border-b px-4 py-2">Коментар</th>
						<th className="border-b px-4 py-2">Дії</th>
					</tr>
				</thead>
				<tbody>
					{feedbacks?.map((feedback) => (
						<tr key={feedback.id}>
							<td className="border-b px-4 py-2">{feedback.id}</td>
							<td className="border-b px-4 py-2">
								{feedback.client?.full_name ?? "—"}
							</td>
							<td className="border-b px-4 py-2">
								{feedback.event?.name ?? "—"}
							</td>
							<td className="border-b px-4 py-2">
								{"★".repeat(feedback.rating)}
								{"☆".repeat(5 - feedback.rating)}
							</td>
							<td className="border-b px-4 py-2">{feedback.comment ?? "—"}</td>
							<td className="border-b px-4 py-2 whitespace-nowrap">
								<Link
									className="mr-4 text-indigo-600 hover:text-indigo-900"
									params={{ feedbackId: String(feedback.id) }}
									to="/feedbacks/$feedbackId"
								>
									Редагувати
								</Link>
								<button
									className="text-red-600 hover:text-red-900 disabled:opacity-50"
									disabled={deleteFeedback.isPending}
									type="button"
									onClick={() => {
										handleDelete(feedback.id);
									}}
								>
									Видалити
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
