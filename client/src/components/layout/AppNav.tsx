import { Link } from "@tanstack/react-router";
import type { FunctionComponent } from "@/common/types";
import { useCurrentUser } from "@/features/auth/api";
import { useAuthStore } from "@/store/authStore";

const NAV_ITEMS = [
	{ to: "/halls", label: "Зали" },
	{ to: "/clients", label: "Клієнти" },
	{ to: "/events", label: "Події" },
	{ to: "/hall-rentals", label: "Оренди" },
	{ to: "/event-registrations", label: "Реєстрації" },
	{ to: "/feedbacks", label: "Відгуки" },
	{ to: "/users", label: "Користувачі" },
] as const;

export const AppNav = (): FunctionComponent => {
	const user = useCurrentUser();
	const signOut = useAuthStore((state) => state.signOut);

	return (
		<nav className="flex flex-wrap items-center gap-4 border-b border-slate-200 bg-white px-4 py-3">
			<Link className="mr-2 font-bold text-slate-800" to="/">
				Курсова: дозвілля
			</Link>

			{NAV_ITEMS.map((item) => (
				<Link
					key={item.to}
					activeProps={{ className: "font-semibold text-blue-700" }}
					className="text-slate-600 hover:text-blue-700"
					to={item.to}
				>
					{item.label}
				</Link>
			))}

			<span className="ml-auto flex items-center gap-3">
				{user ? (
					<>
						<span className="text-sm text-slate-500">{user.email}</span>
						<button
							className="rounded border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100"
							type="button"
							onClick={signOut}
						>
							Вийти
						</button>
					</>
				) : (
					<Link
						className="rounded bg-slate-800 px-3 py-1 text-sm text-white hover:bg-slate-700"
						to="/login"
					>
						Увійти
					</Link>
				)}
			</span>
		</nav>
	);
};
