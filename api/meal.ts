import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { 
  CreateMealData, 
  UpdateMealInfoData, 
  UpdateMealFoodData, 
  GetMealsParams,
  MealResponse 
} from '../types/meal';

const API_URL = Platform.select({
  android: 'http://10.0.2.2:3000',
  ios: 'http://localhost:3000',
  default: 'http://localhost:3000',
});

const defaultHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

async function getAuthHeaders() {
  const session = await AsyncStorage.getItem('session');
  if (!session) {
    throw new Error('No session found');
  }
  return {
    ...defaultHeaders,
    'Authorization': `Bearer ${session}`,
  };
}

export async function createMeal(mealData: CreateMealData): Promise<MealResponse> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/meals/create`, {
    method: 'POST',
    headers,
    body: JSON.stringify(mealData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error creating meal');
  }

  return data;
}

export async function getMeals(params?: GetMealsParams): Promise<MealResponse> {
  const headers = await getAuthHeaders();

  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.meal_type) queryParams.append('meal_type', params.meal_type);
  if (params?.from_date) queryParams.append('from_date', params.from_date);
  if (params?.to_date) queryParams.append('to_date', params.to_date);

  const url = `${API_URL}/meals${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error retrieving meals');
  }

  return data;
}

export async function updateMealInfo(mealId: number, mealData: UpdateMealInfoData): Promise<MealResponse> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/meals/update-info/${mealId}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(mealData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error updating meal information');
  }

  return data;
}

export async function updateMealFood(mealId: number, foodData: UpdateMealFoodData): Promise<MealResponse> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/meals/update-food/${mealId}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(foodData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error updating meal foods');
  }

  return data;
}

export async function deleteMeal(mealId: number): Promise<MealResponse> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/meals/delete/${mealId}`, {
    method: 'DELETE',
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error deleting meal');
  }

  return data;
}

