import { useState, useCallback } from 'react';
import { Invitation } from '../types/invitation';
import * as invitationApi from '../api/invitation';

export function useInvitation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const loadInvitations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const invitations = await invitationApi.getPendingInvitations();
      setInvitations(invitations); // Directly set the array of invitations
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const acceptInvitation = useCallback(async (invitationId: number) => {
    try {
      setLoading(true);
      setError(null);
      await invitationApi.acceptInvitation(invitationId);
      await loadInvitations(); // Reload the invitations after accepting
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadInvitations]);

  return {
    invitations,
    loading,
    error,
    loadInvitations,
    acceptInvitation,
  };
}

