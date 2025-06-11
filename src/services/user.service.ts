import { api, endpoints } from "@/lib/axios";
import { useMemo } from "react";
import useSWR from "swr";

export function useGetUsers({organizationId, shouldFetch}: { organizationId?: string; shouldFetch?: boolean }) {

    const URL = organizationId ? `${endpoints.user}?organizationId=${organizationId}` : endpoints.user;

    const { data, isLoading, error, isValidating, mutate } = useSWR(
        shouldFetch ? URL : null,
        async (url) => {
            const res = await api.get(url);
            return res.data;
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