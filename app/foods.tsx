import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { useFood } from '../hooks/useFood';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Info, Image as ImageIcon, Edit2, Camera } from 'lucide-react-native';
import { CreateFoodData, Food } from '../types/food';
import React from 'react';

export default function FoodsPage() {
  const { foods, loading, error, loadFoods, createFood, deleteFood, updateFood, pickAndUploadImage } = useFood();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [newFood, setNewFood] = useState<CreateFoodData>({
    name: '',
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fats: 0,
    vitamins: 0,
    minerals: 0,
    serving_size: '',
  });

  useEffect(() => {
    loadFoods({ page: 1, limit: 10 });
  }, [loadFoods]);

  const handleAddFood = async () => {
    if (!newFood.name.trim()) {
      Alert.alert('Error', 'Please enter a food name');
      return;
    }

    try {
      await createFood(newFood);
      setShowAddForm(false);
      setNewFood({
        name: '',
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fats: 0,
        vitamins: 0,
        minerals: 0,
        serving_size: '',
      });
      Alert.alert('Success', 'Food item added successfully');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to add food');
    }
  };

  const handleEditFood = async () => {
    if (!editingFood) return;

    try {
      await updateFood(editingFood.id, editingFood);
      setEditingFood(null);
      Alert.alert('Success', 'Food item updated successfully');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to update food');
    }
  };

  const handlePickImage = async (foodId: number) => {
    try {
      setImageLoading(true);
      await pickAndUploadImage(foodId);
      Alert.alert('Success', 'Image uploaded successfully');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setImageLoading(false);
    }
  };

  const handleDeleteFood = async (foodId: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this food item?',
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
              await deleteFood(foodId);
              Alert.alert('Success', 'Food item deleted successfully');
            } catch (err) {
              Alert.alert('Error', err instanceof Error ? err.message : 'Failed to delete food');
            }
          },
        },
      ]
    );
  };

  const FoodForm = ({ 
    data, 
    onSubmit, 
    onCancel, 
    title, 
    submitText 
  }: { 
    data: CreateFoodData | Food;
    onSubmit: () => void;
    onCancel: () => void;
    title: string;
    submitText: string;
  }) => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>{title}</Text>

      {'id' in data && (
        <View style={styles.imageSection}>
          <FoodImage image_url={data.image_url} />
          <TouchableOpacity 
            style={[styles.imageButton, imageLoading && styles.buttonDisabled]}
            onPress={() => handlePickImage(data.id)}
            disabled={imageLoading}
          >
            <Camera size={24} color="#fff" />
            <Text style={styles.imageButtonText}>
              {imageLoading ? 'Uploading...' : 'Change Image'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      <TextInput
        style={styles.input}
        placeholder="Food Name"
        value={data.name}
        onChangeText={(text) => {
          if ('id' in data) {
            setEditingFood({ ...editingFood!, name: text });
          } else {
            setNewFood({ ...newFood, name: text });
          }
        }}
      />
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Serving Size</Text>
        <Text style={styles.inputInfo}>e.g., "1 cup" or "100g"</Text>
        <TextInput
          style={styles.input}
          placeholder="Serving Size"
          value={data.serving_size}
          onChangeText={(text) => {
            if ('id' in data) {
              setEditingFood({ ...editingFood!, serving_size: text });
            } else {
              setNewFood({ ...newFood, serving_size: text });
            }
          }}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Calories (kcal)</Text>
        <Text style={styles.inputInfo}>Energy content of the food</Text>
        <TextInput
          style={styles.input}
          placeholder="Calories"
          value={data.calories.toString()}
          onChangeText={(text) => {
            const value = parseFloat(text) || 0;
            if ('id' in data) {
              setEditingFood({ ...editingFood!, calories: value });
            } else {
              setNewFood({ ...newFood, calories: value });
            }
          }}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Protein (grams)</Text>
        <Text style={styles.inputInfo}>Essential for muscle building and repair</Text>
        <TextInput
          style={styles.input}
          placeholder="Protein"
          value={data.protein.toString()}
          onChangeText={(text) => {
            const value = parseFloat(text) || 0;
            if ('id' in data) {
              setEditingFood({ ...editingFood!, protein: value });
            } else {
              setNewFood({ ...newFood, protein: value });
            }
          }}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Carbohydrates (grams)</Text>
        <Text style={styles.inputInfo}>Main source of energy</Text>
        <TextInput
          style={styles.input}
          placeholder="Carbohydrates"
          value={data.carbohydrates.toString()}
          onChangeText={(text) => {
            const value = parseFloat(text) || 0;
            if ('id' in data) {
              setEditingFood({ ...editingFood!, carbohydrates: value });
            } else {
              setNewFood({ ...newFood, carbohydrates: value });
            }
          }}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Fats (grams)</Text>
        <Text style={styles.inputInfo}>Important for hormone production and nutrient absorption</Text>
        <TextInput
          style={styles.input}
          placeholder="Fats"
          value={data.fats.toString()}
          onChangeText={(text) => {
            const value = parseFloat(text) || 0;
            if ('id' in data) {
              setEditingFood({ ...editingFood!, fats: value });
            } else {
              setNewFood({ ...newFood, fats: value });
            }
          }}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Vitamins (milligrams)</Text>
        <Text style={styles.inputInfo}>Essential micronutrients for various body functions</Text>
        <TextInput
          style={styles.input}
          placeholder="Vitamins"
          value={data.vitamins.toString()}
          onChangeText={(text) => {
            const value = parseFloat(text) || 0;
            if ('id' in data) {
              setEditingFood({ ...editingFood!, vitamins: value });
            } else {
              setNewFood({ ...newFood, vitamins: value });
            }
          }}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Minerals (milligrams)</Text>
        <Text style={styles.inputInfo}>Essential for bone health and other body functions</Text>
        <TextInput
          style={styles.input}
          placeholder="Minerals"
          value={data.minerals.toString()}
          onChangeText={(text) => {
            const value = parseFloat(text) || 0;
            if ('id' in data) {
              setEditingFood({ ...editingFood!, minerals: value });
            } else {
              setNewFood({ ...newFood, minerals: value });
            }
          }}
          keyboardType="numeric"
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

  const FoodImage = ({ image_url }: { image_url?: string }) => {
    if (!image_url) {
      return (
        <View style={styles.placeholderImage}>
          <ImageIcon size={24} color="#666" />
        </View>
      );
    }

    return (
      <Image
        source={{ uri: image_url }}
        style={styles.foodImage}
        resizeMode="cover"
      />
    );
  };

  const NutritionInfo = ({ label, value, unit, info }: { label: string; value: number; unit: string; info: string }) => (
    <View style={styles.nutritionRow}>
      <View style={styles.nutritionLabelContainer}>
        <Text style={styles.nutritionLabel}>{label}</Text>
        <TouchableOpacity
          onPress={() => Alert.alert(label, info)}
          style={styles.infoButton}
        >
          <Info size={16} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <Text style={styles.nutritionValue}>
        {value} {unit}
      </Text>
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
        <Text style={styles.title}>Food Management</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddForm(true)}
        >
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {showAddForm ? (
        <FoodForm
          data={newFood}
          onSubmit={handleAddFood}
          onCancel={() => setShowAddForm(false)}
          title="Add New Food"
          submitText="Add Food"
        />
      ) : editingFood ? (
        <FoodForm
          data={editingFood}
          onSubmit={handleEditFood}
          onCancel={() => setEditingFood(null)}
          title="Edit Food"
          submitText="Update Food"
        />
      ) : (
        <>
          {foods.map((food) => (
            <View key={food.id} style={styles.foodItem}>
              <FoodImage image_url={food.image_url} />
              <View style={styles.foodContent}>
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <NutritionInfo 
                    label="Calories" 
                    value={food.calories} 
                    unit="kcal"
                    info="Energy content of the food"
                  />
                  <NutritionInfo 
                    label="Protein" 
                    value={food.protein} 
                    unit="g"
                    info="Essential for muscle building and repair"
                  />
                  <NutritionInfo 
                    label="Carbohydrates" 
                    value={food.carbohydrates} 
                    unit="g"
                    info="Main source of energy"
                  />
                  <NutritionInfo 
                    label="Fats" 
                    value={food.fats} 
                    unit="g"
                    info="Important for hormone production and nutrient absorption"
                  />
                  <NutritionInfo 
                    label="Vitamins" 
                    value={food.vitamins} 
                    unit="mg"
                    info="Essential micronutrients for various body functions"
                  />
                  <NutritionInfo 
                    label="Minerals" 
                    value={food.minerals} 
                    unit="mg"
                    info="Essential for bone health and other body functions"
                  />
                  <View style={styles.nutritionRow}>
                    <View style={styles.nutritionLabelContainer}>
                      <Text style={styles.nutritionLabel}>Serving Size</Text>
                    </View>
                    <Text style={styles.nutritionValue}>
                      {food.serving_size || 'Not specified'}
                    </Text>
                  </View>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => setEditingFood(food)}
                  >
                    <Edit2 size={24} color="#007AFF" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteFood(food.id)}
                  >
                    <Trash2 size={24} color="#FF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </>
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
  imageSection: {
    marginBottom: 20,
  },
  imageButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    gap: 8,
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.7,
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
  inputInfo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
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
  foodItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  foodContent: {
    flexDirection: 'row',
    marginTop: 10,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  nutritionLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#666',
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoButton: {
    padding: 4,
    marginLeft: 4,
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
  foodImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

