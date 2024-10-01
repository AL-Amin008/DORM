import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import MealForm from './MealForm'; // Import the MealForm component

// Define a TypeScript interface for the meal data
interface Meal {
  id: number;
  meal_name: string;
  description: string;
  meal_time: string;
  meal_date: string;
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
      .get('http://localhost:3000/api/meals')
      .then((response) => {
        setMeals(response.data.meals);
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

// Styles defined using StyleSheet.create
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  loading: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
  },
  error: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
  },
  noMeals: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  mealCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    backgroundColor: '#FFF',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  cardDescription: {
    fontSize: 16,
    color: '#333',
    marginTop: 12,
    marginBottom: 12,
    lineHeight: 22,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#4A4A4A',
  },
  editButton: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '500',
  },
});

export default Meals;
