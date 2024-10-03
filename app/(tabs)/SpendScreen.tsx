import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

// Define the Spend interface
interface Spend {
  id?: number;
  user_id: number; // Added user_id
  spend_date: string;
  element: string;
  price: number;
}

const SpendScreen: React.FC = () => {
  const [spendList, setSpendList] = useState<Spend[]>([]);
  const [newSpend, setNewSpend] = useState<Spend>({
    user_id: 1, // Replace this with the actual user ID you want to use
    spend_date: new Date().toISOString().split('T')[0], // Set today's date
    element: '',
    price: 0,
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  // Fetch existing spend records from the API
  const fetchSpendData = () => {
    axios
      .get('http://localhost:3000/api/spend')
      .then((response) => {
        setSpendList(response.data.spends);
      })
      .catch((error) => {
        console.error('Error fetching spend data:', error);
      });
  };

  // Refresh data when component mounts or new data is submitted
  useEffect(() => {
    fetchSpendData();
  }, []);

  // Handle input field changes
  const handleInputChange = (field: string, value: string | number) => {
    setNewSpend({
      ...newSpend,
      [field]: value,
    });
  };

  // Show date picker
  const showPicker = () => {
    setShowDatePicker(true);
  };

  // Handle date change
  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || new Date();
    setNewSpend({
      ...newSpend,
      spend_date: currentDate.toISOString().split('T')[0],
    });
    setShowDatePicker(false);
  };

  // Submit new or edited spend record
  const handleSubmit = () => {
    if (isEditing && editingId !== null) {
      axios
        .put(`http://localhost:3000/api/spend/${editingId}`, newSpend)
        .then(() => {
          fetchSpendData();
          resetForm();
        })
        .catch((error) => {
          console.error('Error updating spend record:', error);
        });
    } else {
      axios
        .post('http://localhost:3000/api/spend', newSpend)
        .then(() => {
          fetchSpendData();
          resetForm();
        })
        .catch((error) => {
          console.error('Error adding spend record:', error);
        });
    }
  };

  // Reset form after submission or editing
  const resetForm = () => {
    setNewSpend({
      user_id: 1, // Reset user ID as needed
      spend_date: new Date().toISOString().split('T')[0],
      element: '',
      price: 0,
    });
    setIsEditing(false);
    setEditingId(null);
  };

  // Handle editing a spend record
  const handleEdit = (item: Spend) => {
    setIsEditing(true);
    setEditingId(item.id || null);
    setNewSpend({
      user_id: item.user_id || 1, // Ensure user_id is set
      spend_date: item.spend_date,
      element: item.element,
      price: item.price,
    });
  };

  // Render individual spend items
  const renderSpendItem = ({ item }: { item: Spend }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.spend_date}</Text>
      <Text style={styles.cell}>{item.element}</Text>
      <Text style={styles.cell}>{Number(item.price).toFixed(2)}</Text>
      <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spend Records</Text>

      {/* Input Form */}
      <View style={styles.form}>
        <TouchableOpacity onPress={showPicker}>
          <TextInput
            placeholder="Spend Date (YYYY-MM-DD)"
            style={styles.input}
            value={newSpend.spend_date}
            editable={false} // Make it read-only, as we're using a date picker
          />
        </TouchableOpacity>
        <TextInput
          placeholder="Element"
          style={styles.input}
          value={newSpend.element}
          onChangeText={(value) => handleInputChange('element', value)}
        />
        <TextInput
          placeholder="Price"
          style={styles.input}
          keyboardType="numeric"
          value={newSpend.price.toString()}
          onChangeText={(value) => handleInputChange('price', Number(value))}
        />
        <Button
          title={isEditing ? 'Update Spend' : 'Add Spend'}
          onPress={handleSubmit}
        />
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={new Date(newSpend.spend_date)}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {/* Spend List */}
      <FlatList
        data={spendList}
        renderItem={renderSpendItem}
        keyExtractor={(item) => item.id?.toString() || ''}
        ListHeaderComponent={
          <View style={styles.row}>
            <Text style={styles.headerCell}>Spend Date</Text>
            <Text style={styles.headerCell}>Element</Text>
            <Text style={styles.headerCell}>Price</Text>
            <Text style={styles.headerCell}>Actions</Text>
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
  form: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
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
  editButton: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '500',
  },
});

export default SpendScreen;
