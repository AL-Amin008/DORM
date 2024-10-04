import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import axios from 'axios';
import { PieChart } from 'react-native-chart-kit';

// Define the OverallCalculation interface with required columns
interface OverallCalculation {
  user_id: number;
  total_send: number;
  total_meal_amount: number;
  total_deposit: number;
  total_cost: number;
  due_or_give: number; // Assuming this is a number now
}

const OverallCalculationScreen: React.FC = () => {
  const [overallCalculations, setOverallCalculations] = useState<OverallCalculation[]>([]);
  const [overallCalculation, setOverallCalculation] = useState<number>(0);
  const [dueData, setDueData] = useState<{ name: string; amount: number }[]>([]);
  const [giveData, setGiveData] = useState<{ name: string; amount: number }[]>([]);
  const [hoverData, setHoverData] = useState<{ name: string; amount: number } | null>(null); // State for hover data

  // Fetch overall calculation data from the API
  const fetchOverallCalculations = () => {
    axios
      .get('http://10.10.200.128:3000/api/overall_calculation') // Update your API URL here
      .then((response) => {
        console.log('API Response:', response.data); // Log the full response
        const calculations = response.data.overallCalculations;
        setOverallCalculations(calculations);
        calculateOverallCalculation(calculations);
        prepareChartData(calculations);
      })
      .catch((error) => {
        console.error('Error fetching overall calculations:', error);
      });
  };

  // Calculate overall calculation
  const calculateOverallCalculation = (calculations: OverallCalculation[]) => {
    const totalSend = calculations.reduce((sum, calculation) => sum + (Number(calculation.total_send) || 0), 0);
    const totalMealAmount = calculations.reduce((sum, calculation) => sum + (Number(calculation.total_meal_amount) || 0), 0);
    const calculation = totalMealAmount > 0 ? totalSend / totalMealAmount : 0; // Avoid division by zero
    setOverallCalculation(calculation);
  };

  // Prepare data for pie charts
  const prepareChartData = (calculations: OverallCalculation[]) => {
    const dueAmounts = calculations.map(calculation => ({
      name: `User ${calculation.user_id}`,
      amount: Number(calculation.total_deposit) || 0, // Ensure numeric
    }));
    const giveAmounts = calculations.map(calculation => ({
      name: `User ${calculation.user_id}`,
      amount: Number(calculation.total_send) || 0, // Ensure numeric
    }));

    setDueData(dueAmounts);
    setGiveData(giveAmounts);
  };

  useEffect(() => {
    fetchOverallCalculations();
  }, []);

  const renderOverallCalculationItem = ({ item }: { item: OverallCalculation }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.user_id}</Text>
      <Text style={styles.cell}>{Number(item.total_send || 0).toFixed(2)}</Text>
      <Text style={styles.cell}>{Number(item.total_meal_amount || 0).toFixed(2)}</Text>
      <Text style={styles.cell}>{Number(item.total_deposit || 0).toFixed(2)}</Text>
      <Text style={styles.cell}>{Number(item.total_cost || 0).toFixed(2)}</Text>
      <Text style={styles.cell}>{Number(item.due_or_give || 0).toFixed(2)}</Text>
    </View>
  );

  // Define colors for the pie charts
  const dueChartColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']; // Colors for due amounts
  const giveChartColors = ['#FF9F40', '#4BC0C0', '#FF6384', '#36A2EB', '#FFCE56']; // Colors for give amounts

  // Function to handle chart press
  const handleChartPress = (data: { index: number; chartData: any[] }, chartType: 'due' | 'give') => {
    if (data) {
      const selectedData = chartType === 'due' ? dueData[data.index] : giveData[data.index];
      setHoverData(selectedData);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Overall Calculations</Text>
      <Text style={styles.overallCalculationText}>Calculated Overall Calculation: {overallCalculation.toFixed(2)}</Text>

      {/* Hover Data Display */}
      {hoverData && (
        <View style={styles.hoverContainer}>
          <Text style={styles.hoverText}>Name: {hoverData.name}</Text>
          <Text style={styles.hoverText}>Amount: {hoverData.amount.toFixed(2)}</Text>
        </View>
      )}

      {/* Pie Charts for Due and Give Amounts in Columns */}
      <View style={styles.chartContainer}>
        <View style={styles.chartColumn}>
          <Text style={styles.chartTitle}>Due Amounts by User</Text>
          <TouchableWithoutFeedback
            onPress={(e) => {
              const { locationX } = e.nativeEvent;
              const index = Math.floor((locationX / (Dimensions.get('window').width / 2.2)) * dueData.length);
              if (index < dueData.length) {
                handleChartPress({ index, chartData: dueData }, 'due');
              }
            }}
          >
            <PieChart
              data={dueData.map((item, index) => ({
                ...item,
                color: dueChartColors[index % dueChartColors.length], // Use colors in rotation
              }))}
              width={Dimensions.get('window').width / 2.2} // Responsive width
              height={150} // Set height for pie chart
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Default color
                style: {
                  borderRadius: 16,
                },
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[10, 0]}
            />
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.chartColumn}>
          <Text style={styles.chartTitle}>Give Amounts by User</Text>
          <TouchableWithoutFeedback
            onPress={(e) => {
              const { locationX } = e.nativeEvent;
              const index = Math.floor((locationX / (Dimensions.get('window').width / 2.2)) * giveData.length);
              if (index < giveData.length) {
                handleChartPress({ index, chartData: giveData }, 'give');
              }
            }}
          >
            <PieChart
              data={giveData.map((item, index) => ({
                ...item,
                color: giveChartColors[index % giveChartColors.length], // Use colors in rotation
              }))}
              width={Dimensions.get('window').width / 2.2} // Responsive width
              height={150} // Set height for pie chart
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Default color
                style: {
                  borderRadius: 16,
                },
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[10, 0]}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>

      {/* Overall Calculations Table */}
      <Text style={styles.tableTitle}>Overall Calculations Table</Text>
      <View style={styles.row}>
        <Text style={styles.headerCell}>User ID</Text>
        <Text style={styles.headerCell}>Total Send</Text>
        <Text style={styles.headerCell}>Total Meal Amount</Text>
        <Text style={styles.headerCell}>Total Deposit</Text>
        <Text style={styles.headerCell}>Total Cost</Text>
        <Text style={styles.headerCell}>Due/Give</Text>
      </View>
      <FlatList
        data={overallCalculations}
        renderItem={renderOverallCalculationItem}
        keyExtractor={(item) => item.user_id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }} // Add some padding at the bottom
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  overallCalculationText: {
    fontSize: 18,
    marginBottom: 20,
  },
  hoverContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  hoverText: {
    fontSize: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  chartColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OverallCalculationScreen;
