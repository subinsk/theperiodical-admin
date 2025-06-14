import { api, endpoints } from "@/lib/axios";
import { useMemo } from "react";
import useSWR from "swr";

export function useGetUsers({ organizationId, role, shouldFetch }: { organizationId?: string; role?: string; shouldFetch?: boolean }) {
    const params = new URLSearchParams();
    if (organizationId) params.append('organizationId', organizationId);
    if (role) params.append('role', role);

    const queryString = params.toString();
    const URL = `${endpoints.user}${queryString ? `?${queryString}` : ''}`; const { data, isLoading, error, isValidating, mutate } = useSWR(
        shouldFetch ? URL : null,
        async (url) => {
            const res = await api.get(url);
            return res.data;
        },
        {
            refreshInterval: 0
        }
    );

    const memoizedValue = useMemo(
        () => ({
            users: data?.data || [],
            usersLoading: isLoading,
            usersError: error,
            usersValidating: isValidating,
            usersEmpty: !isLoading && !data?.data.length,
            refetch: mutate
        }), [data?.data, error, isLoading, isValidating, mutate]
    )

    return memoizedValue
}

export async function getUserById(id: string) {
    const response = await api.get(`${endpoints.user}/${id}`)

    return response.data
}

export async function updateUser(id: string, body: any) {
    const response = await api.put(`${endpoints.user}/${id}`, body)
    return response.data
}