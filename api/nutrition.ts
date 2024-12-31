import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { NutritionStatsParams, NutritionStatsResponse } from '../types/nutrition';

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

export async function getNutritionStats(params?: NutritionStatsParams): Promise<NutritionStatsResponse> {
  const headers = await getAuthHeaders();

  const queryParams = new URLSearchParams();
  if (params?.fromDate) queryParams.append('fromDate', params.fromDate);
  if (params?.toDate) queryParams.append('toDate', params.toDate);

  const url = `${API_URL}/users/nutrition-stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error retrieving nutrition statistics');
  }

  return data;
}

