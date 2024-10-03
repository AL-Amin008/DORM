import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Updated import

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

  const handleInputChange = (name: keyof Meal, value: string) => {
    setMealData((prevMeal) => ({
      ...prevMeal,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (isEditing) {
      axios
        .put(`http://localhost:3000/api/meals/${mealId}`, mealData)
        .then(() => {
          Alert.alert('Meal updated successfully');
          onSuccess(); 
        })
        .catch((error) => {
          console.error('Error updating meal:', error);
        });
    } else {
      axios
        .post('http://localhost:3000/api/meals', mealData)
        .then(() => {
          Alert.alert('Meal added successfully');
          onSuccess(); 
          setMealData({ meal_name: '', description: '', meal_time: 'Morning', meal_date: '' }); 
        })
        .catch((error) => {
          console.error('Error adding meal:', error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isEditing ? 'Edit Meal' : 'Add New Meal'}</Text>
      <View>
        <Text>Meal Name:</Text>
        <TextInput
          style={styles.input}
          value={mealData.meal_name}
          onChangeText={(value) => handleInputChange('meal_name', value)}
        
        />
      </View>
      <View>
        <Text>Description:</Text>
        <TextInput
          style={styles.input}
          value={mealData.description}
          onChangeText={(value) => handleInputChange('description', value)}

        />
      </View>
      <View>
        <Text>Meal Time:</Text>
        <Picker
          selectedValue={mealData.meal_time}
          onValueChange={(value) => handleInputChange('meal_time', value)}
          style={styles.picker}
        >
          <Picker.Item label="Morning" value="Morning" />
          <Picker.Item label="Noon" value="Noon" />
          <Picker.Item label="Night" value="Night" />
        </Picker>
      </View>
      <View>
        <Text>Meal Date:</Text>
        <TextInput
          style={styles.input}
          value={mealData.meal_date}
          onChangeText={(value) => handleInputChange('meal_date', value)}
     
        />
      </View>
      <Button title={isEditing ? 'Update Meal' : 'Add Meal'} onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: 150,
    marginBottom: 20,
  },
});

export default MealForm;
