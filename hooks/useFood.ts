import { useState, useCallback } from 'react';
import { CreateFoodData, UpdateFoodData, Food, GetFoodParams } from '../types/food';
import * as ImagePicker from 'expo-image-picker';
import * as foodApi from '../api/food';

export function useFood() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadFoods = useCallback(async (params?: GetFoodParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await foodApi.getFoods(params);
      if (response.foods) {
        setFoods(response.foods);
        setCurrentPage(response.currentPage || 1);
        setTotalPages(response.totalPages || 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const createFood = useCallback(async (data: CreateFoodData) => {
    try {
      setLoading(true);
      setError(null);
      await foodApi.createFood(data);
      await loadFoods({ page: currentPage });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPage, loadFoods]);

  const updateFood = useCallback(async (foodId: number, data: UpdateFoodData) => {
    try {
      setLoading(true);
      setError(null);
      await foodApi.updateFood(foodId, data);
      await loadFoods({ page: currentPage });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPage, loadFoods]);

  const deleteFood = useCallback(async (foodId: number) => {
    try {
      setLoading(true);
      setError(null);
      await foodApi.deleteFood(foodId);
      await loadFoods({ page: currentPage });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPage, loadFoods]);

  const pickAndUploadImage = useCallback(async (foodId: number) => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        throw new Error('Permission to access camera roll was denied');
      }

      // Pick the image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        setLoading(true);
        setError(null);
        await foodApi.uploadFoodImage(foodId, result.assets[0].uri);
        await loadFoods({ page: currentPage });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPage, loadFoods]);

  return {
    foods,
    loading,
    error,
    currentPage,
    totalPages,
    loadFoods,
    createFood,
    updateFood,
    deleteFood,
    pickAndUploadImage,
  };
}

