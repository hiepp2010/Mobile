import { useState, useCallback } from 'react';
import { 
  SharedShoppingListItem,
  ShareShoppingListData,
  MarkAsBoughtData,
} from '../types/shared-shopping-list';
import * as sharedShoppingListApi from '../api/shared-shopping-list';

export function useSharedShoppingList() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sharedItems, setSharedItems] = useState<SharedShoppingListItem[]>([]);

  const shareShoppingList = useCallback(async (data: ShareShoppingListData) => {
    try {
      setLoading(true);
      setError(null);
      await sharedShoppingListApi.shareShoppingList(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSharedShoppingLists = useCallback(async (groupId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await sharedShoppingListApi.getSharedShoppingLists(groupId);
      setSharedItems(response.sharedLists);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsBought = useCallback(async (data: MarkAsBoughtData) => {
    try {
      setLoading(true);
      setError(null);
      await sharedShoppingListApi.markSharedListAsBought(data);
      // If you have the current groupId stored, you could reload the shared lists here
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sharedItems,
    loading,
    error,
    shareShoppingList,
    loadSharedShoppingLists,
    markAsBought,
  };
}

