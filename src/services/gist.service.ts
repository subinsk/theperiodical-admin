import { api, endpoints } from "@/lib/axios";
import axios from "axios";
import { useMemo } from "react";
import useSWR from "swr";

export function useGetGists(slug?: string) {
  const URL = slug ? `${endpoints.gist}/${slug}` : endpoints.gist;

  const { data, isLoading, error, isValidating } = useSWR(URL, async (url) => {
    const res = await api.get(url);
    return res.data;
  });

  const memoizedValue = useMemo(
    () => ({
      gists: data?.gists || [],
      gistsLoading: isLoading,
      gistsError: error,
      gistsValidating: isValidating,
      gistsEmpty: !isLoading && !data?.gists.length,
    }),
    [data?.gists, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export const createGist = async (payload: any) => {
  const response = await api.post(endpoints.gist, payload);
  return response.data;
};
