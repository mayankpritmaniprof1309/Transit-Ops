import React, { useState } from 'react';
import ExpenseList from './ExpenseList.jsx';
import AddExpense from './AddExpense.jsx';
import EditExpense from './EditExpense.jsx';

/**
 * Parent Page component to coordinate subviews for Expense operations.
 */
export const ExpensePage = () => {
  const [view, setView] = useState('list'); // 'list' | 'add' | 'edit'
  const [selectedId, setSelectedId] = useState(null);

  const handleEdit = (expense) => {
    setSelectedId(expense._id || expense);
    setView('edit');
  };

  switch (view) {
    case 'add':
      return (
        <AddExpense
          onSuccess={() => setView('list')}
          onCancel={() => setView('list')}
        />
      );
    case 'edit':
      return (
        <EditExpense
          expenseId={selectedId}
          onSuccess={() => setView('list')}
          onCancel={() => setView('list')}
        />
      );
    case 'list':
    default:
      return (
        <ExpenseList
          onAddNew={() => setView('add')}
          onEdit={handleEdit}
        />
      );
  }
};

export default ExpensePage;
