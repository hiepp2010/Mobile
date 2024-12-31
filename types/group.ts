import { User } from './auth';

export interface UserGroup {
  id: number;
  user_id: number;
  group_id: number;
}

export interface GroupUser extends User {
  UserGroup: UserGroup;
}

export interface Group {
  id: number;
  name: string;
  description: string;
  created_date: string;
  participants: number;
  status: 'active' | 'inactive';
  leader_id: number;
  users: GroupUser[];
}

export interface CreateGroupData {
  name: string;
  description: string;
}

// Update the response type to match the actual API response
export type GroupResponse = Group[];

