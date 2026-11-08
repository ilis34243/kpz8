import type { FunctionComponent } from "@/common/types";
import { AppNav } from "@/components/layout/AppNav";
import { Outlet } from "@tanstack/react-router";

export const RootLayout = (): FunctionComponent => (
	<div className="min-h-screen bg-slate-50">
		<AppNav />
		<main className="mx-auto max-w-6xl">
			<Outlet />
		</main>
	</div>
);
