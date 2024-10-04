import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

// Define the User interface
interface User {
  user_id?: number; // Marked as optional
  name: string;
  email: string;
  created_at: string; // Assuming this is a date string
}

const Router: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  // Fetch user data from the API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://10.10.200.128:3000/api/users'); // Update the API endpoint
      console.log('API Response:', response.data); // Log the response for debugging
      setUsers(response.data.users); // Adjust based on the actual API response structure
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Render individual user items
  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
      <Text style={styles.userDate}>{item.created_at}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User List</Text>

      {/* Users List */}
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => (item.user_id ? item.user_id.toString() : Math.random().toString())} // Updated keyExtractor
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerName}>Name</Text>
            <Text style={styles.headerEmail}>Email</Text>
            <Text style={styles.headerDate}>Created At</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2E7D32', // Dark green color for the title
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingVertical: 10,
    backgroundColor: '#e0f2f1', // Light green background for header
    borderRadius: 5,
  },
  headerName: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#004d40', // Dark green for the header text
  },
  headerEmail: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#004d40',
  },
  headerDate: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#004d40',
  },
  userItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff', // White background for user items
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2, // For Android shadow
  },
  userName: {
    flex: 1,
    fontSize: 16,
    color: '#333', // Dark gray for user names
  },
  userEmail: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  userDate: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});

export default Router;
