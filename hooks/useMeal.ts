import { useState, useCallback } from 'react';
import { 
  Meal,
  CreateMealData,
  UpdateMealInfoData,
  UpdateMealFoodData,
  GetMealsParams 
} from '../types/meal';
import * as mealApi from '../api/meal';

export function useMeal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadMeals = useCallback(async (params?: GetMealsParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mealApi.getMeals(params);
      if (response.meals) {
        setMeals(response.meals as Meal[]);
        setCurrentPage(params?.page || 1);
        // Assuming the API returns total_pages in the response
        setTotalPages(response.total_pages || 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createMeal = useCallback(async (mealData: CreateMealData) => {
    try {
      setLoading(true);
      setError(null);
      await mealApi.createMeal(mealData);
      await loadMeals({ page: 1 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadMeals]);

  const updateMealInfo = useCallback(async (mealId: number, mealData: UpdateMealInfoData) => {
    try {
      setLoading(true);
      setError(null);
      await mealApi.updateMealInfo(mealId, mealData);
      await loadMeals({ page: currentPage });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPage, loadMeals]);

  const updateMealFood = useCallback(async (mealId: number, foodData: UpdateMealFoodData) => {
    try {
      setLoading(true);
      setError(null);
      await mealApi.updateMealFood(mealId, foodData);
      await loadMeals({ page: currentPage });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPage, loadMeals]);

  const deleteMeal = useCallback(async (mealId: number) => {
    try {
      setLoading(true);
      setError(null);
      await mealApi.deleteMeal(mealId);
      await loadMeals({ page: currentPage });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPage, loadMeals]);

  return {
    meals,
    loading,
    error,
    currentPage,
    totalPages,
    loadMeals,
    createMeal,
    updateMealInfo,
    updateMealFood,
    deleteMeal,
  };
}

