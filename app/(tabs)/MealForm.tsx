import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Meal {
  id?: number;
  meal_name: string;
  description: string;
  meal_time: 'Morning' | 'Noon' | 'Night'; 
  meal_date: string;
}

interface Props {
  mealId?: number; 
  onSuccess: () => void; 
}

const MealForm: React.FC<Props> = ({ mealId, onSuccess }) => {
  const [mealData, setMealData] = useState<Meal>({
    meal_name: '',
    description: '',
    meal_time: 'Morning', 
    meal_date: '',
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);

 
  useEffect(() => {
    if (mealId) {
      setIsEditing(true);
      axios
        .get(`http://localhost:3000/api/meals/${mealId}`)
        .then((response) => {
          const meal = response.data.meal;
          
          setMealData({
            meal_name: meal.meal_name,
            description: meal.description,
            meal_time: meal.meal_time, 
            meal_date: meal.meal_date, 
          });
        })
        .catch((error) => {
          console.error('Error fetching meal:', error);
        });
    }
  }, [mealId]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMealData((prevMeal) => ({
      ...prevMeal,
      [name]: value,
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
  
      axios
        .put(`http://localhost:3000/api/meals/${mealId}`, mealData)
        .then(() => {
          alert('Meal updated successfully');
          onSuccess(); 
        })
        .catch((error) => {
          console.error('Error updating meal:', error);
        });
    } else {
      
      axios
        .post('http://localhost:3000/api/meals', mealData)
        .then(() => {
          alert('Meal added successfully');
          onSuccess(); 
          setMealData({ meal_name: '', description: '', meal_time: 'Morning', meal_date: '' }); 
        })
        .catch((error) => {
          console.error('Error adding meal:', error);
        });
    }
  };

  return (
    <div>
      <h2>{isEditing ? 'Edit Meal' : 'Add New Meal'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Meal Name:</label>
          <input
            type="text"
            name="meal_name"
            value={mealData.meal_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={mealData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Meal Time:</label>
          <select
            name="meal_time"
            value={mealData.meal_time}
            onChange={handleInputChange}
            required
          >
            <option value="Morning">Morning</option>
            <option value="Noon">Noon</option>
            <option value="Night">Night</option>
          </select>
        </div>
        <div>
          <label>Meal Date:</label>
          <input
            type="date"
            name="meal_date"
            value={mealData.meal_date}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">{isEditing ? 'Update Meal' : 'Add Meal'}</button>
      </form>
    </div>
  );
};

export default MealForm;
