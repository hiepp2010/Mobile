import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Invitation, InvitationResponse, AcceptInvitationResponse } from '../types/invitation';

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

export async function inviteUser(username: string, groupId: number): Promise<Invitation> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/invitations`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ username, groupId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error sending invitation');
  }

  return data;
}

export async function getPendingInvitations(): Promise<InvitationResponse> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/invitations/pending`, {
    method: 'GET',
    headers,
  });

  const data: InvitationResponse = await response.json();

  if (!response.ok) {
    throw new Error('Error fetching invitations');
  }

  return data; // Returns array of Invitation objects directly
}

export async function acceptInvitation(invitationId: number): Promise<AcceptInvitationResponse> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/invitations/accept`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ invitationId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error accepting invitation');
  }

  return data;
}

