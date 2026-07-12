import React, { useState } from 'react';
import FuelList from './FuelList.jsx';
import AddFuel from './AddFuel.jsx';
import EditFuel from './EditFuel.jsx';

/**
 * Parent Page component to coordinate subviews for Fuel operations.
 */
export const FuelPage = () => {
  const [view, setView] = useState('list'); // 'list' | 'add' | 'edit'
  const [selectedId, setSelectedId] = useState(null);

  const handleEdit = (fuelLog) => {
    setSelectedId(fuelLog._id || fuelLog);
    setView('edit');
  };

  switch (view) {
    case 'add':
      return (
        <AddFuel
          onSuccess={() => setView('list')}
          onCancel={() => setView('list')}
        />
      );
    case 'edit':
      return (
        <EditFuel
          fuelLogId={selectedId}
          onSuccess={() => setView('list')}
          onCancel={() => setView('list')}
        />
      );
    case 'list':
    default:
      return (
        <FuelList
          onAddNew={() => setView('add')}
          onEdit={handleEdit}
        />
      );
  }
};

export default FuelPage;
