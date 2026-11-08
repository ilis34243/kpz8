import {
	type UseMutationResult,
	type UseQueryResult,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { apiClient } from "@/lib/axios";
import { unwrap, type ApiSuccessBody } from "@/lib/api";
import type {
	HallRental,
	HallRentalFormValues,
} from "@/features/hall-rentals/types";

const getHallRentals = async (): Promise<Array<HallRental>> =>
	unwrap(
		await apiClient.get<ApiSuccessBody<Array<HallRental>>>("/hall-rentals")
	);

const getHallRental = async (id: number): Promise<HallRental> =>
	unwrap(
		await apiClient.get<ApiSuccessBody<HallRental>>(`/hall-rentals/${id}`)
	);

const createHallRental = async (
	values: HallRentalFormValues
): Promise<HallRental> =>
	unwrap(
		await apiClient.post<ApiSuccessBody<HallRental>>("/hall-rentals", values)
	);

const updateHallRental = async ({
	id,
	data,
}: {
	id: number;
	data: Partial<HallRentalFormValues>;
}): Promise<HallRental> =>
	unwrap(
		await apiClient.patch<ApiSuccessBody<HallRental>>(
			`/hall-rentals/${id}`,
			data
		)
	);

const deleteHallRental = async (id: number): Promise<void> => {
	await apiClient.delete<ApiSuccessBody<HallRental>>(`/hall-rentals/${id}`);
};

export const useHallRentals = (): UseQueryResult<Array<HallRental>> =>
	useQuery<Array<HallRental>>({
		queryKey: ["hall-rentals"],
		queryFn: getHallRentals,
	});

export const useHallRental = (id: number): UseQueryResult<HallRental> =>
	useQuery<HallRental>({
		queryKey: ["hall-rentals", id],
		queryFn: () => getHallRental(id),
		enabled: id > 0,
	});

export const useCreateHallRental = (): UseMutationResult<
	HallRental,
	Error,
	HallRentalFormValues
> => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: createHallRental,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["hall-rentals"] });
			void queryClient.invalidateQueries({ queryKey: ["clients"] });
			void navigate({ to: "/hall-rentals" });
		},
	});
};

export const useUpdateHallRental = (): UseMutationResult<
	HallRental,
	Error,
	{ id: number; data: Partial<HallRentalFormValues> }
> => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: updateHallRental,
		onSuccess: (rental) => {
			void queryClient.invalidateQueries({ queryKey: ["hall-rentals"] });
			queryClient.setQueryData(["hall-rentals", rental.id], rental);
			void navigate({ to: "/hall-rentals" });
		},
	});
};

export const useDeleteHallRental = (): UseMutationResult<
	void,
	Error,
	number
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteHallRental,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["hall-rentals"] });
			void queryClient.invalidateQueries({ queryKey: ["clients"] });
		},
	});
};
