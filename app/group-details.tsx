import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { User, Check, ShoppingBag } from 'lucide-react-native';
import { useGroup } from '../hooks/useGroup';
import { useSharedShoppingList } from '../hooks/useSharedShoppingList';
import { format } from 'date-fns';

export default function GroupDetailsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { groups, loading: groupLoading, loadGroups } = useGroup();
  const { 
    sharedItems, 
    loading: sharedListLoading, 
    loadSharedShoppingLists,
    markAsBought 
  } = useSharedShoppingList();

  const group = groups.find(g => g.id === Number(id));

  useEffect(() => {
    if (id) {
      loadGroups();
      loadSharedShoppingLists(Number(id));
    }
  }, [id, loadGroups, loadSharedShoppingLists]);

  const handleMarkAsBought = async (sharedListId: number) => {
    try {
      await markAsBought({ sharedShoppingListId: sharedListId });
      loadSharedShoppingLists(Number(id));
      Alert.alert('Success', 'Item marked as bought');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to mark item as bought');
    }
  };

  if (groupLoading || sharedListLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!group) {
    return (
      <View style={styles.container}>
        <Text>Group not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{group.name}</Text>
        <Text style={styles.description}>
          {group.description || 'No description'}
        </Text>
        <Text style={styles.date}>
          Created on {format(new Date(group.created_date), 'MMM d, yyyy')}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Members</Text>
        {group.users.map((user) => (
          <View key={user.id} style={styles.memberItem}>
            <User size={20} color="#666" />
            <Text style={styles.memberName}>
              {user.name || user.username}
              {user.id === group.leader_id && (
                <Text style={styles.leaderBadge}> (Leader)</Text>
              )}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shared Shopping Lists</Text>
        {sharedItems.length === 0 ? (
          <View style={styles.emptyState}>
            <ShoppingBag size={32} color="#666" />
            <Text style={styles.emptyStateText}>No shared shopping lists yet</Text>
          </View>
        ) : (
          sharedItems.map((item) => (
            <View key={item.id} style={styles.sharedItem}>
              <View style={styles.itemHeader}>
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>
                    {item.shoppingList.food.name}
                  </Text>
                  <Text style={styles.quantity}>
                    Quantity: {item.shoppingList.quantity}
                    {item.shoppingList.food.serving_size && 
                      ` (${item.shoppingList.food.serving_size})`
                    }
                  </Text>
                </View>
                {!item.is_bought && (
                  <TouchableOpacity
                    style={styles.buyButton}
                    onPress={() => handleMarkAsBought(item.id)}
                  >
                    <Check size={20} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.itemDetails}>
                <Text style={styles.itemDate}>
                  Added: {format(new Date(item.createdAt), 'MMM d, yyyy')}
                </Text>
                {item.is_bought && (
                  <View style={styles.boughtStatus}>
                    <Check size={16} color="#4CAF50" />
                    <Text style={styles.boughtText}>Bought</Text>
                  </View>
                )}
                {item.shoppingList.note && (
                  <Text style={styles.note}>{item.shoppingList.note}</Text>
                )}
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  memberName: {
    fontSize: 16,
    color: '#333',
  },
  leaderBadge: {
    color: '#007AFF',
    fontWeight: '500',
  },
  sharedItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  quantity: {
    fontSize: 14,
    color: '#666',
  },
  buyButton: {
    backgroundColor: '#4CAF50',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetails: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
    marginTop: 8,
  },
  itemDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  boughtStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  boughtText: {
    fontSize: 14,
    color: '#4CAF50',
  },
  note: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
});

