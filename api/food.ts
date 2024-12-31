import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { CreateFoodData, UpdateFoodData, GetFoodParams, FoodResponse, UploadImageResponse } from '../types/food';

const API_URL = Platform.select({
  android: 'http://10.0.2.2:3000',
  ios: 'http://localhost:3000',
  default: 'http://localhost:3000',
});

const defaultHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

async function getAuthHeaders(contentType = 'application/json') {
  const session = await AsyncStorage.getItem('session');
  if (!session) {
    throw new Error('No session found');
  }
  return {
    ...defaultHeaders,
    'Content-Type': contentType,
    'Authorization': `Bearer ${session}`,
  };
}

export async function createFood(foodData: CreateFoodData): Promise<FoodResponse> {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_URL}/food/create`, {
    method: 'POST',
    headers,
    body: JSON.stringify(foodData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error creating food item');
  }

  return data;
}

export async function deleteFood(foodId: number): Promise<FoodResponse> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/food/delete/${foodId}`, {
    method: 'DELETE',
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error deleting food item');
  }

  return data;
}

export async function updateFood(foodId: number, foodData: UpdateFoodData): Promise<FoodResponse> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/food/update/${foodId}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(foodData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error updating food item');
  }

  return data;
}

export async function getFoods(params?: GetFoodParams): Promise<FoodResponse> {
  const headers = await getAuthHeaders();
  
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  
  const url = `${API_URL}/food${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  const data = await response.json();
  console.log(data)

  if (!response.ok) {
    throw new Error(data.message || 'Error retrieving food items');
  }

  return data;
}

export async function uploadFoodImage(foodId: number, imageUri: string): Promise<UploadImageResponse> {
  const headers = await getAuthHeaders('multipart/form-data');
  
  // Create form data
  const formData = new FormData();
  formData.append('foodId', foodId.toString());
  
  // Add the image file
  const filename = imageUri.split('/').pop() || 'image.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';
  
  formData.append('image', {
    uri: imageUri,
    name: filename,
    type,
  } as any);

  const response = await fetch(`${API_URL}/food/upload-image`, {
    method: 'POST',
    headers: {
      'Authorization': headers.Authorization,
      'Accept': 'application/json',
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error uploading image');
  }

  return data;
}

