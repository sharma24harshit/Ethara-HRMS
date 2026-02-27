import React, { useState, useEffect, useCallback } from 'react';
import { getAttendanceByEmployee } from '../services/api';
import Loader from './Loader';
import getTodayDate from '../utils/getTodayDate';

const getCurrentMonth = () => getTodayDate().slice(0, 7);
const EMPTY_FILTERS   = { date: '', month: '', status: '' };

const inputCls =
  'bg-surface border border-line rounded-md text-t1 font-body text-[13px] ' +
  'px-2.5 py-1.5 outline-none transition-all duration-200 cursor-pointer ' +
  'focus:border-accent focus:ring-2 focus:ring-accent/20';

const AttendanceHistory = ({ employee, onClose }) => {
  const [allRecords, setAllRecords] = useState([]);
  const [records,    setRecords]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [filters,    setFilters]    = useState(EMPTY_FILTERS);

  const fetchRecords = useCallback(async (activeFilters) => {
    setLoading(true); setError('');
    try {
      const res = await getAttendanceByEmployee(employee.employeeId, {
        month: activeFilters.month || undefined,
      });
      setAllRecords(res.data.data);
    } catch {
      setError('Failed to load attendance history.');
    } finally {
      setLoading(false);
    }
  }, [employee.employeeId]);

  useEffect(() => { fetchRecords(filters); }, [fetchRecords]); // eslint-disable-line

  useEffect(() => {
    let result = [...allRecords];
    if (filters.date)   result = result.filter((r) => r.date === filters.date);
    if (filters.status) result = result.filter((r) => r.status === filters.status);
    setRecords(result);
  }, [allRecords, filters.date, filters.status]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const next = { ...filters, [name]: value };
    if (name === 'date'  && value) next.month = '';
    if (name === 'month' && value) next.date  = '';
    setFilters(next);
    if (name === 'month') fetchRecords(next);
  };

  const clearFilters = () => { setFilters(EMPTY_FILTERS); fetchRecords(EMPTY_FILTERS); };

  const hasActiveFilters = filters.date || filters.month || filters.status;
  const presentCount     = records.filter((r) => r.status === 'Present').length;
  const absentCount      = records.filter((r) => r.status === 'Absent').length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5
                 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-surface border border-line rounded-2xl w-full max-w-[680px]
                      max-h-[80vh] flex flex-col shadow-modal animate-slide-up">

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-7 pt-6 pb-5 border-b border-line">
          <div>
            <h2 className="font-display font-bold text-[18px] text-t1">Attendance History</h2>
            <p className="text-[13px] text-t2 mt-1 flex items-center gap-2">
              {employee.fullName}
              <span className="text-t3">·</span>
              <span className="bg-elevated border border-line rounded px-2 py-0.5
                               font-mono text-[11px] text-accent">
                {employee.employeeId}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-elevated border border-line
                       rounded-md text-t2 text-sm transition-all hover:bg-rose/10
                       hover:border-rose/30 hover:text-rose"
            aria-label="Close"
          >✕</button>
        </div>

        {/* ── Filter Bar ── */}
        <div className="flex items-end gap-3 flex-wrap px-7 py-3.5 bg-elevated border-b border-line">
          <div className="flex flex-col gap-1">
            <label htmlFor="hist-date"
              className="text-[10px] font-semibold uppercase tracking-widest text-t3">
              Exact Date
            </label>
            <input id="hist-date" name="date" type="date"
              value={filters.date} max={getTodayDate()}
              onChange={handleFilterChange} className={inputCls} />
          </div>

          <span className="text-[11px] italic text-t3 pb-2">or</span>

          <div className="flex flex-col gap-1">
            <label htmlFor="hist-month"
              className="text-[10px] font-semibold uppercase tracking-widest text-t3">
              Month
            </label>
            <input id="hist-month" name="month" type="month"
              value={filters.month} max={getCurrentMonth()}
              onChange={handleFilterChange} className={inputCls} />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="hist-status"
              className="text-[10px] font-semibold uppercase tracking-widest text-t3">
              Status
            </label>
            <select id="hist-status" name="status"
              value={filters.status} onChange={handleFilterChange}
              className={inputCls}>
              <option value="">All</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mb-0 flex items-center gap-1.5 px-3 py-1.5 bg-rose/10 border
                         border-rose/20 rounded-md text-rose text-[12px] font-semibold
                         transition-all hover:bg-rose/20 whitespace-nowrap self-end"
            >✕ Clear</button>
          )}
        </div>

        {/* ── Summary Chips ── */}
        {!loading && !error && allRecords.length > 0 && (
          <div className="flex gap-2.5 flex-wrap px-7 py-3 border-b border-line">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-jade/10 border
                             border-jade/20 rounded-full text-jade text-[12px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-jade inline-block" />
              Present: <strong>{presentCount}</strong>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-rose/10 border
                             border-rose/20 rounded-full text-rose text-[12px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-rose inline-block" />
              Absent: <strong>{absentCount}</strong>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-accent/10 border
                             border-accent/20 rounded-full text-accent text-[12px] font-medium">
              Showing: <strong>{records.length}</strong>
            </span>
          </div>
        )}

        {/* ── Body ── */}
        <div className="overflow-y-auto flex-1 px-7 py-5">
          {loading && <Loader text="Loading history…" />}
          {error   && (
            <div className="bg-rose/10 border border-rose/20 text-rose text-sm
                            rounded-lg px-4 py-2.5">{error}</div>
          )}

          {!loading && !error && records.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-t3">
              <span className="text-4xl mb-3 opacity-40">📋</span>
              <p className="text-sm">
                {hasActiveFilters
                  ? 'No records match the applied filters.'
                  : 'No attendance records found.'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-5 py-2 bg-accent hover:bg-accent-h text-white text-sm
                             font-semibold rounded-lg transition-colors"
                >Clear Filters</button>
              )}
            </div>
          )}

          {!loading && !error && records.length > 0 && (
            <table className="w-full text-[13.5px] border-collapse">
              <thead>
                <tr>
                  {['#', 'Date', 'Status'].map((h) => (
                    <th key={h} className="text-left text-[11px] font-bold uppercase
                                           tracking-widest text-t3 pb-2.5 border-b
                                           border-line px-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((r, idx) => (
                  <tr key={`${r.date}-${r.status}`}
                    className="border-b border-line/50 last:border-0 hover:bg-hover transition-colors">
                    <td className="px-3 py-3 text-t3 text-[12px]">{idx + 1}</td>
                    <td className="px-3 py-3 text-t2">{r.date}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full
                                        text-[12px] font-semibold border
                                        ${r.status === 'Present'
                                          ? 'bg-jade/10 border-jade/20 text-jade'
                                          : 'bg-rose/10 border-rose/20 text-rose'}`}>
                        {r.status}
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