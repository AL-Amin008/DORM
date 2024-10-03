import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Meal {
  id: number;
  meal_time: string;
  meal_date: string;
  meal_number: number;
}

const MealScreen = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealTime, setMealTime] = useState<string>('');
  const [mealDate, setMealDate] = useState<string>('');
  const [mealNumber, setMealNumber] = useState<number | string>('');
  const [error, setError] = useState<string | null>(null);

  // Fetch meals for the logged-in user
  const getMeals = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    if (!userId) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/api/meals/meal/${userId}`);
      if (response.status === 200) {
        setMeals(response.data.meals);
      } else {
        setError('Failed to fetch meals');
      }
    } catch (err) {
      setError('Failed to fetch meals');
    }
  };

  useEffect(() => {
    getMeals(); // Fetch meals on component mount
  }, []);

  // Add new meal
  const addMeal = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    if (!userId) {
      setError('User not logged in');
      return;
    }

    if (!mealTime || !mealDate || !mealNumber) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/meal', {
        meal_time: mealTime,
        meal_date: mealDate,
        meal_number: mealNumber,
        user_id: userId,  // Pass user_id from AsyncStorage
      });

      if (response.status === 201) {
        setMeals([...meals, response.data]); // Add meal to the state
        setMealTime('');
        setMealDate('');
        setMealNumber('');
        setError(null);
      }
    } catch (err) {
      setError('Failed to add meal');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meal Entry</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Meal Time (HH:MM)"
        value={mealTime}
        onChangeText={setMealTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Meal Date (YYYY-MM-DD)"
        value={mealDate}
        onChangeText={setMealDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Meal Number"
        value={mealNumber.toString()}
        keyboardType="numeric"
        onChangeText={(text) => setMealNumber(text)}
      />
      <Button title="Add Meal" onPress={addMeal} />

      {/* List of Meals */}
      <FlatList
        data={meals}
        keyExtractor={(item) => (item.id ? item.id.toString() : 'key-' + Math.random())} // Fallback in case of undefined `id`
        renderItem={({ item }) => (
          <View style={styles.mealItem}>
            <Text>Meal Time: {item.meal_time}</Text>
            <Text>Meal Date: {item.meal_date}</Text>
            <Text>Meal Number: {item.meal_number}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  mealItem: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default MealScreen;
