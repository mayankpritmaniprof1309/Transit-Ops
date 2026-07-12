import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChartBar, FaGasPump, FaMoneyBillWave, FaCar,
  FaSync, FaExclamationTriangle,
} from 'react-icons/fa';
import { getAllExpenses } from '../../services/expense.service.js';
import { getAllFuelLogs } from '../../services/fuel.service.js';
import { getAllVehicles } from '../../services/vehicle.service.js';
import ReportCard from '../../components/reports/ReportCard.jsx';
import ReportFilter from '../../components/reports/ReportFilter.jsx';
import ExportButton from '../../components/reports/ExportButton.jsx';

/* ────────────────────────────────────────────────────────────
   Tiny bar chart rendered in pure CSS — no external chart dep
   ──────────────────────────────────────────────────────────── */
const SimpleBarChart = ({ data = [], label = 'Amount', color = '#2563eb' }) => {
  if (!data.length) return null;
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="d-flex align-items-flex-end gap-2 mt-3" style={{ height: '140px' }}>
      {data.map((item, idx) => (
        <div key={idx} className="d-flex flex-column align-items-center flex-grow-1" style={{ height: '100%' }}>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'flex-end',
              width: '100%',
            }}
          >
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / max) * 100}%` }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              style={{
                width: '100%',
                background: `${color}cc`,
                borderRadius: '6px 6px 0 0',
                cursor: 'default',
                position: 'relative',
              }}
              title={`${item.label}: ${item.value}`}
            />
          </div>
          <span
            className="text-muted mt-1"
            style={{ fontSize: '0.65rem', textAlign: 'center', lineHeight: '1.2', maxWidth: '60px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   Small breakdown table
   ──────────────────────────────────────────────────────────── */
const BreakdownTable = ({ rows = [], columns = [] }) => {
  if (!rows.length) return <p className="text-muted text-small mt-3">No data available.</p>;
  return (
    <div className="table-responsive mt-3">
      <table className="table table-sm table-hover" style={{ fontSize: '0.82rem' }}>
        <thead className="table-light">
          <tr>
            {columns.map((c) => <th key={c.key}>{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {columns.map((c) => (
                <td key={c.key}>{row[c.key] ?? '—'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   Main Reports Page
   ──────────────────────────────────────────────────────────── */
export const Reports = () => {
  // Filter state
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Data state
  const [vehicles, setVehicles] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load vehicles for filter
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const res = await getAllVehicles();
        if (res.success) setVehicles(res.data || []);
      } catch (e) {
        console.error('Failed to load vehicles for reports filter', e);
      }
    };
    loadVehicles();
  }, []);

  // Fetch report data
  const loadReportData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params = { limit: 500 };
      if (selectedVehicle) params.vehicle = selectedVehicle;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const results = await Promise.allSettled([
        selectedType !== 'fuel' ? getAllExpenses(params) : Promise.resolve({ success: true, data: [] }),
        selectedType !== 'expenses' ? getAllFuelLogs(params) : Promise.resolve({ success: true, data: [] }),
      ]);

      const expRes = results[0];
      const fuelRes = results[1];

      setExpenses(expRes.status === 'fulfilled' && expRes.value.success ? expRes.value.data || [] : []);
      setFuelLogs(fuelRes.status === 'fulfilled' && fuelRes.value.success ? fuelRes.value.data || [] : []);

      if (expRes.status === 'rejected' && fuelRes.status === 'rejected') {
        setError('Failed to load report data. Please check your connection.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load report data.');
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo, selectedVehicle, selectedType]);

  useEffect(() => {
    loadReportData();
  }, [loadReportData]);

  /* ── Derived Metrics ── */

  // Total expense amount
  const totalExpenseAmount = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  // Total fuel cost + quantity
  const totalFuelCost = fuelLogs.reduce((sum, f) => sum + (Number(f.fuelCost) || 0), 0);
  const totalFuelQty = fuelLogs.reduce((sum, f) => sum + (Number(f.fuelQuantity) || 0), 0);

  // Unique vehicles across both datasets
  const uniqueVehicleIds = new Set([
    ...expenses.map((e) => e.vehicle?._id).filter(Boolean),
    ...fuelLogs.map((f) => f.vehicle?._id).filter(Boolean),
  ]);

  // Expense by category for bar chart
  const EXPENSE_TYPES = ['Fuel', 'Maintenance', 'Toll', 'Insurance', 'Repair', 'Other'];
  const expenseByCategory = EXPENSE_TYPES.map((type) => ({
    label: type,
    value: expenses
      .filter((e) => e.expenseType === type)
      .reduce((s, e) => s + (Number(e.amount) || 0), 0),
  })).filter((d) => d.value > 0);

  // Fuel by vehicle (top 8)
  const fuelByVehicle = Object.values(
    fuelLogs.reduce((acc, f) => {
      const id = f.vehicle?._id || 'unknown';
      const name = f.vehicle?.vehicleName || f.vehicle?.registrationNumber || 'Unknown';
      if (!acc[id]) acc[id] = { label: name, value: 0 };
      acc[id].value += Number(f.fuelQuantity) || 0;
      return acc;
    }, {})
  ).slice(0, 8);

  // Recent expense rows
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate))
    .slice(0, 8)
    .map((e) => ({
      vehicle: e.vehicle?.vehicleName || e.vehicle?.registrationNumber || '—',
      type: e.expenseType || '—',
      amount: `$${(Number(e.amount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      date: e.expenseDate ? new Date(e.expenseDate).toLocaleDateString() : '—',
      payment: e.paymentMethod || '—',
    }));

  // Recent fuel rows
  const recentFuel = [...fuelLogs]
    .sort((a, b) => new Date(b.fuelDate) - new Date(a.fuelDate))
    .slice(0, 8)
    .map((f) => ({
      vehicle: f.vehicle?.vehicleName || f.vehicle?.registrationNumber || '—',
      qty: `${Number(f.fuelQuantity) || 0} L`,
      cost: `$${(Number(f.fuelCost) || 0).toLocaleString()}`,
      date: f.fuelDate ? new Date(f.fuelDate).toLocaleDateString() : '—',
      station: f.fuelStation || '—',
    }));

  const exportParams = { dateFrom, dateTo, vehicle: selectedVehicle };
  const hasFilters = dateFrom || dateTo || selectedVehicle || (selectedType && selectedType !== 'all');

  return (
    <div className="container-fluid py-4 px-md-4">
      {/* ── Header ── */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div>
          <h1 className="mb-1 text-dark d-flex align-items-center gap-2">
            <FaChartBar className="text-primary" /> Fleet Reports
          </h1>
          <p className="text-muted mb-0">Fleet performance, cost analytics, and operational summaries.</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <button
            onClick={loadReportData}
            className="btn-custom btn-secondary-custom py-2 px-3"
            disabled={loading}
          >
            <FaSync className={loading ? 'fa-spin me-1' : 'me-1'} /> Refresh
          </button>
          <ExportButton type="csv-expenses" params={exportParams} label="Export Expenses CSV" filename="expenses-report" />
          <ExportButton type="csv-fuel" params={exportParams} label="Export Fuel CSV" filename="fuel-report" variant="success" />
        </div>
      </div>

      {/* ── Filters ── */}
      <ReportFilter
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        selectedVehicle={selectedVehicle}
        onVehicleChange={setSelectedVehicle}
        vehicles={vehicles}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        onClearFilters={() => { setDateFrom(''); setDateTo(''); setSelectedVehicle(''); setSelectedType('all'); }}
      />

      {/* ── Error Banner ── */}
      {error && (
        <div className="alert alert-danger border-0 rounded-3 mb-4 shadow-sm d-flex align-items-center gap-2" role="alert">
          <FaExclamationTriangle /> {error}
        </div>
      )}

      {/* ── Loading Skeletons ── */}
      {loading ? (
        <>
          <div className="row g-3 mb-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="col-6 col-lg-3">
                <div className="card-solid p-4">
                  <div className="skeleton-shimmer skeleton-box w-50 mb-3" style={{ height: '2.5rem' }}></div>
                  <div className="skeleton-shimmer skeleton-box w-75 mb-2"></div>
                  <div className="skeleton-shimmer skeleton-box w-50"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="row g-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="col-md-6">
                <div className="card-solid p-4" style={{ height: '260px' }}>
                  <div className="skeleton-shimmer skeleton-box w-50 mb-4" style={{ height: '1.2rem' }}></div>
                  <div className="skeleton-shimmer skeleton-box w-100" style={{ height: '160px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <AnimatePresence>
          {/* ── Summary Metric Cards ── */}
          <div className="row g-3 mb-4">
            {selectedType !== 'fuel' && (
              <div className="col-6 col-lg-3">
                <ReportCard
                  title="Total Expenses"
                  value={`$${totalExpenseAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                  subtitle={`${expenses.length} records`}
                  icon={<FaMoneyBillWave />}
                  accentColor="#dc2626"
                  badge={`${expenses.length} logs`}
                  badgeVariant="danger"
                  delay={0}
                />
              </div>
            )}
            {selectedType !== 'expenses' && (
              <>
                <div className="col-6 col-lg-3">
                  <ReportCard
                    title="Total Fuel Cost"
                    value={`$${totalFuelCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    subtitle={`${fuelLogs.length} fill-ups`}
                    icon={<FaGasPump />}
                    accentColor="#2563eb"
                    badge={`${fuelLogs.length} logs`}
                    badgeVariant="info"
                    delay={0.05}
                  />
                </div>
                <div className="col-6 col-lg-3">
                  <ReportCard
                    title="Total Fuel Volume"
                    value={`${totalFuelQty.toLocaleString()} L`}
                    subtitle="Aggregate litres consumed"
                    icon={<FaGasPump />}
                    accentColor="#0891b2"
                    delay={0.1}
                  />
                </div>
              </>
            )}
            <div className="col-6 col-lg-3">
              <ReportCard
                title="Active Vehicles"
                value={uniqueVehicleIds.size}
                subtitle="Vehicles with activity"
                icon={<FaCar />}
                accentColor="#16a34a"
                delay={0.15}
              />
            </div>
          </div>

          {/* ── Charts Row ── */}
          <div className="row g-3 mb-4">
            {selectedType !== 'fuel' && expenseByCategory.length > 0 && (
              <div className="col-md-6">
                <motion.div
                  className="card-solid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h5 className="mb-0 fw-semibold">Expense by Category</h5>
                  <p className="text-muted text-small mb-0">Total spend breakdown by type</p>
                  <SimpleBarChart data={expenseByCategory} color="#dc2626" />
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {expenseByCategory.map((d, i) => (
                      <span key={i} className="badge bg-light text-dark border text-small">
                        {d.label}: ${d.value.toLocaleString()}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {selectedType !== 'expenses' && fuelByVehicle.length > 0 && (
              <div className="col-md-6">
                <motion.div
                  className="card-solid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <h5 className="mb-0 fw-semibold">Fuel Usage by Vehicle</h5>
                  <p className="text-muted text-small mb-0">Litres consumed per vehicle</p>
                  <SimpleBarChart data={fuelByVehicle} color="#2563eb" />
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {fuelByVehicle.map((d, i) => (
                      <span key={i} className="badge bg-light text-dark border text-small">
                        {d.label}: {d.value.toLocaleString()} L
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
          </div>

          {/* ── Recent Activity Tables ── */}
          <div className="row g-3">
            {selectedType !== 'fuel' && (
              <div className="col-12 col-xl-6">
                <motion.div
                  className="card-solid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h5 className="mb-0 fw-semibold">Recent Expenses</h5>
                    <ExportButton
                      type="csv-expenses"
                      params={exportParams}
                      label="CSV"
                      filename="expenses-report"
                    />
                  </div>
                  <BreakdownTable
                    rows={recentExpenses}
                    columns={[
                      { key: 'vehicle', label: 'Vehicle' },
                      { key: 'type', label: 'Type' },
                      { key: 'amount', label: 'Amount' },
                      { key: 'payment', label: 'Payment' },
                      { key: 'date', label: 'Date' },
                    ]}
                  />
                </motion.div>
              </div>
            )}

            {selectedType !== 'expenses' && (
              <div className="col-12 col-xl-6">
                <motion.div
                  className="card-solid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h5 className="mb-0 fw-semibold">Recent Fuel Logs</h5>
                    <ExportButton
                      type="csv-fuel"
                      params={exportParams}
                      label="CSV"
                      filename="fuel-report"
                      variant="success"
                    />
                  </div>
                  <BreakdownTable
                    rows={recentFuel}
                    columns={[
                      { key: 'vehicle', label: 'Vehicle' },
                      { key: 'qty', label: 'Qty' },
                      { key: 'cost', label: 'Cost' },
                      { key: 'station', label: 'Station' },
                      { key: 'date', label: 'Date' },
                    ]}
                  />
                </motion.div>
              </div>
            )}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default Reports;
