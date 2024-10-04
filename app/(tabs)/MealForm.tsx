import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

// Define props interface
interface MealFormProps {
  onSuccess: () => void;
  mealId?: number;
}

const MealForm: React.FC<MealFormProps> = ({ onSuccess, mealId }) => {
  const [mealName, setMealName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [mealTime, setMealTime] = useState<string>('');
  const [mealDate, setMealDate] = useState<string>('');

  useEffect(() => {
    if (mealId) {
      // Fetch existing meal data if editing
      axios.get(`http://10.10.200.128:3000/api/meals/${mealId}`) // Adjust the URL as needed
        .then(response => {
          const meal = response.data;
          setMealName(meal.meal_name);
          setDescription(meal.description);
          setMealTime(meal.meal_time);
          setMealDate(meal.meal_date);
        })
        .catch(err => {
          console.error('Failed to fetch meal data:', err);
        });
    } else {
      // Reset form for new meal
      setMealName('');
      setDescription('');
      setMealTime('');
      setMealDate('');
    }
  }, [mealId]);

  const handleSubmit = () => {
    const mealData = { meal_name: mealName, description, meal_time: mealTime, meal_date: mealDate };
    
    const url = mealId 
      ? `http://10.10.200.128:3000/api/meals/${mealId}` // Update existing meal
      : 'http://10.10.200.128:3000/api/meals'; // Add new meal

    const method = mealId ? 'PUT' : 'POST';

    axios({ method, url, data: mealData })
      .then(() => {
        onSuccess(); // Refresh meal list
      })
      .catch(err => {
        console.error('Failed to save meal:', err);
      });
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>{mealId ? 'Edit Meal' : 'Add Meal'}</Text>
      <TextInput
        style={styles.inputField}
        placeholder="Meal Name"
        value={mealName}
        onChangeText={setMealName}
      />
      <TextInput
        style={styles.inputField}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.inputField}
        placeholder="Meal Time"
        value={mealTime}
        onChangeText={setMealTime}
      />
      <TextInput
        style={styles.inputField}
        placeholder="Meal Date"
        value={mealDate}
        onChangeText={setMealDate}
      />
      <Button title={mealId ? 'Update Meal' : 'Add Meal'} onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#00796b',
    borderRadius: 5,
    padding: 10,
    marginBottom: 12,
  },
});

export default MealForm;
