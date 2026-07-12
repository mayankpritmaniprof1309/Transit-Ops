import React, { useState } from 'react';
import VehicleList from './VehicleList.jsx';
import AddVehicle from './AddVehicle.jsx';
import EditVehicle from './EditVehicle.jsx';
import ViewVehicle from './ViewVehicle.jsx';

/**
 * Parent Page component to coordinate subviews for Vehicle operations.
 */
export const VehiclesPage = () => {
  const [view, setView] = useState('list'); // 'list' | 'add' | 'edit' | 'view'
  const [selectedId, setSelectedId] = useState(null);

  const handleEdit = (vehicle) => {
    setSelectedId(vehicle._id || vehicle);
    setView('edit');
  };

  const handleView = (vehicle) => {
    setSelectedId(vehicle._id || vehicle);
    setView('view');
  };

  switch (view) {
    case 'add':
      return (
        <AddVehicle
          onSuccess={() => setView('list')}
          onCancel={() => setView('list')}
        />
      );
    case 'edit':
      return (
        <EditVehicle
          vehicleId={selectedId}
          onSuccess={() => setView('list')}
          onCancel={() => setView('list')}
        />
      );
    case 'view':
      return (
        <ViewVehicle
          vehicleId={selectedId}
          onBack={() => setView('list')}
          onEdit={(id) => {
            setSelectedId(id);
            setView('edit');
          }}
        />
      );
    case 'list':
    default:
      return (
        <VehicleList
          onAddNew={() => setView('add')}
          onEdit={handleEdit}
          onView={handleView}
        />
      );
  }
};

export default VehiclesPage;
