import { Link } from "@tanstack/react-router";
import type { FunctionComponent } from "@/common/types";
import { ErrorMessage, Loading, PageHeader } from "@/components/ui/Primitives";
import { useUsers } from "@/features/users/api";
import { describeApiError } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export const UsersListPage = (): FunctionComponent => {
	const token = useAuthStore((state) => state.token);
	const { data: users, isLoading, isError, error } = useUsers();

	if (token === null) {
		return (
			<div className="p-4">
				<PageHeader title="Користувачі">
					<Link
						className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
						to="/login"
					>
						Увійти
					</Link>
				</PageHeader>
				<p className="text-slate-600">
					Ендпоінт <code>/v1/users</code> захищений middleware{" "}
					<code>checkJwt</code>, тому список доступний лише після входу.
				</p>
			</div>
		);
	}

	if (isLoading) {
		return <Loading label="Завантаження користувачів…" />;
	}

	if (isError) {
		return <ErrorMessage message={describeApiError(error)} />;
	}

	return (
		<div className="p-4">
			<PageHeader title="Користувачі" />

			<table className="min-w-full border-collapse bg-white">
				<thead>
					<tr className="bg-slate-100 text-left">
						<th className="border-b px-4 py-2">ID</th>
						<th className="border-b px-4 py-2">Ім&rsquo;я</th>
						<th className="border-b px-4 py-2">Email</th>
						<th className="border-b px-4 py-2">Роль</th>
						<th className="border-b px-4 py-2">Створено</th>
					</tr>
				</thead>
				<tbody>
					{users?.map((user) => (
						<tr key={user.id}>
							<td className="border-b px-4 py-2">{user.id}</td>
							<td className="border-b px-4 py-2">
								<div className="font-medium">{user.name}</div>
								<div className="text-sm text-slate-500">{user.username}</div>
							</td>
							<td className="border-b px-4 py-2">{user.email}</td>
							<td className="border-b px-4 py-2">{user.role}</td>
							<td className="border-b px-4 py-2">
								{new Date(user.created_at).toLocaleString("uk-UA")}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
