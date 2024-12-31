import { Group } from './group';
import { User } from './auth';

export interface Invitation {
  id: number;
  group_id: number;
  inviter_id: number;
  invitee_id: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  group: Group;
  inviter: User;
}

// The API returns an array of Invitation objects directly
export type InvitationResponse = Invitation[];

export interface AcceptInvitationResponse {
  message: string;
  status: 'success' | 'error';
}

