import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Card,
  Text,
  Button,
  Divider,
  Title,
  Subheading,
} from "react-native-paper";

// Define the Meal interface
interface Meal {
  id: number;
  name: string;
  description: string;
  image: string;
}

// Define the PersonalInfo interface
interface PersonalInfo {
  balance: number;
  totalDeposit: number;
  totalMeal: number;
  totalMealCost: number;
  mealRate: number;
  otherIndividualCost: number;
  otherSharedCost: number;
}

// API base URL
const API_BASE_URL = "http://localhost:3000/api";

// API function to get personal information
const getPersonalInfo = async (): Promise<PersonalInfo> => {
  const response = await fetch(`${API_BASE_URL}/personal_info/1`);
  if (!response.ok) {
    throw new Error("Failed to fetch personal info");
  }
  const data = await response.json();
  return data.personalInfo; // Access the personalInfo from the response
};

// API function to get meals
const getMeals = async (): Promise<Meal[]> => {
  const response = await fetch(`${API_BASE_URL}/meals`);
  if (!response.ok) {
    throw new Error("Failed to fetch meals");
  }
  const data = await response.json();
  return data.meals; // Access the meals from the response
};

const HomeScreen: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const infoData = await getPersonalInfo();
        const mealsData = await getMeals();
        setPersonalInfo(infoData);
        setMeals(mealsData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.personalInfoContainer}>
        <Title style={styles.title}>Personal Information</Title>
        {personalInfo ? (
          <>
            <Subheading>Balance: ${personalInfo.balance}</Subheading>
            <Subheading>Total Deposit: ${personalInfo.totalDeposit}</Subheading>
            <Subheading>Total Meals: {personalInfo.totalMeal}</Subheading>
            <Subheading>Total Meal Cost: ${personalInfo.totalMealCost}</Subheading>
          </>
        ) : (
          <Text>Loading personal information...</Text>
        )}
      </View>

      <Divider style={styles.divider} />

      <Title style={styles.title}>Available Meals</Title>
      {meals.length > 0 ? (
        meals.map((meal) => (
          <Card key={meal.id} style={styles.card}>
            <Card.Cover source={{ uri: meal.image }} />
            <Card.Content>
              <Title>{meal.name}</Title>
              <Text>{meal.description}</Text>
            </Card.Content>
            <Card.Actions>
              <Button
                icon="cart"
                mode="contained"
                onPress={() => console.log(`Ordering ${meal.name}`)}
              >
                Order
              </Button>
            </Card.Actions>
          </Card>
        ))
      ) : (
        <Text>No meals available</Text>
      )}
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  title: {
    marginBottom: 12,
    color: "#343a40",
  },
  personalInfoContainer: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  divider: {
    marginVertical: 16,
    backgroundColor: "#343a40",
  },
});

export default HomeScreen;
