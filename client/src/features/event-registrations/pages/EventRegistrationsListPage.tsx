import { Link } from "@tanstack/react-router";
import type { FunctionComponent } from "@/common/types";
import { ErrorMessage, Loading, PageHeader } from "@/components/ui/Primitives";
import {
	useDeleteEventRegistration,
	useEventRegistrations,
} from "@/features/event-registrations/api";
import { describeApiError } from "@/lib/api";

export const EventRegistrationsListPage = (): FunctionComponent => {
	const {
		data: registrations,
		isLoading,
		isError,
		error,
	} = useEventRegistrations();
	const deleteRegistration = useDeleteEventRegistration();

	const handleDelete = (id: number): void => {
		if (window.confirm(`Видалити реєстрацію №${id}?`)) {
			deleteRegistration.mutate(id);
		}
	};

	if (isLoading) {
		return <Loading label="Завантаження реєстрацій…" />;
	}

	if (isError) {
		return <ErrorMessage message={describeApiError(error)} />;
	}

	return (
		<div className="p-4">
			<PageHeader title="Реєстрації на події">
				<Link
					className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
					to="/event-registrations/new"
				>
					Нова реєстрація
				</Link>
			</PageHeader>

			<table className="min-w-full border-collapse bg-white">
				<thead>
					<tr className="bg-slate-100 text-left">
						<th className="border-b px-4 py-2">ID</th>
						<th className="border-b px-4 py-2">Подія</th>
						<th className="border-b px-4 py-2">Клієнт</th>
						<th className="border-b px-4 py-2">Місця</th>
						<th className="border-b px-4 py-2">Дії</th>
					</tr>
				</thead>
				<tbody>
					{registrations?.map((registration) => (
						<tr key={registration.id}>
							<td className="border-b px-4 py-2">{registration.id}</td>
							<td className="border-b px-4 py-2">
								{registration.event?.name ?? "—"}
							</td>
							<td className="border-b px-4 py-2">
								{registration.client?.full_name ?? "—"}
							</td>
							<td className="border-b px-4 py-2">{registration.seats}</td>
							<td className="border-b px-4 py-2 whitespace-nowrap">
								<Link
									className="mr-4 text-indigo-600 hover:text-indigo-900"
									params={{ registrationId: String(registration.id) }}
									to="/event-registrations/$registrationId"
								>
									Редагувати
								</Link>
								<button
									className="text-red-600 hover:text-red-900 disabled:opacity-50"
									disabled={deleteRegistration.isPending}
									type="button"
									onClick={() => {
										handleDelete(registration.id);
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
