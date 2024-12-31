import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { StatisticsResponse } from '../types/statistics';

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

export async function getFoodStatistics(): Promise<StatisticsResponse> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/shopping-list/statistics`, {
    method: 'GET',
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error retrieving food statistics');
  }

  return data;
}

