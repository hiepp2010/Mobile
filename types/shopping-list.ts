export interface ShoppingListItem {
    id?: number;
    user_id?: number;
    food_id: number;
    quantity: number;
    date: string;
    is_bought: boolean;
    note?: string;
  }
  
  export interface CreateShoppingListItem {
    food_id: number;
    quantity: number;
    date: string;
    is_bought: boolean;
    note?: string;
  }
  
  export interface UpdateShoppingListItem {
    quantity?: number;
    date?: string;
    is_bought?: boolean;
    note?: string;
  }
  
  export interface GetShoppingListParams {
    page?: number;
    limit?: number;
  }
  
  export interface GetShoppingListByDateParams extends GetShoppingListParams {
    fromDate: string;
    toDate: string;
  }
  
  export interface ShoppingListResponse {
    message: string;
    shoppingLists?: ShoppingListItem[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
  }
  
  