import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ScrollView, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import { PieChart } from 'react-native-chart-kit';

interface OverallCalculation {
  user_id: number;
  total_spend: number;
  total_meal_amount: number;
  total_deposit: number;
  total_cost: number;
  due_or_give: number;
}

const OverallCalculationScreen: React.FC = () => {
  const [overallCalculations, setOverallCalculations] = useState<OverallCalculation[]>([]);
  const [overallCalculation, setOverallCalculation] = useState<number>(0);
  const [dueData, setDueData] = useState<{ name: string; amount: number; percentage: number }[]>([]);
  const [giveData, setGiveData] = useState<{ name: string; amount: number; percentage: number }[]>([]);
  const [hoverData, setHoverData] = useState<{ name: string; amount: number; percentage: number } | null>(null);

  const fetchOverallCalculations = () => {
    axios
      .get('http://localhost:3000/api/overall_calculation')
      .then((response) => {
        const calculations = response.data.overallCalculations;
        setOverallCalculations(calculations);
        calculateOverallCalculation(calculations);
        prepareChartData(calculations);
      })
      .catch((error) => {
        console.error('Error fetching overall calculations:', error);
      });
  };

  const calculateOverallCalculation = (calculations: OverallCalculation[]) => {
    const totalSpend = calculations.reduce((sum, calculation) => sum + (Number(calculation.total_spend) || 0), 0);
    const totalMealAmount = calculations.reduce((sum, calculation) => sum + (Number(calculation.total_meal_amount) || 0), 0);
    const calculation = totalMealAmount > 0 ? totalSpend / totalMealAmount : 0;
    setOverallCalculation(calculation);
  };

  const prepareChartData = (calculations: OverallCalculation[]) => {
    const dueAmounts = calculations.map(calculation => ({
      name: `User ${calculation.user_id}`,
      amount: Number(calculation.total_deposit) || 0,
    }));

    const giveAmounts = calculations.map(calculation => ({
      name: `User ${calculation.user_id}`,
      amount: Number(calculation.total_spend) || 0,
    }));

    const totalDue = dueAmounts.reduce((sum, data) => sum + data.amount, 0);
    const totalGive = giveAmounts.reduce((sum, data) => sum + data.amount, 0);

    const dueDataWithPercentage = dueAmounts.map(item => ({
      ...item,
      percentage: totalDue > 0 ? (item.amount / totalDue) * 100 : 0,
    }));

    const giveDataWithPercentage = giveAmounts.map(item => ({
      ...item,
      percentage: totalGive > 0 ? (item.amount / totalGive) * 100 : 0,
    }));

    setDueData(dueDataWithPercentage);
    setGiveData(giveDataWithPercentage);
  };

  useEffect(() => {
    fetchOverallCalculations();
  }, []);

  const renderOverallCalculationItem = ({ item }: { item: OverallCalculation }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.user_id}</Text>
      <Text style={styles.cell}>{Number(item.total_spend || 0).toFixed(2)}</Text>
      <Text style={styles.cell}>{Number(item.total_meal_amount || 0).toFixed(2)}</Text>
      <Text style={styles.cell}>{Number(item.total_deposit || 0).toFixed(2)}</Text>
      <Text style={styles.cell}>{Number(item.total_cost || 0).toFixed(2)}</Text>
      <Text style={styles.cell}>{Number(item.due_or_give || 0).toFixed(2)}</Text>
    </View>
  );

  const dueChartColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
  const giveChartColors = ['#FF9F40', '#4BC0C0', '#FF6384', '#36A2EB', '#FFCE56'];

  const handleChartPress = (index: number, chartType: 'due' | 'give') => {
    const selectedData = chartType === 'due' ? dueData[index] : giveData[index];
    if (selectedData) {
      setHoverData({
        name: selectedData.name,
        amount: selectedData.amount,
        percentage: selectedData.percentage,
      });
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
          <Text style={styles.hoverText}>Percentage: {hoverData.percentage.toFixed(2)}%</Text>
        </View>
      )}

      {/* Pie Charts for Due and Give Amounts in Columns */}
      <View style={styles.chartContainer}>
        <View style={styles.chartColumn}>
          <Text style={styles.chartTitle}>Due Amounts by User</Text>
          <TouchableWithoutFeedback
            onPress={(e) => {
              const { locationX } = e.nativeEvent;
              const chartWidth = Dimensions.get('window').width / 2.2; // Chart width
              const index = Math.floor((locationX / chartWidth) * dueData.length);
              if (index < dueData.length) {
                handleChartPress(index, 'due');
              }
            }}
          >
            <PieChart
              data={dueData.map((item, index) => ({
                ...item,
                color: dueChartColors[index % dueChartColors.length],
              }))}
              width={Dimensions.get('window').width / 2.2}
              height={150}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
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
              const chartWidth = Dimensions.get('window').width / 2.2; // Chart width
              const index = Math.floor((locationX / chartWidth) * giveData.length);
              if (index < giveData.length) {
                handleChartPress(index, 'give');
              }
            }}
          >
            <PieChart
              data={giveData.map((item, index) => ({
                ...item,
                color: giveChartColors[index % giveChartColors.length],
              }))}
              width={Dimensions.get('window').width / 2.2}
              height={150}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
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

      <Text style={styles.tableTitle}>Overall Calculations Table</Text>
      <View style={styles.row}>
        <Text style={styles.headerCell}>User ID</Text>
        <Text style={styles.headerCell}>Total Spend</Text>
        <Text style={styles.headerCell}>Total Meal Amount</Text>
        <Text style={styles.headerCell}>Total Deposit</Text>
        <Text style={styles.headerCell}>Total Cost</Text>
        <Text style={styles.headerCell}>Due or Give</Text>
      </View>
      <FlatList
        data={overallCalculations}
        renderItem={renderOverallCalculationItem}
        keyExtractor={(item) => item.user_id.toString()}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
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
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
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
    width: '48%',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  cell: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    borderBottomWidth: 2,
    borderColor: '#000',
  },
});

export default OverallCalculationScreen;
