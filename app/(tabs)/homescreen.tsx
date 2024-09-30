import React, { useState, useEffect } from 'react';
import axios from 'axios';


interface Meal {
  id: number;
  meal_name: string;
  description: string;
  meal_time: string;
  meal_date: string;
  created_at: string;
  updated_at: string;
}

const Meals: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null); 

  
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/meals');
        setMeals(response.data.meals);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch meals');
        setLoading(false);
      }
    };

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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Meals;
