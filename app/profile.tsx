import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { updateProfile } from '../api/auth';
import { UserProfile } from '../types/auth';

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserProfile>({
    name: '',
    phone: '',
    age: undefined,
    weight: undefined,
    height: undefined,
  });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const updatedData: UserProfile = {
        ...userData,
        age: userData.age ? parseInt(String(userData.age)) : undefined,
        weight: userData.weight ? parseFloat(String(userData.weight)) : undefined,
        height: userData.height ? parseFloat(String(userData.height)) : undefined,
      };
      await updateProfile(updatedData);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Update Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={userData.name}
        onChangeText={(text) => setUserData({ ...userData, name: text })}
        testID="name-input"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={userData.phone}
        onChangeText={(text) => setUserData({ ...userData, phone: text })}
        keyboardType="phone-pad"
        testID="phone-input"
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={userData.age?.toString()}
        onChangeText={(text) => setUserData({ ...userData, age: text ? parseInt(text) : undefined })}
        keyboardType="numeric"
        testID="age-input"
      />
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        value={userData.weight?.toString()}
        onChangeText={(text) => setUserData({ ...userData, weight: text ? parseFloat(text) : undefined })}
        keyboardType="numeric"
        testID="weight-input"
      />
      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        value={userData.height?.toString()}
        onChangeText={(text) => setUserData({ ...userData, height: text ? parseFloat(text) : undefined })}
        keyboardType="numeric"
        testID="height-input"
      />
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleUpdate}
        disabled={loading}
        testID="update-button"
      >
        <Text style={styles.buttonText}>
          {loading ? 'Updating...' : 'Update Profile'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

