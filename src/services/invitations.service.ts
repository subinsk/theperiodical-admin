import { api, endpoints } from "@/lib/axios";
import { useMemo } from "react";
import useSWR from "swr";

export function useGetInvitations({organizationId, shouldFetch}:{organizationId?: string, shouldFetch?: boolean}) { 
  const URL = organizationId
    ? `${endpoints.invitations}?organization_id=${organizationId}`
    : endpoints.invitations;

    const { data, isLoading, error, isValidating, mutate } = useSWR(
    shouldFetch ? URL : null,
    async (url) => {
        const res = await api.get(url);
        return res.data;
        }
    );

  const memoizedValue = useMemo(
    () => ({
      invitations: data?.invitations || [],
      invitationsLoading: isLoading,
      invitationsError: error,
      invitationsValidating: isValidating,
      invitationsEmpty: !isLoading && (data?.invitations ? data?.invitations.length : 0),
      refetch: mutate,
    }),
    [data?.invitations, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export const fetchInvitations = async () => {
    const response = await api.get(endpoints.invitations);
    return response.data;
  };

export const createInvitation = async (payload: any, organizationId?: string) => {
  const url = organizationId
    ? `${endpoints.invitations}?organization_id=${organizationId}`
    : endpoints.invitations;

  const response = await api.post(url, payload);
  return response.data;
  };

export const deleteInvitation = async (invitationId: string) => {
  const response = await api.delete(`${endpoints.invitations}?invitation_id=${invitationId}`);
  return response.data;
}
