import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MealForm from './MealForm';
 // Import the MealForm component

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
    return <p>Loading meals...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Meal List</h1>
      <MealForm onSuccess={fetchMeals} mealId={editingMealId || undefined} />

      {meals.length === 0 ? (
        <p>No meals found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Meal Name</th>
              <th>Description</th>
              <th>Meal Time</th>
              <th>Meal Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((meal) => (
              <tr key={meal.id}>
                <td>{meal.id}</td>
                <td>{meal.meal_name}</td>
                <td>{meal.description}</td>
                <td>{meal.meal_time}</td>
                <td>{meal.meal_date}</td>
                <td>
                  <button onClick={() => setEditingMealId(meal.id)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Meals;
