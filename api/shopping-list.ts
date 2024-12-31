import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { 
  CreateShoppingListItem, 
  UpdateShoppingListItem, 
  GetShoppingListParams,
  GetShoppingListByDateParams,
  ShoppingListResponse 
} from '../types/shopping-list';

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

export async function createShoppingList(items: CreateShoppingListItem[]): Promise<ShoppingListResponse> {
  const headers = await getAuthHeaders();

  console.log(JSON.stringify(items))
  
  const response = await fetch(`${API_URL}/shopping-list`, {
    method: 'POST',
    headers,
    body: JSON.stringify(items),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error creating shopping list items');
  }

  return data;
}

export async function updateShoppingList(
  id: number, 
  item: UpdateShoppingListItem
): Promise<ShoppingListResponse> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/shopping-list/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(item),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error updating shopping list item');
  }

  return data;
}

export async function deleteShoppingList(id: number): Promise<ShoppingListResponse> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/shopping-list/${id}`, {
    method: 'DELETE',
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error deleting shopping list item');
  }

  return data;
}

export async function getShoppingList(params?: GetShoppingListParams): Promise<ShoppingListResponse> {
  const headers = await getAuthHeaders();
  
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  
  const url = `${API_URL}/shopping-list${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error retrieving shopping list');
  }

  return data;
}

export async function getShoppingListByDate(params: GetShoppingListByDateParams): Promise<ShoppingListResponse> {
  const headers = await getAuthHeaders();
  
  const queryParams = new URLSearchParams();
  queryParams.append('fromDate', params.fromDate);
  queryParams.append('toDate', params.toDate);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  
  const url = `${API_URL}/shopping-list/by-date?${queryParams.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error retrieving shopping list by date');
  }

  return data;
}

