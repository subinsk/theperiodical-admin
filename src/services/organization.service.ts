import { api, endpoints } from '@/lib/axios';
import { useMemo } from 'react';
import useSWR from 'swr';

export function useGetOrganizations({
  slug, shouldFetch
}: {
  slug?: string;
  shouldFetch?: boolean
}) {
  const URL = slug ? `${endpoints.organizations}/${slug}` : endpoints.organizations;

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    shouldFetch ? URL : null,
    async (url) => {
      const res = await api.get(url);
      return res.data;
    },
    {
      refreshInterval: 0,
    }
  );

  const memoizedValue = useMemo(
    () => ({
      organizations: data?.organizations || [],
      organizationsLoading: isLoading,
      organizationsError: error,
      organizationsValidating: isValidating,
      organizationsEmpty: !isLoading && (data?.organizations ? data?.organizations.length : 0),
      refetch: mutate,
    }),
    [data?.organizations, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export const fetchOrganizations = async () => {
  const response = await api.get(endpoints.organizations);
  return response.data;
};

export const fetchOrganizationBySlug = async (slug: string) => {
  const response = await api.get(`${endpoints.organizations}?slug=${slug}`);
  return response.data;
}

export const createOrganization = async (payload: any) => {
  const response = await api.post(endpoints.organizations, payload);
  return response.data;
};
export const updateOrganization = async (id: string, payload: any) => {
  const response = await api.put(`${endpoints.organizations}?id=${id}`, payload);
  return response.data;
};
export const deleteOrganization = async (id: string) => {
  const response = await api.delete(`${endpoints.organizations}?id=${id}`);
  return response.data;
};