import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

// Define the User interface
interface User {
  user_id: number;
  name: string;
  email: string;
  created_at: string; // Assuming this is a date string
}

const router: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  // Fetch user data from the API
  const fetchUsers = () => {
    axios
      .get('http://localhost:3000/api/users') // Update the API endpoint
      .then((response) => {
        setUsers(response.data.users); // Adjust based on the actual API response structure
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Render individual user items
  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.user_id}</Text>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.created_at}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users</Text>

      {/* Users List */}
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.user_id.toString()}
        ListHeaderComponent={
          <View style={styles.row}>
            <Text style={styles.headerCell}>User ID</Text>
            <Text style={styles.headerCell}>Name</Text>
            <Text style={styles.headerCell}>Email</Text>
            <Text style={styles.headerCell}>Created At</Text>
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
    textAlign: 'center',
  },
});

export default router;