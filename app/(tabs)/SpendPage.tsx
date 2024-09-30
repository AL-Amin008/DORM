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

const SpendPage: React.FC = () => {
  const [spends, setSpends] = useState<Spend[]>([]);
  const [spendForm, setSpendForm] = useState<Spend>({
    user_id: 1, // Assuming a default user_id, replace with actual logic
    spend_date: '',
    element: '',
    price: 0,
    is_admin: false,
  });
  const [editingId, setEditingId] = useState<number | null>(null); // To track if we are editing

  // Fetch spend records
  const fetchSpends = async () => {
    try {
      const response = await axios.get('/api/spend');
      setSpends(response.data.spends);
    } catch (error) {
      console.error('Failed to fetch spends', error);
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSpendForm({ ...spendForm, [name]: value });
  };

  // Handle submit (add or update spend)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update existing spend
        await axios.put(`/api/spend/${editingId}`, spendForm);
      } else {
        // Add new spend
        await axios.post('/api/spend', spendForm);
      }

      setSpendForm({
        user_id: 1, // Assuming a default user_id, replace with actual logic
        spend_date: '',
        element: '',
        price: 0,
        is_admin: false,
      });
      setEditingId(null);
      fetchSpends();
    } catch (error) {
      console.error('Failed to submit spend', error);
    }
  };

  // Handle edit click
  const handleEdit = (spend: Spend) => {
    setSpendForm(spend);
    setEditingId(spend.id!);
  };

  // Handle delete click
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/spend/${id}`);
      fetchSpends();
    } catch (error) {
      console.error('Failed to delete spend', error);
    }
  };

  useEffect(() => {
    fetchSpends();
  }, []);

  return (
    <div>
      <h1>Manage Spends</h1>

      {/* Form to add/edit spend */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Spend Date:</label>
          <input
            type="date"
            name="spend_date"
            value={spendForm.spend_date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Element:</label>
          <input
            type="text"
            name="element"
            value={spendForm.element}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={spendForm.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Is Admin:</label>
          <input
            type="checkbox"
            name="is_admin"
            checked={spendForm.is_admin}
            onChange={(e) =>
              setSpendForm({ ...spendForm, is_admin: e.target.checked })
            }
          />
        </div>
        <button type="submit">
          {editingId ? 'Update Spend' : 'Add Spend'}
        </button>
      </form>

      {/* Spend list */}
      <h2>Spend List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Spend Date</th>
            <th>Element</th>
            <th>Price</th>
            <th>Is Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {spends.map((spend) => (
            <tr key={spend.id}>
              <td>{spend.id}</td>
              <td>{spend.user_id}</td>
              <td>{spend.spend_date}</td>
              <td>{spend.element}</td>
              <td>{spend.price}</td>
              <td>{spend.is_admin ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleEdit(spend)}>Edit</button>
                <button onClick={() => handleDelete(spend.id!)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SpendPage;
