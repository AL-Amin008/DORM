import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

// Define the MealRate interface
interface MealRate {
  user_id: number;
  meal_rate: number;
}

const MealRateScreen: React.FC = () => {
  const [mealRates, setMealRates] = useState<MealRate[]>([]);

  // Fetch meal rate data from the API
  const fetchMealRates = () => {
    axios
      .get('http://localhost:3000/api/meal_rate')
      .then((response) => {
        setMealRates(response.data.mealRates);
      })
      .catch((error) => {
        console.error('Error fetching meal rates:', error);
      });
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchMealRates();
  }, []);

  // Render individual meal rate items
  const renderMealRateItem = ({ item }: { item: MealRate }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.user_id}</Text>
      <Text style={styles.cell}>{Number(item.meal_rate).toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meal Rates</Text>

      {/* Meal Rates List */}
      <FlatList
        data={mealRates}
        renderItem={renderMealRateItem}
        keyExtractor={(item) => item.user_id.toString()}
        ListHeaderComponent={
          <View style={styles.row}>
            <Text style={styles.headerCell}>User ID</Text>
            <Text style={styles.headerCell}>Meal Rate</Text>
          </View>
        }
      />
    </View>
  );
};

// Styles defined using StyleSheet.create
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    paddingHorizontal: 5,
    textAlign: 'center',
  },
  headerCell: {
    flex: 1,
    paddingHorizontal: 5,
    fontWeight: 'bold',
  },
});

export default MealRateScreen;
