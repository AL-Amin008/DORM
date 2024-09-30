import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SpendForm from './SpendForm'; // Import the form component

interface Spend {
  id: number;
  user_id: number;
  spend_date: string;
  element: string;
  price: number;
  is_admin: boolean;
}

const SpendList: React.FC = () => {
  const [spends, setSpends] = useState<Spend[]>([]);
  const [editingSpendId, setEditingSpendId] = useState<number | null>(null);

  const fetchSpends = () => {
    axios.get('http://localhost:3000/api/spend')
      .then((response) => {
        setSpends(response.data.spends);
      })
      .catch((error) => {
        console.error('Error fetching spends:', error);
      });
  };

  useEffect(() => {
    fetchSpends();
  }, []);

  return (
    <div>
      <h1>Spending List</h1>
      <SpendForm spendId={editingSpendId || undefined} onSuccess={fetchSpends} />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Date</th>
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
                <button onClick={() => setEditingSpendId(spend.id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SpendList;
