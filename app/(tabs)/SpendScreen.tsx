import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

interface Spend {
  id?: number;
  user_id: number;
  spend_date: string;
  element: string;
  price: number;
}

const SpendScreen: React.FC = () => {
  const [spendList, setSpendList] = useState<Spend[]>([]);
  const [newSpend, setNewSpend] = useState<Spend>({
    user_id: 0,
    spend_date: '',
    element: '',
    price: 0,
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetch existing spend records from the API
  useEffect(() => {
    fetchSpendData();
  }, []);

  const fetchSpendData = () => {
    axios.get('http://localhost:3000/api/spend')
      .then((response) => {
        setSpendList(response.data.spends);
      })
      .catch((error) => {
        console.error('Error fetching spend data:', error);
      });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setNewSpend({
      ...newSpend,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    if (isEditing && editingId !== null) {
      // Update existing record
      axios.put(`http://localhost:3000/api/spend/${editingId}`, newSpend)
        .then(() => {
          fetchSpendData();
          resetForm();
        })
        .catch((error) => {
          console.error('Error updating spend record:', error);
        });
    } else {
      // Add new record
      axios.post('http://localhost:3000/api/spend', newSpend)
        .then(() => {
          fetchSpendData();
          resetForm();
        })
        .catch((error) => {
          console.error('Error adding spend record:', error);
        });
    }
  };

  const resetForm = () => {
    setNewSpend({
      user_id: 0,
      spend_date: '',
      element: '',
      price: 0,
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (item: Spend) => {
    setIsEditing(true);
    setEditingId(item.id || null);
    setNewSpend({
      user_id: item.user_id,
      spend_date: item.spend_date,
      element: item.element,
      price: item.price,
    });
  };

  const renderSpendItem = ({ item }: { item: Spend }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.user_id}</Text>
      <Text style={styles.cell}>{item.spend_date}</Text>
      <Text style={styles.cell}>{item.element}</Text>
      <Text style={styles.cell}>{Number(item.price).toFixed(2)}</Text>
      <Button title="Edit" onPress={() => handleEdit(item)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spend Records</Text>

      {/* Input Form */}
      <View style={styles.form}>
        <TextInput
          placeholder="User ID"
          style={styles.input}
          keyboardType="numeric"
          value={newSpend.user_id.toString()}
          onChangeText={(value) => handleInputChange('user_id', Number(value))}
        />
        <TextInput
          placeholder="Spend Date (YYYY-MM-DD)"
          style={styles.input}
          value={newSpend.spend_date}
          onChangeText={(value) => handleInputChange('spend_date', value)}
        />
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
        <Button title={isEditing ? 'Update Spend' : 'Add Spend'} onPress={handleSubmit} />
      </View>

      {/* Spend List */}
      <FlatList
        data={spendList}
        renderItem={renderSpendItem}
        keyExtractor={(item) => item.id?.toString() || ''}
        ListHeaderComponent={
          <View style={styles.row}>
            <Text style={styles.headerCell}>User ID</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  },
  headerCell: {
    flex: 1,
    paddingHorizontal: 5,
    fontWeight: 'bold',
  },
});

export default SpendScreen;
