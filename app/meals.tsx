import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Calendar, RotateCw } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMeal } from '@/hooks/useMeal';
import { useFood } from '../hooks/useFood';
import { CreateMealData, MealType, UpdateMealInfoData, Meal } from '../types/meal';
import { format } from 'date-fns';
import React from 'react';

export default function MealsPage() {
  const { 
    meals, 
    loading, 
    error, 
    loadMeals,
    createMeal,
    updateMealInfo,
    updateMealFood,
    deleteMeal,
  } = useMeal();

  const { foods, loadFoods } = useFood();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newMeal, setNewMeal] = useState<CreateMealData>({
    name: '',
    meal_type: 'breakfast',
    date: format(new Date(), 'yyyy-MM-dd'),
    foods: [],
  });

  useEffect(() => {
    loadMeals({ page: 1, limit: 10 });
    loadFoods();
  }, [loadMeals, loadFoods]);

  const handleRefresh = () => {
    loadMeals({ page: 1, limit: 10 });
    loadFoods();
  };

  const handleAddMeal = async () => {
    if (!newMeal.name.trim()) {
      Alert.alert('Error', 'Please enter a meal name');
      return;
    }
    if (newMeal.foods.length === 0) {
      Alert.alert('Error', 'Please add at least one food item');
      return;
    }

    try {
      await createMeal(newMeal);
      setShowAddForm(false);
      setNewMeal({
        name: '',
        meal_type: 'breakfast',
        date: format(new Date(), 'yyyy-MM-dd'),
        foods: [],
      });
      Alert.alert('Success', 'Meal added successfully');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to add meal');
    }
  };

  const handleUpdateMeal = async () => {
    if (!editingMeal) return;

    try {
      const updateData: UpdateMealInfoData = {
        name: editingMeal.name,
        meal_type: editingMeal.meal_type,
        date: editingMeal.date,
      };
      await updateMealInfo(editingMeal.id, updateData);
      setEditingMeal(null);
      Alert.alert('Success', 'Meal updated successfully');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to update meal');
    }
  };

  const handleDeleteMeal = async (id: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this meal?',
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
              await deleteMeal(id);
              Alert.alert('Success', 'Meal deleted successfully');
            } catch (err) {
              Alert.alert('Error', err instanceof Error ? err.message : 'Failed to delete meal');
            }
          },
        },
      ]
    );
  };

  const MealForm = ({ 
    data, 
    onSubmit, 
    onCancel, 
    title, 
    submitText 
  }: { 
    data: CreateMealData | Meal;
    onSubmit: () => void;
    onCancel: () => void;
    title: string;
    submitText: string;
  }) => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>{title}</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Meal Name"
          value={data.name}
          onChangeText={(text) => {
            if ('id' in data) {
              setEditingMeal({ ...editingMeal!, name: text });
            } else {
              setNewMeal({ ...newMeal, name: text });
            }
          }}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Meal Type</Text>
        <View style={styles.input}>
          <Picker
            selectedValue={data.meal_type}
            onValueChange={(itemValue: MealType) => {
              if ('id' in data) {
                setEditingMeal({ ...editingMeal!, meal_type: itemValue });
              } else {
                setNewMeal({ ...newMeal, meal_type: itemValue });
              }
            }}
          >
            <Picker.Item label="Breakfast" value="breakfast" />
            <Picker.Item label="Lunch" value="lunch" />
            <Picker.Item label="Dinner" value="dinner" />
            <Picker.Item label="Snack" value="snack" />
          </Picker>
        </View>
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
        <Text style={styles.inputLabel}>Foods</Text>
        {!('id' in data) && (
          <View style={styles.foodSelector}>
            <Picker
              selectedValue={0}
              onValueChange={(foodId) => {
                if (foodId === 0) return;
                const selectedFood = foods.find(f => f.id === foodId);
                if (selectedFood) {
                  setNewMeal({
                    ...newMeal,
                    foods: [
                      ...newMeal.foods,
                      {
                        id: selectedFood.id,
                        name: selectedFood.name,
                        calories: selectedFood.calories,
                        protein: selectedFood.protein,
                        carbohydrates: selectedFood.carbohydrates,
                        fats: selectedFood.fats,
                        vitamins: selectedFood.vitamins,
                        minerals: selectedFood.minerals,
                        quantity: 1,
                      },
                    ],
                  });
                }
              }}
            >
              <Picker.Item label="Add food..." value={0} />
              {foods.map((food) => (
                <Picker.Item 
                  key={food.id} 
                  label={`${food.name} (${food.calories} kcal)`} 
                  value={food.id} 
                />
              ))}
            </Picker>
          </View>
        )}
        <View style={styles.foodList}>
          {data.foods.map((food, index) => (
            <View key={index} style={styles.foodItem}>
              <Text style={styles.foodName}>{food.name}</Text>
              <Text style={styles.foodCalories}>{food.calories} kcal</Text>
              {!('id' in data) && (
                <TouchableOpacity
                  style={styles.removeFood}
                  onPress={() => {
                    setNewMeal({
                      ...newMeal,
                      foods: newMeal.foods.filter((_, i) => i !== index),
                    });
                  }}
                >
                  <Trash2 size={20} color="#FF4444" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
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
        <Text style={styles.title}>Meals</Text>
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
        <MealForm
          data={newMeal}
          onSubmit={handleAddMeal}
          onCancel={() => setShowAddForm(false)}
          title="Add New Meal"
          submitText="Add Meal"
        />
      ) : editingMeal ? (
        <MealForm
          data={editingMeal}
          onSubmit={handleUpdateMeal}
          onCancel={() => setEditingMeal(null)}
          title="Edit Meal"
          submitText="Update Meal"
        />
      ) : (
        <>
          {meals.map((meal) => (
            <View key={meal.id} style={styles.mealItem}>
              <View style={styles.mealContent}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealType}>Type: {meal.meal_type}</Text>
                <Text style={styles.mealDate}>Date: {format(new Date(meal.date), 'yyyy-MM-dd')}</Text>
                <View style={styles.nutritionInfo}>
                  <Text style={styles.nutritionText}>Calories: {meal.total_calories}</Text>
                  <Text style={styles.nutritionText}>Protein: {meal.total_protein}g</Text>
                  <Text style={styles.nutritionText}>Carbs: {meal.total_carbohydrates}g</Text>
                  <Text style={styles.nutritionText}>Fats: {meal.total_fats}g</Text>
                </View>
                <Text style={styles.foodsTitle}>Foods:</Text>
                {meal.foods.map((food, index) => (
                  <Text key={index} style={styles.foodText}>
                    • {food.name} ({food.quantity}x)
                  </Text>
                ))}
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => setEditingMeal(meal)}
                >
                  <Edit2 size={24} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteMeal(meal.id)}
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
              if (editingMeal) {
                setEditingMeal({ ...editingMeal, date: formattedDate });
              } else {
                setNewMeal({ ...newMeal, date: formattedDate });
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
  foodSelector: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  foodList: {
    gap: 8,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  foodName: {
    flex: 1,
    fontSize: 16,
  },
  foodCalories: {
    marginRight: 10,
    color: '#666',
  },
  removeFood: {
    padding: 4,
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
  mealItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mealContent: {
    flex: 1,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mealType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  mealDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  nutritionInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  nutritionText: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  foodsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  foodText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
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

