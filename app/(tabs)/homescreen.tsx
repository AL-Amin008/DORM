
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Card,
  Text,
  Button,
  Divider,
  Title,
  Subheading,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const HomeScreen = () => {
  const [expanded, setExpanded] = useState(false);
  const personalInfo = {
    balance: -3000,
    totalDeposit: 0,
    totalMeal: 0,
    totalMealCost: 0,
    mealRate: 0,
    otherIndividualCost: 3000,
    otherSharedCost: 0,
  };

  const meals = [
    {
      id: 1,
      name: "Breakfast",
      description: "Luchi, Alur Dum, and Mishti",
      image:
        "https://img.freepik.com/free-photo/top-view-composition-tasty-breakfast-goodies_23-2148829547.jpg?t=st=1727460294~exp=1727463894~hmac=e5845e19d59bb74d5ef2a25d0ec26f9b80ec4b5cf8b633f00f2d348dae1fc615&w=1380",
    },
    {
      id: 2,
      name: "Lunch",
      description: "Rice, Fish Curry, and Dal",
      image:
        "https://img.freepik.com/free-photo/gourmet-biryani-with-saffron-rice-chicken-generated-by-ai_188544-39093.jpg?t=st=1727460759~exp=1727464359~hmac=4fe0e083c0ab6020f7c888e8bf85d0249bde4226ea5c2e231029b403a422f0bc&w=1380",
    },
    {
      id: 3,
      name: "Dinner",
      description: "Roti, Paneer, and Sabzi",
      image:
        "https://img.freepik.com/free-photo/thanksgiving-country-dinner-background_1409-5501.jpg?t=st=1727460837~exp=1727464437~hmac=87445412acb3ac234eed2ef52d3555782a87a3ec2dd53ebb8260564e472b85e4&w=1380",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <Card style={styles.mealCard} onPress={() => setExpanded(!expanded)}>
          <Card.Content style={styles.cardContent}>
            <Text variant="titleLarge" style={{fontWeight:'bold',marginVertical:5}}>Meals</Text>
            <Text style={styles.cardSubtitle}>Tap to view meals</Text>
            <Button
              mode="contained"
              onPress={() => setExpanded(!expanded)}
              style={styles.button}
            >
              {expanded ? "Show Less" : "Show All"}
            </Button>
          </Card.Content>
        </Card>

        {expanded && (
          <View style={styles.cardRow}>
            {meals.map((meal) => (
              <Card key={meal.id} style={styles.expandedCard}>
                <Card.Cover
                  source={{ uri: meal.image }}
                  style={styles.cardImage}
                />
                <Card.Title
                  title={meal.name}
                  titleStyle={styles.cardTitle}
                  left={(props) => (
                    <MaterialCommunityIcons
                      {...props}
                      name="food"
                      size={30}
                      color="#FFF"
                    />
                  )}
                  style={styles.cardTitleContainer}
                />
                <Card.Content>
                  <Text style={styles.cardDescription}>{meal.description}</Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Sweet Home, July 2023</Title>
          <Divider style={styles.divider} />
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="scale-balance"
              size={24}
              color="#6200EE"
            />
            <Text> Mess Balance: {personalInfo.balance.toFixed(2)} tk</Text>
          </View>
          <View style={styles.row}>
            <MaterialCommunityIcons name="cash" size={24} color="#6200EE" />
            <Text>
              Total Deposit: {personalInfo.totalDeposit.toFixed(2)} tk
            </Text>
          </View>
          <View style={styles.row}>
            <MaterialCommunityIcons name="food" size={24} color="#6200EE" />
            <Text> Mess Total Meal: {personalInfo.totalMeal.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="food-fork-drink"
              size={24}
              color="#6200EE"
            />
            <Text>
              Mess Total Meal Cost: {personalInfo.totalMealCost.toFixed(2)} tk
            </Text>
          </View>
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="currency-usd"
              size={24}
              color="#6200EE"
            />
            <Text> Mess Meal Rate: {personalInfo.mealRate.toFixed(2)} tk</Text>
          </View>
          <View style={styles.row}>
            <MaterialCommunityIcons name="wallet" size={24} color="#6200EE" />
            <Text>
              Total Individual Other Cost:
              {personalInfo.otherIndividualCost.toFixed(2)} tk
            </Text>
          </View>
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="account-group"
              size={24}
              color="#6200EE"
            />
            <Text>
              Total Shared Other Cost: {personalInfo.otherSharedCost.toFixed(2)}
              tk
            </Text>
          </View>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content>
          <Subheading style={styles.sectionTitle}>Personal Info</Subheading>
          <Divider style={styles.divider} />
          <View style={styles.infoGrid}>
            <Card style={styles.infoCard}>
              <Card.Content style={styles.infoContent}>
                <MaterialCommunityIcons name="food" size={24} color="#6200EE" />
                <Text style={styles.infoText}>0.00</Text>
                <Text style={styles.infoLabel}>My Meal</Text>
              </Card.Content>
            </Card>

            <Card style={styles.infoCard}>
              <Card.Content style={styles.infoContent}>
                <MaterialCommunityIcons name="cash" size={24} color="#6200EE" />
                <Text style={styles.infoText}>0.00 tk</Text>
                <Text style={styles.infoLabel}>My Deposit</Text>
              </Card.Content>
            </Card>

            <Card style={styles.infoCard}>
              <Card.Content style={styles.infoContent}>
                <MaterialCommunityIcons
                  name="currency-usd"
                  size={24}
                  color="#6200EE"
                />
                <Text style={styles.infoText}>3000.00 tk</Text>
                <Text style={styles.infoLabel}>My Cost</Text>
              </Card.Content>
            </Card>

            <Card style={styles.infoCard}>
              <Card.Content style={styles.infoContent}>
                <MaterialCommunityIcons
                  name="scale-balance"
                  size={24}
                  color="#6200EE"
                />
                <Text style={styles.infoText}>-3000.00 tk</Text>
                <Text style={styles.infoLabel}>Balance</Text>
              </Card.Content>
            </Card>
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        style={styles.membershipButton}
        labelStyle={styles.buttonText}
      >
        Get Free Membership
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  card: {
    marginVertical: 10,
    borderRadius: 12,
    elevation: 4,
    shadowOpacity: 0.25,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  divider: {
    marginVertical: 10,
  },
  personalInfoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  infoBox: {
    alignItems: "center",
  },
  membershipButton: {
    marginTop: 20,
    borderRadius: 8,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  infoCard: {
    width: "45%",
    marginVertical: 10,
    borderRadius: 12,
    elevation: 3, 
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  infoContent: {
    alignItems: "center",
  },
  infoText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6200EE",
    marginTop: 5,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  mealCard: {
    marginBottom: 16,
    padding: 16,
    marginVertical: 10,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    backgroundColor: "#FFF",
  },
  cardContent: {
    alignItems: "center",
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 16,
    color: "#4A4A4A", 
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#6200EE",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  cardTitleContainer: {
    backgroundColor: "#6200EE",
    padding: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  cardDescription: {
    fontSize: 16,
    color: "#333",
    marginTop: 12,
    marginBottom: 12,
    lineHeight: 22,
  },
  cardImage: {
    height: 150,
    width: "100%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
  },
  cardRow: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 10,
  },
  expandedCard: {
    width: "100%",
    borderRadius: 15,
    marginVertical: 10,
  },
});

export default HomeScreen;
