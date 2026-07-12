import React, { useState, useEffect } from 'react';
import WelcomeBanner from '../../components/dashboard/WelcomeBanner.jsx';
import KPICards from '../../components/dashboard/KPICards.jsx';
import FleetUtilizationCard from '../../components/dashboard/FleetUtilizationCard.jsx';
import VehicleStatusChart from '../../components/dashboard/VehicleStatusChart.jsx';
import MonthlyTripsChart from '../../components/dashboard/MonthlyTripsChart.jsx';
import FuelTrendChart from '../../components/dashboard/FuelTrendChart.jsx';
import ExpenseBreakdownChart from '../../components/dashboard/ExpenseBreakdownChart.jsx';
import RecentTripsTable from '../../components/dashboard/RecentTripsTable.jsx';
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import {
  getDashboardKPIs,
  getExpenseStats,
  getRecentTrips,
  getFuelLogs
} from '../../services/dashboard.service.js';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState({});

  // Dashboard state variables
  const [kpis, setKpis] = useState({});
  const [expenseStats, setExpenseStats] = useState({});
  const [recentTrips, setRecentTrips] = useState([]);
  const [fuelLogs, setFuelLogs] = useState([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(false);
    try {
      // Use Promise.allSettled so role-restricted endpoints (403) don't crash the entire dashboard
      const [kpiResult, expenseResult, tripsResult, fuelResult] = await Promise.allSettled([
        getDashboardKPIs(),
        getExpenseStats(),
        getRecentTrips(5),
        getFuelLogs()
      ]);

      // KPIs are critical — if this fails, show the error state
      if (kpiResult.status === 'rejected') {
        throw kpiResult.reason;
      }
      setKpis(kpiResult.value);

      // Expense stats — gracefully degrade on 403 (role restriction)
      setExpenseStats(expenseResult.status === 'fulfilled' ? expenseResult.value : {});

      // Recent trips — gracefully degrade on 403 (role restriction)
      setRecentTrips(
        tripsResult.status === 'fulfilled' ? (tripsResult.value.trips || []) : []
      );

      // Fuel logs — gracefully degrade on 403 (role restriction)
      setFuelLogs(fuelResult.status === 'fulfilled' ? fuelResult.value : []);
    } catch (err) {
      console.error(err);
      setError(true);
      setErrorMessage(err.response?.data?.message || err.message || 'Unable to fetch dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Read logged-in user profile
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser({});
      }
    }
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        title="Dashboard Load Failed"
        message={errorMessage}
        onRetry={fetchDashboardData}
      />
    );
  }

  return (
    <div className="d-flex flex-column gap-4">
      {/* Premium Welcome Banner */}
      <WelcomeBanner user={user} />

      {/* Summary KPI Counters */}
      <KPICards data={kpis} />

      {/* Primary Analytics Row */}
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <MonthlyTripsChart trips={recentTrips} />
        </div>
        <div className="col-12 col-lg-4">
          <VehicleStatusChart
            available={kpis.availableVehicles}
            onTrip={kpis.vehiclesOnTrip}
            inShop={kpis.vehiclesInShop}
          />
        </div>
      </div>

      {/* Secondary Operations Row */}
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <RecentTripsTable trips={recentTrips} />
        </div>
        <div className="col-12 col-lg-4">
          <FleetUtilizationCard
            active={kpis.vehiclesOnTrip}
            total={kpis.totalVehicles}
            utilization={kpis.fleetUtilization}
          />
        </div>
      </div>

      {/* Tertiary Expense Row */}
      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <FuelTrendChart fuelLogs={fuelLogs} />
        </div>
        <div className="col-12 col-lg-6">
          <ExpenseBreakdownChart stats={expenseStats} />
        </div>
      </div>
    </div>
  );
}
