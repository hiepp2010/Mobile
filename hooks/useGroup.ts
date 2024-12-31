import { useState, useCallback } from 'react';
import { Group, CreateGroupData } from '../types/group';
import * as groupApi from '../api/group';

export function useGroup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);

  const loadGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await groupApi.getUserGroups();
      setGroups(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createGroup = useCallback(async (groupData: CreateGroupData) => {
    try {
      setLoading(true);
      setError(null);
      await groupApi.createGroup(groupData);
      await loadGroups();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadGroups]);

  return {
    groups,
    loading,
    error,
    loadGroups,
    createGroup,
  };
}

