import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Calendar, Check, RotateCw } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useShoppingList } from '../hooks/useShoppingList';
import { CreateShoppingListItem, ShoppingListItem } from '../types/shopping-list';
import { format } from 'date-fns';
import { useFood } from '../hooks/useFood';
import React from 'react';

export default function ShoppingListPage() {
  const { 
    items, 
    loading, 
    error, 
    loadShoppingList,
    createShoppingList,
    updateShoppingList,
    deleteShoppingList,
    loadShoppingListByDate
  } = useShoppingList();

  const { foods, loadFoods } = useFood();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingListItem | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newItem, setNewItem] = useState<CreateShoppingListItem>({
    food_id: 0,
    quantity: 0,
    date: format(new Date(), 'yyyy-MM-dd'),
    is_bought: false,
    note: '',
  });

  useEffect(() => {
    loadShoppingList({ page: 1, limit: 10 });
    loadFoods(); // Load foods for the dropdown
  }, [loadShoppingList, loadFoods]);

  const handleRefresh = () => {
    loadShoppingList({ page: 1, limit: 10 });
    loadFoods();
  };

  const handleAddItem = async () => {
    if (!newItem.food_id || newItem.food_id === 0) {
      Alert.alert('Error', 'Please select a food item');
      return;
    }
    if (!newItem.quantity) {
      Alert.alert('Error', 'Please enter a quantity');
      return;
    }

    try {
      await createShoppingList([newItem]);
      setShowAddForm(false);
      setNewItem({
        food_id: 0,
        quantity: 0,
        date: format(new Date(), 'yyyy-MM-dd'),
        is_bought: false,
        note: '',
      });
      Alert.alert('Success', 'Shopping list item added successfully');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to add item');
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;

    try {
      await updateShoppingList(editingItem.id!, {
        quantity: editingItem.quantity,
        date: editingItem.date,
        is_bought: editingItem.is_bought,
        note: editingItem.note,
      });
      setEditingItem(null);
      Alert.alert('Success', 'Shopping list item updated successfully');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to update item');
    }
  };

  const handleDeleteItem = async (id: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteShoppingList(id);
              Alert.alert('Success', 'Shopping list item deleted successfully');
            } catch (err) {
              Alert.alert('Error', err instanceof Error ? err.message : 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  const handleToggleBought = async (item: ShoppingListItem) => {
    try {
      await updateShoppingList(item.id!, {
        is_bought: !item.is_bought,
      });
      Alert.alert('Success', `Item marked as ${!item.is_bought ? 'bought' : 'not bought'}`);
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to update item');
    }
  };

  const ShoppingListForm = ({ 
    data, 
    onSubmit, 
    onCancel, 
    title, 
    submitText 
  }: { 
    data: CreateShoppingListItem | ShoppingListItem;
    onSubmit: () => void;
    onCancel: () => void;
    title: string;
    submitText: string;
  }) => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>{title}</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Select Food</Text>
        <View style={styles.input}>
          <Picker
            selectedValue={data.food_id}
            onValueChange={(itemValue) => {
              if ('id' in data) {
                setEditingItem({ ...editingItem!, food_id: itemValue });
              } else {
                setNewItem({ ...newItem, food_id: itemValue });
              }
            }}
          >
            <Picker.Item label="Select a food..." value={0} />
            {foods.map((food) => (
              <Picker.Item 
                key={food.id} 
                label={`${food.name} (${food.calories} kcal)`} 
                value={food.id} 
              />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Quantity</Text>
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          value={data.quantity.toString()}
          onChangeText={(text) => {
            const value = parseFloat(text) || 0;
            if ('id' in data) {
              setEditingItem({ ...editingItem!, quantity: value });
            } else {
              setNewItem({ ...newItem, quantity: value });
            }
          }}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Calendar size={24} color="#007AFF" />
          <Text style={styles.dateButtonText}>{data.date}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Note</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Add a note..."
          value={data.note}
          onChangeText={(text) => {
            if ('id' in data) {
              setEditingItem({ ...editingItem!, note: text });
            } else {
              setNewItem({ ...newItem, note: text });
            }
          }}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.formButtons}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.submitButton]}
          onPress={onSubmit}
        >
          <Text style={styles.buttonText}>{submitText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping List</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleRefresh}
          >
            <RotateCw size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
          >
            <Plus size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {showAddForm ? (
        <ShoppingListForm
          data={newItem}
          onSubmit={handleAddItem}
          onCancel={() => setShowAddForm(false)}
          title="Add Shopping List Item"
          submitText="Add Item"
        />
      ) : editingItem ? (
        <ShoppingListForm
          data={editingItem}
          onSubmit={handleUpdateItem}
          onCancel={() => setEditingItem(null)}
          title="Edit Shopping List Item"
          submitText="Update Item"
        />
      ) : (
        <>
          {items.map((item) => (
            <View key={item.id} style={styles.listItem}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  item.is_bought && styles.checkboxChecked
                ]}
                onPress={() => handleToggleBought(item)}
              >
                {item.is_bought && <Check size={16} color="#fff" />}
              </TouchableOpacity>
              <View style={styles.itemContent}>
                <Text style={[
                  styles.itemName,
                  item.is_bought && styles.itemNameChecked
                ]}>
                  {foods.find(f => f.id === item.food_id)?.name || 'Unknown Food'}
                </Text>
                <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                <Text style={styles.itemDate}>Date: {format(new Date(item.date), 'yyyy-MM-dd')}</Text>
                {item.note && <Text style={styles.itemNote}>{item.note}</Text>}
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => setEditingItem(item)}
                >
                  <Edit2 size={24} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteItem(item.id!)}
                >
                  <Trash2 size={24} color="#FF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date && event.type === 'set') {
              const formattedDate = format(date, 'yyyy-MM-dd');
              if (editingItem) {
                setEditingItem({ ...editingItem, date: formattedDate });
              } else {
                setNewItem({ ...newItem, date: formattedDate });
              }
            }
          }}
        />
      )}
    </ScrollView>
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButton: {
    padding: 8,
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    margin: 10,
    borderRadius: 10,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  itemNote: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 10,
  },
  editButton: {
    padding: 10,
  },
  deleteButton: {
    padding: 10,
  },
  errorText: {
    color: '#FF4444',
    textAlign: 'center',
    marginTop: 20,
  },
});

