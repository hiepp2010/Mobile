import { useState, useCallback } from 'react';
import { NutritionStats, NutritionStatsParams } from '../types/nutrition';
import * as nutritionApi from '../api/nutrition';

export function useNutrition() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<NutritionStats | null>(null);

  const loadNutritionStats = useCallback(async (params?: NutritionStatsParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await nutritionApi.getNutritionStats(params);
      setStats(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stats,
    loading,
    error,
    loadNutritionStats,
  };
}

