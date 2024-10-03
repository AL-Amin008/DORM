import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

interface MealFormProps {
  onSuccess: () => void; // Function to call on success
  mealId?: number; // Optional meal ID for editing
}

const MealForm: React.FC<MealFormProps> = ({ onSuccess, mealId }) => {
  const [mealName, setMealName] = useState('');
  const [description, setDescription] = useState('');
  const [mealTime, setMealTime] = useState('');
  const [mealDate, setMealDate] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch meal details if editing
  useEffect(() => {
    if (mealId) {
      axios.get(`http://192.168.0.106:3000/api/meals/${mealId}`)
        .then(response => {
          const meal = response.data.meal;
          setMealName(meal.meal_name);
          setDescription(meal.description);
          setMealTime(meal.meal_time);
          setMealDate(meal.meal_date);
        })
        .catch(err => {
          console.error('Failed to fetch meal details', err);
        });
    }
  }, [mealId]);

  const handleSubmit = () => {
    setLoading(true);
    const mealData = {
      meal_name: mealName,
      description,
      meal_time: mealTime,
      meal_date: mealDate,
    };

    const request = mealId
      ? axios.put(`http://192.168.0.106:3000/api/meals/${mealId}`, mealData)
      : axios.post('http://192.168.0.106:3000/api/meals', mealData);

    request
      .then(() => {
        onSuccess(); // Call onSuccess to refresh meal list
        setMealName('');
        setDescription('');
        setMealTime('');
        setMealDate('');
      })
      .catch(err => {
        console.error('Failed to save meal', err);
      })
      .finally(() => {
        setLoading(false);
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
      <Button title={loading ? 'Saving...' : 'Save Meal'} onPress={handleSubmit} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputField: {
    height: 40,
    borderColor: '#00796b',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default MealForm;
