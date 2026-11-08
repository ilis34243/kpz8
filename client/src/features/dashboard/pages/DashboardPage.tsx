import { Link } from "@tanstack/react-router";
import type { FunctionComponent } from "@/common/types";
import { ErrorMessage, Loading } from "@/components/ui/Primitives";
import { useClients } from "@/features/clients/api";
import { useEventRegistrations } from "@/features/event-registrations/api";
import { useEvents } from "@/features/events/api";
import { useFeedbacks } from "@/features/feedbacks/api";
import { useHallRentals } from "@/features/hall-rentals/api";
import { useHalls } from "@/features/halls/api";
import { describeApiError } from "@/lib/api";

type DashboardRoute =
	| "/halls"
	| "/clients"
	| "/events"
	| "/hall-rentals"
	| "/event-registrations"
	| "/feedbacks";

type CollectionQuery = () => {
	data?: Array<unknown> | undefined;
	isLoading: boolean;
	isError: boolean;
	error: unknown;
};

const CARDS: ReadonlyArray<{
	to: DashboardRoute;
	title: string;
	query: CollectionQuery;
}> = [
	{ to: "/halls", title: "Зали", query: useHalls },
	{ to: "/clients", title: "Клієнти", query: useClients },
	{ to: "/events", title: "Події", query: useEvents },
	{ to: "/hall-rentals", title: "Оренди залів", query: useHallRentals },
	{
		to: "/event-registrations",
		title: "Реєстрації",
		query: useEventRegistrations,
	},
	{ to: "/feedbacks", title: "Відгуки", query: useFeedbacks },
];

const DashboardCard = ({
	to,
	title,
	query,
}: {
	to: DashboardRoute;
	title: string;
	query: CollectionQuery;
}): FunctionComponent => {
	const { data, isLoading, isError, error } = query();

	if (isLoading) {
		return <Loading label={`Завантаження: ${title}`} />;
	}

	if (isError) {
		return <ErrorMessage message={`${title}: ${describeApiError(error)}`} />;
	}

	return (
		<Link
			className="rounded border border-slate-200 bg-white p-4 shadow-sm hover:border-blue-400 hover:shadow"
			to={to}
		>
			<div className="text-lg font-semibold text-slate-800">{title}</div>
			<div className="text-3xl font-bold text-blue-600">
				{data?.length ?? 0}
			</div>
			<div className="text-sm text-slate-500">записів</div>
		</Link>
	);
};

export const DashboardPage = (): FunctionComponent => {
	return (
		<div className="p-4">
			<h1 className="mb-4 text-2xl font-bold text-slate-800">
				Панель дозвілля
			</h1>
			<p className="mb-6 max-w-2xl text-slate-600">
				Демонстраційні дані курсової через REST API на{" "}
				<code className="text-slate-800">http://localhost:4000/v1</code>.
				Оберіть розділ, щоб переглянути, створити або відредагувати записи.
			</p>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{CARDS.map((card) => (
					<DashboardCard
						key={card.to}
						query={card.query}
						title={card.title}
						to={card.to}
					/>
				))}
			</div>
		</div>
	);
};
