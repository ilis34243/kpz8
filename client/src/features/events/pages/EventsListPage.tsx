import { Link } from "@tanstack/react-router";
import type { FunctionComponent } from "@/common/types";
import { ErrorMessage, Loading, PageHeader } from "@/components/ui/Primitives";
import { useDeleteEvent, useEvents } from "@/features/events/api";
import { describeApiError } from "@/lib/api";
import { formatDate } from "@/lib/datetime";

export const EventsListPage = (): FunctionComponent => {
	const { data: events, isLoading, isError, error } = useEvents();
	const deleteEvent = useDeleteEvent();

	const handleDelete = (id: number, name: string): void => {
		if (window.confirm(`Видалити подію «${name}»?`)) {
			deleteEvent.mutate(id);
		}
	};

	if (isLoading) {
		return <Loading label="Завантаження подій…" />;
	}

	if (isError) {
		return <ErrorMessage message={describeApiError(error)} />;
	}

	return (
		<div className="p-4">
			<PageHeader title="Події">
				<Link
					className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
					to="/events/new"
				>
					Створити подію
				</Link>
			</PageHeader>

			<table className="min-w-full border-collapse bg-white">
				<thead>
					<tr className="bg-slate-100 text-left">
						<th className="border-b px-4 py-2">ID</th>
						<th className="border-b px-4 py-2">Назва</th>
						<th className="border-b px-4 py-2">Тип</th>
						<th className="border-b px-4 py-2">Початок</th>
						<th className="border-b px-4 py-2">Зал</th>
						<th className="border-b px-4 py-2">Реєстрації</th>
						<th className="border-b px-4 py-2">Дії</th>
					</tr>
				</thead>
				<tbody>
					{events?.map((event) => (
						<tr key={event.id}>
							<td className="border-b px-4 py-2">{event.id}</td>
							<td className="border-b px-4 py-2">{event.name}</td>
							<td className="border-b px-4 py-2">{event.type}</td>
							<td className="border-b px-4 py-2">
								<div>{formatDate(event.start_datetime)}</div>
								<div className="text-sm text-slate-500">
									{formatDate(event.end_datetime)}
								</div>
							</td>
							<td className="border-b px-4 py-2">{event.hall?.name ?? "—"}</td>
							<td className="border-b px-4 py-2">
								{event.registrations.length}
							</td>
							<td className="border-b px-4 py-2 whitespace-nowrap">
								<Link
									className="mr-4 text-indigo-600 hover:text-indigo-900"
									params={{ eventId: String(event.id) }}
									to="/events/$eventId"
								>
									Редагувати
								</Link>
								<button
									className="text-red-600 hover:text-red-900 disabled:opacity-50"
									disabled={deleteEvent.isPending}
									type="button"
									onClick={() => {
										handleDelete(event.id, event.name);
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
