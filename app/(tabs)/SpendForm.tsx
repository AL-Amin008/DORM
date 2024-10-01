import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Spend {
  id?: number;
  user_id: number;
  spend_date: string;
  element: string;
  price: number;
  is_admin: boolean;
}

interface Props {
  spendId?: number; // Optional for editing a specific spend entry
  onSuccess: () => void; // Callback for refreshing the data
}

const SpendForm: React.FC<Props> = ({ spendId, onSuccess }) => {
  const [spendData, setSpendData] = useState<Spend>({
    user_id: 0,  // Replace with actual user ID
    spend_date: '',
    element: '',
    price: 0,
    is_admin: false,
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Fetch spend details if editing an existing record
  useEffect(() => {
    if (spendId) {
      setIsEditing(true);
      axios.get(`http://localhost:3000/api/spend/${spendId}`)
        .then((response) => {
          const spend = response.data.spend;
          setSpendData({
            user_id: spend.user_id,
            spend_date: spend.spend_date,
            element: spend.element,
            price: spend.price,
            is_admin: !!spend.is_admin,  // Convert to boolean
          });
        })
        .catch((error) => {
          console.error('Error fetching spend details:', error);
        });
    }
  }, [spendId]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSpendData((prevData) => ({
      ...prevData,
      [name]: name === 'is_admin' ? !!value : value,  // Handle boolean conversion for is_admin
    }));
  };

  // Handle form submission for adding/editing spend entry
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = spendId ? `http://localhost:3000/api/spend/ ${spendId}` : 'http://localhost:3000/api/spend';
    const apiMethod = spendId ? 'put' : 'post';

    axios[apiMethod](apiUrl, spendData)
      .then(() => {
        alert(spendId ? 'Spend entry updated successfully!' : 'Spend entry added successfully!');
        onSuccess(); // Refresh spend data after success
      })
      .catch((error) => {
        console.error('Error saving spend data:', error);
      });
  };

  return (
    <div>
      <h2>{isEditing ? 'Edit Spend Entry' : 'Add New Spend Entry'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>User ID:</label>
          <input
            type="number"
            name="user_id"
            value={spendData.user_id}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Spend Date:</label>
          <input
            type="date"
            name="spend_date"
            value={spendData.spend_date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Element:</label>
          <input
            type="text"
            name="element"
            value={spendData.element}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={spendData.price}
            step="0.01"
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Is Admin:</label>
          <select
            name="is_admin"
            value={spendData.is_admin ? '1' : '0'}
            onChange={handleInputChange}
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>
        <button type="submit">{isEditing ? 'Update Spend' : 'Add Spend'}</button>
      </form>
    </div>
  );
};

export default SpendForm;
