import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, RegisterData, UserProfile } from '../types/auth';
import { Platform } from 'react-native';

const API_URL = Platform.select({
  android: 'http://10.0.2.2:3000',
  ios: 'http://localhost:3000',
  default: 'http://localhost:3000',
});

const defaultHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

export async function register(userData: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  await AsyncStorage.setItem('session', data.session);
  return data;
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  await AsyncStorage.setItem('session', data.session);
  return data;
}

export async function updateProfile(userData: UserProfile): Promise<any> {
  const session = await AsyncStorage.getItem('session');
  
  if (!session) {
    throw new Error('No session found');
  }

  const response = await fetch(`${API_URL}/users/add-info`, {
    method: 'POST', // Changed from PUT to POST to match the backend
    headers: {
      ...defaultHeaders,
      'Authorization': `Bearer ${session}`,
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Profile update failed');
  }

  return data;
}

