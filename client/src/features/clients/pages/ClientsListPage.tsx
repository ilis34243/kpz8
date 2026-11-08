import { Link } from "@tanstack/react-router";
import type { FunctionComponent } from "@/common/types";
import { ErrorMessage, Loading, PageHeader } from "@/components/ui/Primitives";
import { useClients, useDeleteClient } from "@/features/clients/api";
import { describeApiError } from "@/lib/api";

export const ClientsListPage = (): FunctionComponent => {
	const { data: clients, isLoading, isError, error } = useClients();
	const deleteClient = useDeleteClient();

	const handleDelete = (id: number, fullName: string): void => {
		if (window.confirm(`Видалити клієнта «${fullName}»?`)) {
			deleteClient.mutate(id);
		}
	};

	if (isLoading) {
		return <Loading label="Завантаження клієнтів…" />;
	}

	if (isError) {
		return <ErrorMessage message={describeApiError(error)} />;
	}

	return (
		<div className="p-4">
			<PageHeader title="Клієнти">
				<Link
					className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
					to="/clients/new"
				>
					Створити клієнта
				</Link>
			</PageHeader>

			<table className="min-w-full border-collapse bg-white">
				<thead>
					<tr className="bg-slate-100 text-left">
						<th className="border-b px-4 py-2">ID</th>
						<th className="border-b px-4 py-2">ПІБ</th>
						<th className="border-b px-4 py-2">Email</th>
						<th className="border-b px-4 py-2">Телефон</th>
						<th className="border-b px-4 py-2">Оренди</th>
						<th className="border-b px-4 py-2">Дії</th>
					</tr>
				</thead>
				<tbody>
					{clients?.map((client) => (
						<tr key={client.id}>
							<td className="border-b px-4 py-2">{client.id}</td>
							<td className="border-b px-4 py-2">{client.full_name}</td>
							<td className="border-b px-4 py-2">{client.email}</td>
							<td className="border-b px-4 py-2">{client.phone}</td>
							<td className="border-b px-4 py-2">{client.rentals.length}</td>
							<td className="border-b px-4 py-2 whitespace-nowrap">
								<Link
									className="mr-4 text-indigo-600 hover:text-indigo-900"
									params={{ clientId: String(client.id) }}
									to="/clients/$clientId"
								>
									Редагувати
								</Link>
								<button
									className="text-red-600 hover:text-red-900 disabled:opacity-50"
									disabled={deleteClient.isPending}
									type="button"
									onClick={() => {
										handleDelete(client.id, client.full_name);
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
