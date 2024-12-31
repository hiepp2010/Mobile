import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { CreateGroupData, GroupResponse } from '../types/group';

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

export async function getUserGroups(): Promise<GroupResponse> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/groups`, {
    method: 'GET',
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error('Error retrieving groups');
  }

  return data;
}

export async function createGroup(groupData: CreateGroupData): Promise<GroupResponse> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/groups`, {
    method: 'POST',
    headers,
    body: JSON.stringify(groupData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error('Error creating group');
  }

  return data;
}

