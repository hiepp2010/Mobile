import { useState, useCallback } from 'react';
import { 
  ShoppingListItem,
  CreateShoppingListItem,
  UpdateShoppingListItem,
  GetShoppingListParams,
  GetShoppingListByDateParams
} from '../types/shopping-list';
import * as shoppingListApi from '../api/shopping-list';

export function useShoppingList() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadShoppingList = useCallback(async (params?: GetShoppingListParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await shoppingListApi.getShoppingList(params);
      if (response.shoppingLists) {
        setItems(response.shoppingLists);
        setCurrentPage(response.currentPage || 1);
        setTotalPages(response.totalPages || 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadShoppingListByDate = useCallback(async (params: GetShoppingListByDateParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await shoppingListApi.getShoppingListByDate(params);
      if (response.shoppingLists) {
        setItems(response.shoppingLists);
        setCurrentPage(response.currentPage || 1);
        setTotalPages(response.totalPages || 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createShoppingList = useCallback(async (items: CreateShoppingListItem[]) => {
    try {
      setLoading(true);
      setError(null);
      await shoppingListApi.createShoppingList(items);
      await loadShoppingList({ page: 1 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadShoppingList]);

  const updateShoppingList = useCallback(async (id: number, item: UpdateShoppingListItem) => {
    try {
      setLoading(true);
      setError(null);
      await shoppingListApi.updateShoppingList(id, item);
      await loadShoppingList({ page: currentPage });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPage, loadShoppingList]);

  const deleteShoppingList = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await shoppingListApi.deleteShoppingList(id);
      await loadShoppingList({ page: currentPage });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPage, loadShoppingList]);

  return {
    items,
    loading,
    error,
    currentPage,
    totalPages,
    loadShoppingList,
    loadShoppingListByDate,
    createShoppingList,
    updateShoppingList,
    deleteShoppingList,
  };
}

