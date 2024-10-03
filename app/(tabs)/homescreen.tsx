import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import MealForm from './MealForm'; // Import the MealForm component

// Define a TypeScript interface for the meal data
interface Meal {
  id: number;
  meal_name: string;
  description: string;
  meal_time: string;
  meal_date: string;
  created_at: string; // Assuming there's a created_at field to track when the meal was added
}

const Meals: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]); // State to store meal data
  const [loading, setLoading] = useState<boolean>(true); // State for loading status
  const [error, setError] = useState<string | null>(null); // State for error message
  const [editingMealId, setEditingMealId] = useState<number | null>(null); // State to track editing meal

  // Fetch meals from the API
  const fetchMeals = () => {
    setLoading(true);
    axios
      .get('http://192.168.0.106:3000/api/meals')
      .then((response) => {
        const sortedMeals = response.data.meals.sort((a: Meal, b: Meal) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        setMeals(sortedMeals);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch meals');
        setLoading(false);
      });
  };

  // Refresh the meal list after adding/editing
  useEffect(() => {
    fetchMeals();
  }, []);

  if (loading) {
    return <Text style={styles.loading}>Loading meals...</Text>;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meal List</Text>
      <View style={styles.formContainer}>
        <MealForm onSuccess={fetchMeals} mealId={editingMealId || undefined} />
      </View>

      {meals.length === 0 ? (
        <Text style={styles.noMeals}>No meals found.</Text>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.mealCard}>
              <Text style={styles.cardTitle}>{item.meal_name}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
              <Text style={styles.cardSubtitle}>Time: {item.meal_time}</Text>
              <Text style={styles.cardSubtitle}>Date: {item.meal_date}</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setEditingMealId(item.id)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#e0f7fa', // Light blue gradient background
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#00796b', // Teal color for a refreshing look
  },
  loading: {
    textAlign: 'center',
    fontSize: 18,
    color: '#00796b',
  },
  error: {
    textAlign: 'center',
    fontSize: 18,
    color: '#d32f2f', // Red for errors
  },
  noMeals: {
    textAlign: 'center',
    fontSize: 18,
    color: '#00796b',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 5, // Shadow effect for elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 0.5,
    borderColor: '#00796b', // Teal border color
    marginHorizontal: 16,
    paddingHorizontal: 24,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00796b',
    marginBottom: 12,
    textAlign: 'center',
  },
  inputField: {
    backgroundColor: '#f5f5f5',
    borderColor: '#00796b',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#00796b',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 16,
  },
  mealCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    backgroundColor: '#ffffff', // Card background color
    borderLeftWidth: 5,
    borderLeftColor: '#00796b', // Border color to indicate section separation
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00796b', // Teal color for meal name
  },
  cardDescription: {
    fontSize: 16,
    color: '#4a4a4a', // Slightly darker color for the description
    marginVertical: 10,
    lineHeight: 24,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#00796b', // Teal color for meal time and date
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: '#00796b',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  editButtonText: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: 16,
  },
});

export default Meals;
