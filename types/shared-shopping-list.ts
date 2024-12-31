import { Food } from './food';

// The shopping list item with food details
interface DetailedShoppingListItem {
  id: number;
  user_id: number;
  food_id: number;
  quantity: number;
  date: string;
  is_bought: boolean;
  note: string;
  food: Food;
}

export interface SharedShoppingListItem {
  id: number;
  group_id: number;
  is_bought: boolean | null;
  bought_by_user_id: number | null;
  createdAt: string;
  shoppingList: DetailedShoppingListItem;
}

export interface ShareShoppingListData {
  shoppingListId: number;
  groupId: number;
}

export interface MarkAsBoughtData {
  sharedShoppingListId: number;
}

export interface SharedShoppingListResponse {
  status: string;
  sharedLists: SharedShoppingListItem[];
}

export interface MarkAsBoughtResponse {
  status: string;
  message: string;
}

