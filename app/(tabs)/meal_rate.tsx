import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Card, Title, Text } from "react-native-paper";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

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
      .get("http://localhost:3000/api/meal_rate")
      .then((response) => {
        setMealRates(response.data.mealRates);
      })
      .catch((error) => {
        console.error("Error fetching meal rates:", error);
      });
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchMealRates();
  }, []);

  // Render individual meal rate items with animations
  const renderMealRateItem = ({ item }: { item: MealRate }) => (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Icon
            name="account-circle"
            size={24}
            color="#6200EE"
            style={styles.icon}
          />
          <Title style={styles.cell}>{`User ID: ${item.user_id}`}</Title>
          <Text style={styles.rateText}>{`Meal Rate: ${Number(
            item.meal_rate
          ).toFixed(2)}`}</Text>
        </Card.Content>
      </Card>
    </Animated.View>
  );

  return (
    <Animated.View entering={FadeIn} style={styles.container}>
      <Title style={styles.title}>Meal Rates</Title>

      {/* Meal Rates List */}
      <FlatList
        data={mealRates}
        renderItem={renderMealRateItem}
        keyExtractor={(item: MealRate) => item.user_id.toString()}
        ListHeaderComponent={
          <Card style={styles.headerCard}>
            <Card.Content style={styles.row}>
              <Text style={styles.headerCell}>User ID</Text>
              <Text style={styles.headerCell}>Meal Rate</Text>
            </Card.Content>
          </Card>
        }
      />
    </Animated.View>
  );
};

// Styles defined using StyleSheet.create
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E3F2FD", // Light Blue background
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6200EE", // Indigo color
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    marginVertical: 10,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: "#FFFFFF",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  cell: {
    flex: 1,
    fontSize: 18,
    color: "#424242",
  },
  rateText: {
    fontSize: 16,
    color: "#757575",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerCell: {
    flex: 1,
    paddingHorizontal: 5,
    fontWeight: "bold",
    color: "#6200EE",
  },
  headerCard: {
    backgroundColor: "#BBDEFB", // Light Blue header
    borderRadius: 8,
  },
});

export default MealRateScreen;
