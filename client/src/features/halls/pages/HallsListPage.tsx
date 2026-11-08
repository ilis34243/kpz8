import { Link } from "@tanstack/react-router";
import type { FunctionComponent } from "@/common/types";
import { ErrorMessage, Loading, PageHeader } from "@/components/ui/Primitives";
import { useDeleteHall, useHalls } from "@/features/halls/api";
import { describeApiError } from "@/lib/api";

export const HallsListPage = (): FunctionComponent => {
	const { data: halls, isLoading, isError, error } = useHalls();
	const deleteHall = useDeleteHall();

	const handleDelete = (id: number, name: string): void => {
		if (window.confirm(`Видалити зал «${name}»?`)) {
			deleteHall.mutate(id);
		}
	};

	if (isLoading) {
		return <Loading label="Завантаження залів…" />;
	}

	if (isError) {
		return <ErrorMessage message={describeApiError(error)} />;
	}

	return (
		<div className="p-4">
			<PageHeader title="Зали">
				<Link
					className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
					to="/halls/new"
				>
					Створити зал
				</Link>
			</PageHeader>

			<table className="min-w-full border-collapse bg-white">
				<thead>
					<tr className="bg-slate-100 text-left">
						<th className="border-b px-4 py-2">ID</th>
						<th className="border-b px-4 py-2">Назва</th>
						<th className="border-b px-4 py-2">Місткість</th>
						<th className="border-b px-4 py-2">Події</th>
						<th className="border-b px-4 py-2">Дії</th>
					</tr>
				</thead>
				<tbody>
					{halls?.map((hall) => (
						<tr key={hall.id} className="align-top">
							<td className="border-b px-4 py-2">{hall.id}</td>
							<td className="border-b px-4 py-2">
								<div className="font-medium">{hall.name}</div>
								<div className="text-sm text-slate-500">
									{hall.description ?? "—"}
								</div>
							</td>
							<td className="border-b px-4 py-2">{hall.capacity}</td>
							<td className="border-b px-4 py-2">{hall.events.length}</td>
							<td className="border-b px-4 py-2 whitespace-nowrap">
								<Link
									className="mr-4 text-indigo-600 hover:text-indigo-900"
									params={{ hallId: String(hall.id) }}
									to="/halls/$hallId"
								>
									Редагувати
								</Link>
								<button
									className="text-red-600 hover:text-red-900 disabled:opacity-50"
									disabled={deleteHall.isPending}
									type="button"
									onClick={() => {
										handleDelete(hall.id, hall.name);
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
