import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Deposit {
  id?: number;
  user_id: number;
  deposit_date: string;
  amount: number;
}

interface User {
  id: number;
  name: string;
}

const DepositScreen: React.FC = () => {
  const [depositList, setDepositList] = useState<Deposit[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newDeposit, setNewDeposit] = useState<Deposit>({
    user_id: 0,
    deposit_date: new Date().toISOString().split('T')[0],
    amount: 0,
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const fetchUsers = () => {
    axios
      .get('http://10.10.200.128:3000/api/users')
      .then((response) => {
        setUsers(response.data.users);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  };

  const fetchDepositData = () => {
    axios
      .get('http://10.10.200.128:3000/api/deposit')
      .then((response) => {
        setDepositList(response.data.deposits);
      })
      .catch((error) => {
        console.error('Error fetching deposit data:', error);
      });
  };

  useEffect(() => {
    fetchUsers();
    fetchDepositData();
  }, []);

  const handleInputChange = (field: string, value: string | number) => {
    setNewDeposit({
      ...newDeposit,
      [field]: value,
    });
  };

  const showPicker = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || new Date();
    setNewDeposit({
      ...newDeposit,
      deposit_date: currentDate.toISOString().split('T')[0],
    });
    setShowDatePicker(false);
  };

  const handleSubmit = () => {
    if (newDeposit.user_id === 0) {
      Alert.alert('Error', 'Please select a user');
      return;
    }

    const depositPayload = {
      user_id: newDeposit.user_id,
      deposit_date: newDeposit.deposit_date,
      amount: newDeposit.amount,
    };

    if (isEditing && editingId !== null) {
      axios
        .put(`http://10.10.200.128:3000/api/deposit/${editingId}`, depositPayload)
        .then(() => {
          fetchDepositData();
          resetForm();
        })
        .catch((error) => {
          console.error('Error updating deposit record:', error);
        });
    } else {
      axios
        .post('http://10.10.200.128:3000/api/deposit', depositPayload)
        .then(() => {
          fetchDepositData();
          resetForm();
        })
        .catch((error) => {
          console.error('Error adding deposit record:', error);
        });
    }
  };

  const resetForm = () => {
    setNewDeposit({
      user_id: 0,
      deposit_date: new Date().toISOString().split('T')[0],
      amount: 0,
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (item: Deposit) => {
    setIsEditing(true);
    setEditingId(item.id || null);
    setNewDeposit({
      user_id: item.user_id,
      deposit_date: item.deposit_date,
      amount: item.amount,
    });
  };

  const renderDepositItem = ({ item }: { item: Deposit }) => {
    const amount = typeof item.amount === 'number' ? item.amount : parseFloat(item.amount);
    
    const user = users.find(user => user.id === item.user_id);
    const userName = user ? user.name : 'Unknown User'; 

    return (
      <View style={styles.row}>
        <Text style={styles.cell}>{item.deposit_date}</Text>
        <Text style={styles.cell}>{amount.toFixed(2)}</Text>
        <Text style={styles.cell}>{userName}</Text> 
        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deposit Records</Text>

      <View style={styles.form}>
        <TouchableOpacity onPress={showPicker}>
          <TextInput
            placeholder="Deposit Date (YYYY-MM-DD)"
            style={styles.input}
            value={newDeposit.deposit_date}
            editable={false} 
          />
        </TouchableOpacity>
        <Picker
          selectedValue={newDeposit.user_id}
          style={styles.input}
          onValueChange={(itemValue: number) => handleInputChange('user_id', itemValue)}
        >
          <Picker.Item label="Select User" value={0} />
          {users.map((user) => (
            <Picker.Item key={user.id} label={user.name} value={user.id} />
          ))}
        </Picker>
        <TextInput
          placeholder="Amount"
          style={styles.input}
          keyboardType="numeric"
          value={newDeposit.amount.toString()}
          onChangeText={(value) => handleInputChange('amount', Number(value))}
        />
        <Button
          title={isEditing ? 'Update Deposit' : 'Add Deposit'}
          onPress={handleSubmit}
        />
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={new Date(newDeposit.deposit_date)}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <FlatList
        data={depositList}
        renderItem={renderDepositItem}
        keyExtractor={(item) => item.id?.toString() || ''}
        ListHeaderComponent={
          <View style={styles.row}>
            <Text style={styles.headerCell}>Deposit Date</Text>
            <Text style={styles.headerCell}>Amount</Text>
            <Text style={styles.headerCell}>User Name</Text> 
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

export default DepositScreen;
