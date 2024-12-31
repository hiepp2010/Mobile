import { useState, useCallback } from 'react';
import { FoodStatistic } from '../types/statistics';
import * as statisticsApi from '../api/statistics';

export function useStatistics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<FoodStatistic[]>([]);

  const loadStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await statisticsApi.getFoodStatistics();
      setStatistics(response.statistics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    statistics,
    loading,
    error,
    loadStatistics,
  };
}

