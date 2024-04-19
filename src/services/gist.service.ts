import { api, endpoints } from "@/lib/axios";
import { useMemo } from "react";
import useSWR from "swr";

export function useGetGists(slug?: string) {
  const URL = slug ? `${endpoints.gist}/${slug}` : endpoints.gist;

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    URL,
    async (url) => {
      const res = await api.get(url);
      return res.data;
    }
  );

  const memoizedValue = useMemo(
    () => ({
      gists: data?.gists || [],
      gistsLoading: isLoading,
      gistsError: error,
      gistsValidating: isValidating,
      gistsEmpty: !isLoading && !data?.gists.length,
      refetch: mutate,
    }),
    [data?.gists, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export const createGist = async (payload: any) => {
  const response = await api.post(endpoints.gist, payload);
  return response.data;
};

export const updateGist = async (slug: string, payload: any) => {
  const response = await api.put(`${endpoints.gist}/${slug}`, payload);
  return response.data;
};

export const deleteGist = async (slug: string) => {
  const response = await api.delete(`${endpoints.gist}/${slug}`);
  return response.data;
};
