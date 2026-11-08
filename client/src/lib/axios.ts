import axios, { type AxiosError } from "axios";

import { toApiRequestError } from "@/lib/api";
import { readStoredToken } from "@/store/authStore";

const envToken = import.meta.env.VITE_API_AUTH_TOKEN;

export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

if (envToken) {
	apiClient.defaults.headers.common.Authorization = `Bearer ${envToken}`;
}

apiClient.interceptors.request.use((config) => {
	const token = readStoredToken() ?? envToken;

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

apiClient.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		const normalized = toApiRequestError(error);

		console.error("API Error:", normalized.message);

		return Promise.reject(normalized);
	}
);
