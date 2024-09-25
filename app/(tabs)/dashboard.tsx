import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';

const Dashboard = () => {
  return (
    

    <View style={styles.container}>
      <Text style={styles.name}>sourav</Text>
      <Text style={styles.phone}>01760060543</Text>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  photo: {
    borderRadius: 50,
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  phone: {
    fontSize: 16,
    color: '#666',
  },
});
