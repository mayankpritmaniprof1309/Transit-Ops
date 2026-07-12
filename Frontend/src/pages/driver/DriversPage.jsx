import React, { useState } from 'react';
import DriverList from './DriverList.jsx';
import AddDriver from './AddDriver.jsx';
import EditDriver from './EditDriver.jsx';
import ViewDriver from './ViewDriver.jsx';

/**
 * Parent Page component to coordinate subviews for Driver operations.
 */
export const DriversPage = () => {
  const [view, setView] = useState('list'); // 'list' | 'add' | 'edit' | 'view'
  const [selectedId, setSelectedId] = useState(null);

  const handleEdit = (driver) => {
    setSelectedId(driver._id || driver);
    setView('edit');
  };

  const handleView = (driver) => {
    setSelectedId(driver._id || driver);
    setView('view');
  };

  switch (view) {
    case 'add':
      return (
        <AddDriver
          onSuccess={() => setView('list')}
          onCancel={() => setView('list')}
        />
      );
    case 'edit':
      return (
        <EditDriver
          driverId={selectedId}
          onSuccess={() => setView('list')}
          onCancel={() => setView('list')}
        />
      );
    case 'view':
      return (
        <ViewDriver
          driverId={selectedId}
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
        <DriverList
          onAddNew={() => setView('add')}
          onEdit={handleEdit}
          onView={handleView}
        />
      );
  }
};

export default DriversPage;
