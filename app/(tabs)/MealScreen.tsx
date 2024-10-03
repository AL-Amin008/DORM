import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Platform, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

let PickerComponent: any;
if (Platform.OS === 'ios' || Platform.OS === 'android') {
  PickerComponent = require('@react-native-picker/picker').Picker;
} else {
  PickerComponent = ({ children, ...props }: any) => (
    <select {...props}>
      {children}
    </select>
  );
}

interface Meal {
  id: number;
  user_id: number;
  meal_time: 'morning' | 'noon' | 'night';
  meal_date: string;  // Still used in Meal interface
  meal_number: number;
  entry_at: string;
  user_name?: string;
}

const MealScreen = () => {
  const [mealTime, setMealTime] = useState<'morning' | 'noon' | 'night'>('morning');
  const [mealDate, setMealDate] = useState(new Date().toISOString().split('T')[0]); // Set today's date
  const [mealNumber, setMealNumber] = useState(1);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('user_id')
      .then((storedUserId) => {
        if (storedUserId) {
          setUserId(Number(storedUserId));
        } else {
          Alert.alert('Error', 'User not logged in');
        }
      })
      .catch(() => {
        Alert.alert('Error', 'Failed to fetch user ID');
      });
  }, []);

  useEffect(() => {
    if (!userId) return;

    axios.get('http://localhost:3000/api/meal')
      .then((response) => {
        console.log('Fetched meals:', response.data); // Debug API response
        const fetchedMeals = response.data.meals || [];
        setMeals(fetchedMeals);
      })
      .catch((error) => {
        console.error('Error fetching meals:', error);
        Alert.alert('Error', 'Failed to fetch meals.');
      });
  }, [userId]);

  const sortedMeals = meals
    .sort((a, b) => new Date(b.entry_at).getTime() - new Date(a.entry_at).getTime())
    .reduce((acc: any, meal: Meal) => {
      const dateKey = `${new Date(meal.entry_at).toLocaleDateString()}-${meal.meal_time}`;
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(meal);
      return acc;
    }, {});

  const handleMealSubmit = () => {
    if (!userId) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    const mealData = {
      user_id: userId,
      meal_time: mealTime,
      meal_date: mealDate,  // This will now contain today's date
      meal_number: mealNumber,
    };

    axios.post('http://localhost:3000/api/meal', mealData)
      .then(() => {
        Alert.alert('Success', 'Meal added successfully.');
        setMealNumber(1);
        setMealTime('morning');
      })
      .catch((error) => {
        console.error('Error adding meal:', error);
        Alert.alert('Error', 'Failed to add meal.');
      });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Meal Entry</Text>
      <Text style={styles.inputLabel}>Meal Time:</Text>
      <PickerComponent selectedValue={mealTime} onChange={(e: any) => setMealTime(e.target.value)}>
        <option value="morning">Morning</option>
        <option value="noon">Noon</option>
        <option value="night">Night</option>
      </PickerComponent>

      <Text style={styles.inputLabel}>Meal Date:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Date"
        value={mealDate}
        editable={false} // Optional: Prevent manual editing
      />

      <Text style={styles.inputLabel}>Meal Number:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Meal Number"
        value={mealNumber.toString()}
        onChangeText={(text) => setMealNumber(Number(text))}
        keyboardType="numeric"
      />

      <Button title="Submit" onPress={handleMealSubmit} />

      <Text style={styles.title}>Meal Records</Text>
      {Object.keys(sortedMeals).length > 0 ? (
        Object.keys(sortedMeals).map((key) => (
          <View key={key} style={styles.mealCard}>
            <Text style={styles.mealTitle}>Date: {key}</Text>
            {sortedMeals[key].map((meal: Meal) => (
              <View key={meal.id} style={styles.mealItem}>
                <Text>User: {meal.user_name || 'Unknown'}</Text>
                <Text>Meal Time: {meal.meal_time}</Text>
                <Text>Meal Number: {meal.meal_number}</Text>
                <Text>Meal Date: {meal.meal_date}</Text>
                <Text>Entry At: {new Date(meal.entry_at).toLocaleString()}</Text>
              </View>
            ))}
          </View>
        ))
      ) : (
        <Text>No meals found.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  mealCard: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mealItem: {
    paddingVertical: 5,
  },
});

export default MealScreen;
