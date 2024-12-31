import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { 
  ShareShoppingListData, 
  SharedShoppingListResponse, 
  MarkAsBoughtData, 
  MarkAsBoughtResponse 
} from '../types/shared-shopping-list';

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

export async function shareShoppingList(data: ShareShoppingListData): Promise<SharedShoppingListResponse> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/shopping-list/share`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || 'Error sharing shopping list');
  }

  return responseData;
}

export async function getSharedShoppingLists(groupId: number): Promise<SharedShoppingListResponse> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/shopping-list/group/${groupId}`, {
    method: 'GET',
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error retrieving shared shopping lists');
  }

  return data;
}

export async function markSharedListAsBought(data: MarkAsBoughtData): Promise<MarkAsBoughtResponse> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/shopping-list/group/mark-as-bought`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || 'Error marking shopping list as bought');
  }

  return responseData;
}

