import React, { useState, useEffect, useCallback } from 'react';
import { getAttendanceByEmployee } from '../services/api';
import Loader from './Loader';
import getTodayDate from '../utils/getTodayDate';

// Derive current month string "YYYY-MM" from today
const getCurrentMonth = () => getTodayDate().slice(0, 7);

const EMPTY_FILTERS = { date: '', month: '', status: '' };

const AttendanceHistory = ({ employee, onClose }) => {
  const [allRecords, setAllRecords] = useState([]);   // unfiltered raw list
  const [records, setRecords]       = useState([]);   // filtered display list
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [filters, setFilters]       = useState(EMPTY_FILTERS);

  // Fetch from API — re-fetch when month filter changes (server-side)
  // date/status filters are applied client-side for snappy UX
  const fetchRecords = useCallback(async (activeFilters) => {
    setLoading(true);
    setError('');
    try {
      const res = await getAttendanceByEmployee(employee.employeeId, {
        month: activeFilters.month || undefined,
      });
      setAllRecords(res.data.data);
    } catch (err) {
      setError('Failed to load attendance history.');
    } finally {
      setLoading(false);
    }
  }, [employee.employeeId]);

  useEffect(() => { fetchRecords(filters); }, [fetchRecords]); // eslint-disable-line

  // Apply client-side date / status filters on allRecords
  useEffect(() => {
    let result = [...allRecords];
    if (filters.date)   result = result.filter((r) => r.date === filters.date);
    if (filters.status) result = result.filter((r) => r.status === filters.status);
    setRecords(result);
  }, [allRecords, filters.date, filters.status]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const next = { ...filters, [name]: value };

    // date and month are mutually exclusive
    if (name === 'date'  && value) next.month = '';
    if (name === 'month' && value) next.date  = '';

    setFilters(next);

    // Re-fetch from server only when month changes
    if (name === 'month') fetchRecords(next);
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    fetchRecords(EMPTY_FILTERS);
  };

  const hasActiveFilters = filters.date || filters.month || filters.status;

  const presentCount = records.filter((r) => r.status === 'Present').length;
  const absentCount  = records.filter((r) => r.status === 'Absent').length;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal modal--history">
        {/* ── Header ── */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Attendance History</h2>
            <p className="modal-subtitle">
              {employee.fullName}&nbsp;&middot;&nbsp;
              <span className="emp-id-badge">{employee.employeeId}</span>
            </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">&#x2715;</button>
        </div>

        {/* ── Filter Bar ── */}
        <div className="filter-bar">
          <div className="filter-group">
            <label htmlFor="hist-date">Exact Date</label>
            <input
              id="hist-date"
              name="date"
              type="date"
              value={filters.date}
              max={getTodayDate()}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-sep">or</div>
          <div className="filter-group">
            <label htmlFor="hist-month">Month</label>
            <input
              id="hist-month"
              name="month"
              type="month"
              value={filters.month}
              max={getCurrentMonth()}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="hist-status">Status</label>
            <select id="hist-status" name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          {hasActiveFilters && (
            <button className="btn-clear-filter" onClick={clearFilters} title="Clear all filters">
              ✕ Clear
            </button>
          )}
        </div>

        {/* ── Summary Chips ── */}
        {!loading && !error && allRecords.length > 0 && (
          <div className="history-stats">
            <div className="stat-chip stat-present">
              <span className="stat-dot" />Present: <strong>{presentCount}</strong>
            </div>
            <div className="stat-chip stat-absent">
              <span className="stat-dot" />Absent: <strong>{absentCount}</strong>
            </div>
            <div className="stat-chip stat-total">
              Showing: <strong>{records.length}</strong>
            </div>
          </div>
        )}

        {/* ── Body ── */}
        <div className="modal-body">
          {loading && <Loader text="Loading history…" />}
          {error   && <div className="alert alert-error">{error}</div>}

          {!loading && !error && records.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <p>{hasActiveFilters ? 'No records match the applied filters.' : 'No attendance records found.'}</p>
              {hasActiveFilters && (
                <button className="btn btn-primary" style={{ marginTop: 12, width: 'auto', padding: '8px 20px' }} onClick={clearFilters}>
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {!loading && !error && records.length > 0 && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, idx) => (
                  <tr key={`${record.date}-${record.status}`}>
                    <td className="row-num">{idx + 1}</td>
                    <td>{record.date}</td>
                    <td>
                      <span className={`status-badge ${record.status === 'Present' ? 'status-present' : 'status-absent'}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;