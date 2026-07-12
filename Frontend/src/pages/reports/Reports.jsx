import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaChartLine } from 'react-icons/fa';

// Services
import {
  getDashboardReport,
  getFuelEfficiencyReport,
  getOperationalCostReport,
  getVehicleROIReport,
  getTripReport,
  exportCSV,
} from '../../services/report.service.js';
import { getAllFuelLogs } from '../../services/fuel.service.js';
import maintenanceService from '../../services/maintenance.service.js';
import { getAllDrivers } from '../../services/driver.service.js';

// Components
import AnalyticsHeader from '../../components/reports/AnalyticsHeader.jsx';
import AnalyticsFilters from '../../components/reports/AnalyticsFilters.jsx';
import SummaryCards from '../../components/reports/SummaryCards.jsx';
import FleetUtilizationCard from '../../components/reports/FleetUtilizationCard.jsx';
import VehicleStatusChart from '../../components/reports/VehicleStatusChart.jsx';
import TripStatusChart from '../../components/reports/TripStatusChart.jsx';
import RevenueVsExpenseChart from '../../components/reports/RevenueVsExpenseChart.jsx';
import FuelEfficiencyChart from '../../components/reports/FuelEfficiencyChart.jsx';
import MaintenanceCostChart from '../../components/reports/MaintenanceCostChart.jsx';
import ExpenseBreakdownChart from '../../components/reports/ExpenseBreakdownChart.jsx';
import MonthlyTrendChart from '../../components/reports/MonthlyTrendChart.jsx';
import TopVehicles from '../../components/reports/TopVehicles.jsx';
import DriverPerformanceTable from '../../components/reports/DriverPerformanceTable.jsx';
import RecentTrips from '../../components/reports/RecentTrips.jsx';
import AnalyticsExport from '../../components/reports/AnalyticsExport.jsx';
import ReportSkeleton from '../../components/reports/ReportSkeleton.jsx';

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Active filters state
  const [activeFilters, setActiveFilters] = useState({
    startDate: '',
    endDate: '',
    vehicleId: '',
    driverId: '',
    tripStatus: '',
    region: '',
    vehicleType: '',
    fuelType: '',
  });

  // Aggregated data reports
  const [dashboardData, setDashboardData] = useState(null);
  const [fuelEfficiencyData, setFuelEfficiencyData] = useState([]);
  const [costData, setCostData] = useState([]);
  const [roiData, setRoiData] = useState([]);
  const [tripsList, setTripsList] = useState([]);
  const [fuelLogsList, setFuelLogsList] = useState([]);
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [driversList, setDriversList] = useState([]);

  // Fetch all analytics datasets in parallel
  const loadReports = useCallback(async () => {
    setLoading(true);
    setError('');

    const params = {
      startDate: activeFilters.startDate || undefined,
      endDate: activeFilters.endDate || undefined,
      vehicleId: activeFilters.vehicleId || undefined,
      driverId: activeFilters.driverId || undefined,
      tripStatus: activeFilters.tripStatus || undefined,
      region: activeFilters.region || undefined,
      vehicleType: activeFilters.vehicleType || undefined,
      fuelType: activeFilters.fuelType || undefined,
    };

    try {
      const [
        dashRes,
        fuelRes,
        costRes,
        roiRes,
        tripsRes,
        fuelLogsRes,
        maintenanceRes,
        driversRes,
      ] = await Promise.allSettled([
        getDashboardReport(params),
        getFuelEfficiencyReport(params),
        getOperationalCostReport(params),
        getVehicleROIReport(params),
        getTripReport({ ...params, limit: 100 }),
        getAllFuelLogs({ ...params, limit: 100 }),
        maintenanceService.getAllMaintenanceRecords(),
        getAllDrivers({ limit: 100 }),
      ]);

      if (dashRes.status === 'fulfilled') setDashboardData(dashRes.value?.data ?? dashRes.value ?? null);
      if (fuelRes.status === 'fulfilled') setFuelEfficiencyData(fuelRes.value?.data ?? fuelRes.value ?? []);
      if (costRes.status === 'fulfilled') setCostData(costRes.value?.data ?? costRes.value ?? []);
      if (roiRes.status === 'fulfilled') setRoiData(roiRes.value?.data ?? roiRes.value ?? []);
      if (tripsRes.status === 'fulfilled') setTripsList(tripsRes.value?.data?.trips ?? tripsRes.value?.trips ?? []);
      if (fuelLogsRes.status === 'fulfilled') setFuelLogsList(fuelLogsRes.value?.data?.fuelLogs ?? fuelLogsRes.value?.data ?? []);
      if (maintenanceRes.status === 'fulfilled') setMaintenanceList(maintenanceRes.value?.data ?? maintenanceRes.value ?? []);
      if (driversRes.status === 'fulfilled') setDriversList(driversRes.value?.data?.drivers ?? driversRes.value?.data ?? []);

      // Verify at least one data source succeeded
      const allCriticalFailed = [dashRes, costRes, roiRes].every((r) => r.status === 'rejected');
      if (allCriticalFailed) {
        setError('Failed to load primary report analytics. Please ensure the backend is connected.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred while compiling reports.');
    } finally {
      setLoading(false);
    }
  }, [activeFilters]);

  // Load on filter changes or mount
  useEffect(() => {
    loadReports();
  }, [loadReports]);

  // Handle CSV exports calling backend export stream
  const handleExportCSV = async (type) => {
    try {
      const blob = await exportCSV({
        type,
        startDate: activeFilters.startDate || undefined,
        endDate: activeFilters.endDate || undefined,
        vehicleId: activeFilters.vehicleId || undefined,
        driverId: activeFilters.driverId || undefined,
        tripStatus: activeFilters.tripStatus || undefined,
      });

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('CSV Export Error:', err);
      alert('Failed to generate CSV export file.');
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  // Compile summary metric aggregations
  const compileSummaryMetrics = () => {
    let totalRevenue = 0;
    let totalOperationalCost = 0;
    let fuelConsumed = 0;

    roiData.forEach((item) => {
      totalRevenue += item.revenue || 0;
    });

    costData.forEach((item) => {
      totalOperationalCost += item.totalOperationalCost || 0;
    });

    fuelLogsList.forEach((log) => {
      fuelConsumed += log.fuelQuantity || log.quantity || 0;
    });

    const activeVehicles = dashboardData?.totalVehicles ?? 0;
    const completedTrips = dashboardData?.completedTrips ?? 0;
    const pendingTrips = dashboardData?.pendingTrips ?? 0;
    const driversOnDuty = dashboardData?.driversOnTrip ?? 0;
    const fleetUtilization = dashboardData?.fleetUtilization ?? 0;

    return {
      totalRevenue,
      totalOperationalCost,
      fleetUtilization,
      completedTrips,
      pendingTrips,
      activeVehicles,
      driversOnDuty,
      fuelConsumed,
    };
  };

  const summaryMetrics = compileSummaryMetrics();

  return (
    <div className="container-fluid py-4 px-md-4">
      {/* Print-only CSS layout definitions */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
            font-size: 12px !important;
          }
          .no-print, nav, aside, .sidebar-container, .navbar, .no-print * {
            display: none !important;
          }
          .container-fluid {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          .premium-card {
            border: 1px solid #dee2e6 !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            margin-bottom: 15px !important;
            border-radius: 12px !important;
          }
          .table-responsive {
            overflow: visible !important;
          }
          .recharts-responsive-container {
            width: 100% !important;
            height: 250px !important;
          }
        }
      `}</style>

      {/* Top Header */}
      <AnalyticsHeader
        onRefresh={loadReports}
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
        loading={loading}
      />

      {/* Filter Panel */}
      <AnalyticsFilters
        onApplyFilters={setActiveFilters}
        onResetFilters={setActiveFilters}
      />

      {/* Error State */}
      {error && (
        <div className="alert alert-danger border-0 rounded-4 shadow-sm mb-4 d-flex align-items-center gap-2" role="alert">
          <FaExclamationTriangle className="text-danger" />
          <span className="fw-semibold small">{error}</span>
        </div>
      )}

      {/* Main Grid View */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <ReportSkeleton />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* KPI Summary Cards */}
            <SummaryCards metrics={summaryMetrics} />

            {/* Charts Section */}
            <div className="row g-4 mb-4">
              {/* 1. Fleet Utilization (Donut) */}
              <div className="col-12 col-md-6 col-lg-3">
                <FleetUtilizationCard
                  vehiclesOnTrip={dashboardData?.vehiclesOnTrip ?? 0}
                  availableVehicles={dashboardData?.availableVehicles ?? 0}
                  vehiclesInShop={dashboardData?.vehiclesInShop ?? 0}
                  retiredVehicles={dashboardData?.retiredVehicles ?? 0}
                />
              </div>

              {/* 2. Vehicle Status (Pie) */}
              <div className="col-12 col-md-6 col-lg-3">
                <VehicleStatusChart
                  available={dashboardData?.availableVehicles ?? 0}
                  onTrip={dashboardData?.vehiclesOnTrip ?? 0}
                  inShop={dashboardData?.vehiclesInShop ?? 0}
                  retired={dashboardData?.retiredVehicles ?? 0}
                />
              </div>

              {/* 3. Trip Status (Stacked Bar) */}
              <div className="col-12 col-md-6 col-lg-3">
                <TripStatusChart
                  completed={dashboardData?.completedTrips ?? 0}
                  active={dashboardData?.activeTrips ?? 0}
                  pending={dashboardData?.pendingTrips ?? 0}
                  cancelled={dashboardData?.cancelledTrips ?? 0}
                />
              </div>

              {/* 7. Expense Category Breakdown (Donut) */}
              <div className="col-12 col-md-6 col-lg-3">
                <ExpenseBreakdownChart costData={costData} />
              </div>
            </div>

            <div className="row g-4 mb-4">
              {/* 4. Monthly Revenue vs Expenses (Area) */}
              <div className="col-12 col-lg-6">
                <RevenueVsExpenseChart roiData={roiData} />
              </div>

              {/* 5. Fuel Consumption/Efficiency Trend (Line) */}
              <div className="col-12 col-lg-6">
                <FuelEfficiencyChart efficiencyData={fuelEfficiencyData} />
              </div>
            </div>

            <div className="row g-4 mb-4">
              {/* 6. Maintenance Cost Analysis (Bar) */}
              <div className="col-12 col-lg-6">
                <MaintenanceCostChart costData={costData} />
              </div>

              {/* 8. Monthly Trip Trend (Area) */}
              <div className="col-12 col-lg-6">
                <MonthlyTrendChart trips={tripsList} />
              </div>
            </div>

            {/* Performance Tables */}
            <div className="row g-4 mb-4">
              <div className="col-12 col-xl-6">
                <TopVehicles roiData={roiData} efficiencyData={fuelEfficiencyData} />
              </div>
              <div className="col-12 col-xl-6">
                <DriverPerformanceTable efficiencyData={fuelEfficiencyData} />
              </div>
            </div>

            {/* Bottom Platform Logs */}
            <div className="row g-4 mb-4">
              <div className="col-12">
                <RecentTrips
                  trips={tripsList}
                  fuelLogs={fuelLogsList}
                  maintenance={maintenanceList}
                  drivers={driversList}
                />
              </div>
            </div>

            {/* CSV Data Export Center */}
            <div className="row g-4">
              <div className="col-12">
                <AnalyticsExport onExportCSV={handleExportCSV} onExportPDF={handleExportPDF} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
