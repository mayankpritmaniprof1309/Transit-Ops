import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChartBar, FaGasPump, FaMoneyBillWave, FaCar,
  FaSync, FaExclamationTriangle, FaRoute, FaWrench,
} from 'react-icons/fa';
import {
  getDashboardReport,
  getFuelEfficiencyReport,
  getOperationalCostReport,
  getVehicleROIReport,
  exportCSV,
} from '../../services/report.service.js';
import { getAllVehicles } from '../../services/vehicle.service.js';
import ReportCard from '../../components/reports/ReportCard.jsx';
import ReportFilter from '../../components/reports/ReportFilter.jsx';
import ExportButton from '../../components/reports/ExportButton.jsx';

/* ─────────────────────────────────────────────────────────────
   Inline pure-CSS bar chart — no external chart dependency
   ──────────────────────────────────────────────────────────── */
const SimpleBarChart = ({ data = [], color = '#2563eb', unit = '' }) => {
  if (!data.length) return (
    <p className="text-muted text-small mt-3 mb-0">No data available for this period.</p>
  );
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="d-flex align-items-flex-end gap-1 mt-3" style={{ height: '130px' }}>
      {data.map((item, idx) => (
        <div
          key={idx}
          className="d-flex flex-column align-items-center flex-grow-1"
          style={{ height: '100%', minWidth: 0 }}
        >
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%' }}>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max((item.value / max) * 100, 4)}%` }}
              transition={{ duration: 0.55, delay: idx * 0.06 }}
              title={`${item.label}: ${item.value}${unit ? ' ' + unit : ''}`}
              style={{
                width: '100%',
                background: `${color}cc`,
                borderRadius: '6px 6px 0 0',
                cursor: 'default',
              }}
            />
          </div>
          <span
            className="text-muted mt-1"
            style={{
              fontSize: '0.62rem', textAlign: 'center', lineHeight: '1.2',
              maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Compact breakdown table
   ──────────────────────────────────────────────────────────── */
const BreakdownTable = ({ rows = [], columns = [] }) => {
  if (!rows.length) return <p className="text-muted text-small mt-3 mb-0">No records found.</p>;
  return (
    <div className="table-responsive mt-3">
      <table className="table table-sm table-hover mb-0" style={{ fontSize: '0.82rem' }}>
        <thead className="table-light">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="fw-semibold text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.04em', color: '#64748B' }}>
                {c.label}
              </th>
            ))}
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

/* ─────────────────────────────────────────────────────────────
   Skeleton block helper
   ──────────────────────────────────────────────────────────── */
const SkeletonCard = ({ height = '4rem' }) => (
  <div className="card-solid p-4">
    <div className="skeleton-shimmer skeleton-box w-25 mb-3" style={{ height: '0.8rem' }} />
    <div className="skeleton-shimmer skeleton-box w-50 mb-2" style={{ height: height }} />
    <div className="skeleton-shimmer skeleton-box w-75" style={{ height: '0.8rem' }} />
  </div>
);

/* ─────────────────────────────────────────────────────────────
   Main Reports Page
   ──────────────────────────────────────────────────────────── */
export const Reports = () => {
  // Filters
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Data state
  const [vehicles, setVehicles] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [fuelData, setFuelData] = useState(null);
  const [costData, setCostData] = useState(null);
  const [roiData, setRoiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load vehicle list for filter dropdown
  useEffect(() => {
    getAllVehicles()
      .then((res) => { if (res.success) setVehicles(res.data || []); })
      .catch(() => {});
  }, []);

  // Build params for report API calls
  const buildParams = useCallback(() => {
    const p = {};
    if (dateFrom) p.startDate = dateFrom;
    if (dateTo)   p.endDate   = dateTo;
    if (selectedVehicle) p.vehicleId = selectedVehicle;
    return p;
  }, [dateFrom, dateTo, selectedVehicle]);

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError('');
    const params = buildParams();

    try {
      // Fire all 4 report endpoints in parallel; tolerate individual failures
      const [dashRes, fuelRes, costRes, roiRes] = await Promise.allSettled([
        getDashboardReport(params),
        getFuelEfficiencyReport(params),
        getOperationalCostReport(params),
        getVehicleROIReport(params),
      ]);

      if (dashRes.status === 'fulfilled') setDashboardData(dashRes.value?.data ?? dashRes.value ?? null);
      if (fuelRes.status === 'fulfilled') setFuelData(fuelRes.value?.data ?? fuelRes.value ?? null);
      if (costRes.status === 'fulfilled') setCostData(costRes.value?.data ?? costRes.value ?? null);
      if (roiRes.status  === 'fulfilled') setRoiData(roiRes.value?.data  ?? roiRes.value  ?? null);

      // If ALL failed, show error banner
      const allFailed = [dashRes, fuelRes, costRes, roiRes].every(r => r.status === 'rejected');
      if (allFailed) {
        setError('Could not load report data. Make sure the backend server is running.');
      }
    } catch (err) {
      console.error(err);
      setError('Unexpected error while loading reports.');
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  useEffect(() => { loadReports(); }, [loadReports]);

  /* ── Derived display values from real API response ── */

  // Dashboard KPIs
  const kpi = dashboardData?.summary ?? dashboardData ?? {};
  const totalVehicles  = kpi.totalVehicles  ?? kpi.vehicles  ?? '—';
  const activeTrips    = kpi.activeTrips    ?? kpi.ongoingTrips ?? '—';
  const totalExpenses  = kpi.totalExpenses  ?? kpi.expenses  ?? null;
  const totalFuelCost  = kpi.totalFuelCost  ?? kpi.fuelCost  ?? null;

  // Fuel efficiency chart data — array of { vehicle, efficiency, totalFuel, totalDistance }
  const fuelRows = Array.isArray(fuelData) ? fuelData
    : Array.isArray(fuelData?.records) ? fuelData.records
    : [];
  const fuelChartData = fuelRows.slice(0, 10).map((r) => ({
    label: r.vehicle?.registrationNumber || r.vehicle?.vehicleName || r.vehicleName || '—',
    value: Number(r.totalFuel ?? r.fuelUsed ?? r.quantity ?? 0),
  }));

  // Operational cost chart data — array of { vehicle, totalCost, fuelCost, maintenanceCost, expenseCost }
  const costRows = Array.isArray(costData) ? costData
    : Array.isArray(costData?.records) ? costData.records
    : [];
  const costChartData = costRows.slice(0, 10).map((r) => ({
    label: r.vehicle?.registrationNumber || r.vehicle?.vehicleName || r.vehicleName || '—',
    value: Number(r.totalCost ?? r.cost ?? 0),
  }));

  // ROI table rows — array of { vehicle, revenue, totalCost, roi }
  const roiRows = Array.isArray(roiData) ? roiData
    : Array.isArray(roiData?.records) ? roiData.records
    : [];

  // Recent fuel table
  const fuelTableRows = fuelRows.slice(0, 8).map((r) => ({
    vehicle: r.vehicle?.registrationNumber || r.vehicle?.vehicleName || r.vehicleName || '—',
    fuel: `${Number(r.totalFuel ?? r.fuelUsed ?? 0).toLocaleString()} L`,
    distance: `${Number(r.totalDistance ?? r.distance ?? 0).toLocaleString()} km`,
    efficiency: r.efficiency ? `${Number(r.efficiency).toFixed(2)} km/L` : '—',
    trips: r.tripCount ?? r.trips ?? '—',
  }));

  // Operational cost table
  const costTableRows = costRows.slice(0, 8).map((r) => ({
    vehicle: r.vehicle?.registrationNumber || r.vehicle?.vehicleName || r.vehicleName || '—',
    total: `$${Number(r.totalCost ?? r.cost ?? 0).toLocaleString()}`,
    fuel: r.fuelCost != null ? `$${Number(r.fuelCost).toLocaleString()}` : '—',
    maintenance: r.maintenanceCost != null ? `$${Number(r.maintenanceCost).toLocaleString()}` : '—',
    expenses: r.expenseCost != null ? `$${Number(r.expenseCost).toLocaleString()}` : '—',
  }));

  // ROI table
  const roiTableRows = roiRows.slice(0, 8).map((r) => ({
    vehicle: r.vehicle?.registrationNumber || r.vehicle?.vehicleName || r.vehicleName || '—',
    revenue: r.revenue != null ? `$${Number(r.revenue).toLocaleString()}` : '—',
    cost: `$${Number(r.totalCost ?? r.cost ?? 0).toLocaleString()}`,
    roi: r.roi != null ? `${Number(r.roi).toFixed(1)}%` : '—',
  }));

  const exportParams = {
    startDate: dateFrom || undefined,
    endDate: dateTo || undefined,
    vehicleId: selectedVehicle || undefined,
  };

  const clearFilters = () => {
    setDateFrom(''); setDateTo(''); setSelectedVehicle(''); setSelectedType('all');
  };

  /* ── Show sections based on type filter ── */
  const showFuel    = selectedType === 'all' || selectedType === 'fuel';
  const showExpense = selectedType === 'all' || selectedType === 'expenses';

  return (
    <div className="container-fluid py-4 px-md-4">

      {/* ── Page Header ── */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div>
          <h1 className="mb-1 text-dark d-flex align-items-center gap-2" style={{ fontSize: '1.6rem' }}>
            <FaChartBar className="text-primary" /> Fleet Reports
          </h1>
          <p className="text-muted mb-0">Fleet performance, cost analytics, and operational summaries.</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <button
            onClick={loadReports}
            className="btn-custom btn-secondary-custom py-2 px-3"
            disabled={loading}
          >
            <FaSync className={`me-1 ${loading ? 'fa-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <ExportButton type="csv" params={{ ...exportParams, type: 'fuel' }}     label="Export Fuel CSV"    filename="fuel-report" />
          <ExportButton type="csv" params={{ ...exportParams, type: 'expenses' }} label="Export Expense CSV" filename="expense-report" variant="success" />
        </div>
      </div>

      {/* ── Filters ── */}
      <ReportFilter
        dateFrom={dateFrom}         onDateFromChange={setDateFrom}
        dateTo={dateTo}             onDateToChange={setDateTo}
        selectedVehicle={selectedVehicle} onVehicleChange={setSelectedVehicle}
        vehicles={vehicles}
        selectedType={selectedType} onTypeChange={setSelectedType}
        onClearFilters={clearFilters}
      />

      {/* ── Error Banner ── */}
      {error && (
        <div className="alert alert-danger border-0 rounded-3 mb-4 shadow-sm d-flex align-items-center gap-2" role="alert">
          <FaExclamationTriangle /> {error}
        </div>
      )}

      {/* ── Loading State ── */}
      {loading ? (
        <>
          <div className="row g-3 mb-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="col-6 col-lg-3"><SkeletonCard height="2.5rem" /></div>
            ))}
          </div>
          <div className="row g-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="col-md-6"><SkeletonCard height="8rem" /></div>
            ))}
          </div>
        </>
      ) : (
        <AnimatePresence>
          {/* ── KPI Summary Cards ── */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-lg-3">
              <ReportCard
                title="Total Vehicles"
                value={totalVehicles}
                subtitle="Fleet size"
                icon={<FaCar />}
                accentColor="#16a34a"
                delay={0}
              />
            </div>

            <div className="col-6 col-lg-3">
              <ReportCard
                title="Active Trips"
                value={activeTrips}
                subtitle="Currently on-road"
                icon={<FaRoute />}
                accentColor="#2563EB"
                delay={0.06}
              />
            </div>

            {totalFuelCost != null && showFuel && (
              <div className="col-6 col-lg-3">
                <ReportCard
                  title="Total Fuel Cost"
                  value={`$${Number(totalFuelCost).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                  subtitle="Aggregate spend"
                  icon={<FaGasPump />}
                  accentColor="#0891b2"
                  badge={fuelRows.length ? `${fuelRows.length} vehicles` : undefined}
                  badgeVariant="info"
                  delay={0.1}
                />
              </div>
            )}

            {totalExpenses != null && showExpense && (
              <div className="col-6 col-lg-3">
                <ReportCard
                  title="Total Expenses"
                  value={`$${Number(totalExpenses).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                  subtitle="Operational costs"
                  icon={<FaMoneyBillWave />}
                  accentColor="#dc2626"
                  badge={costRows.length ? `${costRows.length} vehicles` : undefined}
                  badgeVariant="danger"
                  delay={0.14}
                />
              </div>
            )}
          </div>

          {/* ── Charts Row ── */}
          <div className="row g-3 mb-4">
            {showFuel && fuelChartData.length > 0 && (
              <div className="col-12 col-md-6">
                <motion.div className="card-solid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <FaGasPump className="text-primary" />
                    <h5 className="mb-0 fw-semibold">Fuel Consumption by Vehicle</h5>
                  </div>
                  <p className="text-muted text-small mb-0">Total litres consumed per vehicle</p>
                  <SimpleBarChart data={fuelChartData} color="#2563EB" unit="L" />
                  <div className="d-flex flex-wrap gap-2 mt-3 pt-2 border-top">
                    {fuelChartData.slice(0, 5).map((d, i) => (
                      <span key={i} className="badge bg-light text-dark border text-small">
                        {d.label}: {Number(d.value).toLocaleString()} L
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {showExpense && costChartData.length > 0 && (
              <div className="col-12 col-md-6">
                <motion.div className="card-solid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <FaMoneyBillWave className="text-danger" />
                    <h5 className="mb-0 fw-semibold">Operational Cost by Vehicle</h5>
                  </div>
                  <p className="text-muted text-small mb-0">Total cost per vehicle (fuel + maintenance + expenses)</p>
                  <SimpleBarChart data={costChartData} color="#dc2626" unit="$" />
                  <div className="d-flex flex-wrap gap-2 mt-3 pt-2 border-top">
                    {costChartData.slice(0, 5).map((d, i) => (
                      <span key={i} className="badge bg-light text-dark border text-small">
                        {d.label}: ${Number(d.value).toLocaleString()}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {/* Placeholder if no chart data */}
            {!fuelChartData.length && !costChartData.length && !loading && (
              <div className="col-12">
                <div className="card-solid text-center py-5">
                  <div className="mb-3 text-muted" style={{ fontSize: '2.5rem' }}>📊</div>
                  <h5 className="text-muted fw-semibold">No Chart Data</h5>
                  <p className="text-muted text-small mb-0">
                    Report data may be empty for the selected period, or the backend returned no records.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Data Tables ── */}
          <div className="row g-3">
            {showFuel && fuelTableRows.length > 0 && (
              <div className="col-12 col-xl-6">
                <motion.div className="card-solid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0 fw-semibold d-flex align-items-center gap-2">
                      <FaGasPump className="text-primary" /> Fuel Efficiency
                    </h5>
                    <ExportButton type="csv" params={{ ...exportParams, type: 'fuel' }} label="CSV" filename="fuel-report" />
                  </div>
                  <BreakdownTable
                    rows={fuelTableRows}
                    columns={[
                      { key: 'vehicle', label: 'Vehicle' },
                      { key: 'fuel', label: 'Fuel' },
                      { key: 'distance', label: 'Distance' },
                      { key: 'efficiency', label: 'Efficiency' },
                      { key: 'trips', label: 'Trips' },
                    ]}
                  />
                </motion.div>
              </div>
            )}

            {showExpense && costTableRows.length > 0 && (
              <div className="col-12 col-xl-6">
                <motion.div className="card-solid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0 fw-semibold d-flex align-items-center gap-2">
                      <FaWrench className="text-warning" /> Operational Costs
                    </h5>
                    <ExportButton type="csv" params={{ ...exportParams, type: 'expenses' }} label="CSV" filename="expense-report" variant="success" />
                  </div>
                  <BreakdownTable
                    rows={costTableRows}
                    columns={[
                      { key: 'vehicle', label: 'Vehicle' },
                      { key: 'total', label: 'Total' },
                      { key: 'fuel', label: 'Fuel' },
                      { key: 'maintenance', label: 'Maintenance' },
                      { key: 'expenses', label: 'Expenses' },
                    ]}
                  />
                </motion.div>
              </div>
            )}

            {roiTableRows.length > 0 && selectedType !== 'fuel' && (
              <div className="col-12">
                <motion.div className="card-solid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <h5 className="mb-2 fw-semibold d-flex align-items-center gap-2">
                    <FaCar className="text-success" /> Vehicle ROI Analysis
                  </h5>
                  <BreakdownTable
                    rows={roiTableRows}
                    columns={[
                      { key: 'vehicle', label: 'Vehicle' },
                      { key: 'revenue', label: 'Revenue' },
                      { key: 'cost', label: 'Total Cost' },
                      { key: 'roi', label: 'ROI' },
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
