import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { Plus, Users, X, User, Check, ShoppingBag, Share2 } from 'lucide-react-native';
import { useGroup } from '../hooks/useGroup';
import { useSharedShoppingList } from '../hooks/useSharedShoppingList';
import { useShoppingList } from '../hooks/useShoppingList';
import { CreateGroupData } from '../types/group';
import { format } from 'date-fns';
import { useFood } from '@/hooks/useFood';
import { inviteUser } from '../api/invitation';
import React from 'react';

export default function GroupsPage() {
  const { groups, loading, error, loadGroups, createGroup } = useGroup();
  const { 
    sharedItems, 
    loading: sharedListLoading, 
    loadSharedShoppingLists,
    markAsBought,
    shareShoppingList 
  } = useSharedShoppingList();
  const {
    items: personalShoppingLists,
    loadShoppingList,
  } = useShoppingList();
  const { foods, loading: foodsLoading, loadFoods } = useFood();

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [newGroup, setNewGroup] = useState<CreateGroupData>({
    name: '',
    description: '',
  });
  const [showShareForm, setShowShareForm] = useState(false);
  const [selectedShoppingListId, setSelectedShoppingListId] = useState<number>(0);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteUsername, setInviteUsername] = useState('');
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    loadGroups();
    loadFoods();
  }, [loadGroups, loadFoods]);

  useEffect(() => {
    if (selectedGroupId) {
      loadSharedShoppingLists(selectedGroupId);
    }
  }, [selectedGroupId, loadSharedShoppingLists]);

  useEffect(() => {
    loadShoppingList();
  }, [loadShoppingList]);

  const handleCreateGroup = async () => {
    if (!newGroup.name.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    try {
      await createGroup(newGroup);
      setShowAddForm(false);
      setNewGroup({
        name: '',
        description: '',
      });
      Alert.alert('Success', 'Group created successfully');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to create group');
    }
  };

  const handleMarkAsBought = async (sharedListId: number) => {
    try {
      await markAsBought({ sharedShoppingListId: sharedListId });
      if (selectedGroupId) {
        loadSharedShoppingLists(selectedGroupId);
      }
      Alert.alert('Success', 'Item marked as bought');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to mark item as bought');
    }
  };

  const handleShareShoppingList = async () => {
    if (!selectedGroupId || !selectedShoppingListId) {
      Alert.alert('Error', 'Please select a shopping list to share');
      return;
    }

    try {
      await shareShoppingList({
        shoppingListId: selectedShoppingListId,
        groupId: selectedGroupId,
      });
      await loadSharedShoppingLists(selectedGroupId);
      setShowShareForm(false);
      Alert.alert('Success', 'Shopping list shared successfully');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to share shopping list');
    }
  };

  const handleInviteUser = async () => {
    if (!selectedGroupId || !inviteUsername.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    try {
      setInviting(true);
      await inviteUser(inviteUsername.trim(), selectedGroupId);
      setShowInviteForm(false);
      setInviteUsername('');
      Alert.alert('Success', 'Invitation sent successfully');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setInviting(false);
    }
  };

  const selectedGroup = selectedGroupId ? groups.find(g => g.id === selectedGroupId) : null;

  const GroupForm = () => (
    <View style={styles.formContainer}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>Create New Group</Text>
        <TouchableOpacity 
          onPress={() => setShowAddForm(false)}
          style={styles.closeButton}
        >
          <X size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Group Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter group name"
          value={newGroup.name}
          onChangeText={(text) => setNewGroup({ ...newGroup, name: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter group description"
          value={newGroup.description}
          onChangeText={(text) => setNewGroup({ ...newGroup, description: text })}
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity 
        style={styles.createButton}
        onPress={handleCreateGroup}
      >
        <Text style={styles.buttonText}>Create Group</Text>
      </TouchableOpacity>
    </View>
  );

  const ShareShoppingListForm = () => (
    <View style={styles.formContainer}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>Share Shopping List</Text>
        <TouchableOpacity 
          onPress={() => setShowShareForm(false)}
          style={styles.closeButton}
        >
          <X size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Select Shopping List</Text>
        <View style={styles.input}>
          <Picker
            selectedValue={selectedShoppingListId}
            onValueChange={(itemValue) => setSelectedShoppingListId(Number(itemValue))}
          >
            <Picker.Item label="Select a shopping list..." value={0} />
            {personalShoppingLists.map((item) => (
              <Picker.Item 
                key={item.id} 
                label={`${item.quantity}x ${foods.find(f => f.id === item.food_id)?.name || 'Unknown Food'}`}
                value={item.id} 
              />
            ))}
          </Picker>
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.createButton,
          !selectedShoppingListId && styles.buttonDisabled
        ]}
        onPress={handleShareShoppingList}
        disabled={!selectedShoppingListId}
      >
        <Text style={styles.buttonText}>Share Shopping List</Text>
      </TouchableOpacity>
    </View>
  );

  const InviteForm = () => (
    <View style={styles.formContainer}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>Invite User</Text>
        <TouchableOpacity 
          onPress={() => setShowInviteForm(false)}
          style={styles.closeButton}
        >
          <X size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter username to invite"
          value={inviteUsername}
          onChangeText={setInviteUsername}
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity 
        style={[
          styles.createButton,
          (inviting || !inviteUsername.trim()) && styles.buttonDisabled
        ]}
        onPress={handleInviteUser}
        disabled={inviting || !inviteUsername.trim()}
      >
        <Text style={styles.buttonText}>
          {inviting ? 'Sending Invitation...' : 'Send Invitation'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const GroupDetails = () => {
    if (!selectedGroup) return null;

    return (
      <Modal
        visible={!!selectedGroupId}
        animationType="slide"
        onRequestClose={() => setSelectedGroupId(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedGroup.name}</Text>
            <TouchableOpacity 
              onPress={() => setSelectedGroupId(null)}
              style={styles.closeButton}
            >
              <X size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.groupInfo}>
              <Text style={styles.description}>
                {selectedGroup.description || 'No description'}
              </Text>
              <Text style={styles.date}>
                Created on {format(new Date(selectedGroup.created_date), 'MMM d, yyyy')}
              </Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Members</Text>
                <TouchableOpacity 
                  style={styles.inviteButton}
                  onPress={() => setShowInviteForm(true)}
                >
                  <Plus size={20} color="#007AFF" />
                  <Text style={styles.inviteButtonText}>Invite User</Text>
                </TouchableOpacity>
              </View>
              
              {showInviteForm ? (
                <InviteForm />
              ) : (
                selectedGroup.users.map((user) => (
                  <View key={user.id} style={styles.memberItem}>
                    <User size={20} color="#666" />
                    <Text style={styles.memberName}>
                      {user.name || user.username}
                      {user.id === selectedGroup.leader_id && (
                        <Text style={styles.leaderBadge}> (Leader)</Text>
                      )}
                    </Text>
                  </View>
                ))
              )}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Shared Shopping Lists</Text>
                <TouchableOpacity 
                  style={styles.shareButton}
                  onPress={() => setShowShareForm(true)}
                >
                  <Share2 size={20} color="#007AFF" />
                  <Text style={styles.shareButtonText}>Share List</Text>
                </TouchableOpacity>
              </View>

              {showShareForm ? (
                <ShareShoppingListForm />
              ) : sharedListLoading ? (
                <Text style={styles.loadingText}>Loading shared lists...</Text>
              ) : sharedItems.length === 0 ? (
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
        </View>
      </Modal>
    );
  };

  if (loading || foodsLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Groups</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
          >
            <Plus size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {showAddForm ? (
          <GroupForm />
        ) : (
          <>
            {groups.length === 0 ? (
              <View style={styles.emptyState}>
                <Users size={48} color="#666" />
                <Text style={styles.emptyStateText}>No groups yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Create a group to start collaborating with others
                </Text>
              </View>
            ) : (
              groups.map((group) => (
                <TouchableOpacity
                  key={group.id}
                  style={styles.groupItem}
                  onPress={() => setSelectedGroupId(group.id)}
                >
                  <View style={styles.groupContent}>
                    <Text style={styles.groupName}>{group.name}</Text>
                    <Text style={styles.groupDescription}>
                      {group.description || 'No description'}
                    </Text>
                    <Text style={styles.groupDate}>
                      Created on {format(new Date(group.created_date), 'MMM d, yyyy')}
                    </Text>
                    <Text style={styles.groupParticipants}>
                      {group.participants} participant{group.participants !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </>
        )}
      </ScrollView>
      <GroupDetails />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    margin: 10,
    borderRadius: 10,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  groupItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  groupContent: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  groupDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  groupDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  groupParticipants: {
    fontSize: 12,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
  },
  groupInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    color: '#FF4444',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    gap: 4,
  },
  shareButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    gap: 4,
  },
  inviteButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

