import React, { useState, useEffect, useCallback } from 'react';
import { deleteEmployee, markAttendance, getAttendanceByDate } from '../services/api';
import AttendanceHistory from './AttendanceHistory';
import Loader from './Loader';
import getTodayDate from '../utils/getTodayDate';
import { MdDelete } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";

/* ── Shared input style ── */
const inputCls =
  'bg-elevated border border-line rounded-lg text-t1 font-body text-[13px] font-medium ' +
  'px-3 py-1.5 outline-none transition-all duration-200 cursor-pointer ' +
  'focus:border-accent focus:ring-2 focus:ring-accent/20';

/* ── Thin action button ── */
const actionBtn = (extra = '') =>
  `inline-flex items-center gap-1 px-2.5 py-1 border border-line rounded-md
   bg-elevated text-t2 text-[12px] font-medium whitespace-nowrap
   transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${extra}`;

const EmployeeList = ({ employees, presentDaySummary = {}, loading, onRefresh }) => {
  const today = getTodayDate();

  const [selectedDate,   setSelectedDate] = useState(today);
  const [dateAttendance, setDateAtt]      = useState([]);
  const [attLoading,     setAttLoading]   = useState(false);
  const [historyEmp,     setHistoryEmp]   = useState(null);
  const [actionLoading,  setActionLoad]   = useState('');
  const [error,          setError]        = useState('');
  const [deleteTarget,   setDeleteTarget] = useState(null); // { employeeId, fullName }

  /* ── Fetch attendance for selected date ── */
  const fetchDateAttendance = useCallback(async (date) => {
    setAttLoading(true);
    try {
      const res = await getAttendanceByDate(date);
      setDateAtt(res.data.data);
    } catch { /* silent */ }
    finally { setAttLoading(false); }
  }, []);

  useEffect(() => { fetchDateAttendance(selectedDate); }, [selectedDate, fetchDateAttendance]);

  /* ── Helpers ── */
  const getStatus  = (id) => dateAttendance.find((r) => r.employeeId === id)?.status ?? null;
  const isToday    = selectedDate === today;
  const isFuture   = selectedDate > today;
  const dateLabel  = isToday ? "Today's Status" : `Status · ${selectedDate}`;

  /* ── Handlers ── */
  const handleDateChange = (e) => { setSelectedDate(e.target.value); setError(''); };

  const handleAttendance = async (employeeId, status) => {
    if (isFuture) return;
    setActionLoad(`${employeeId}-${status}`); setError('');
    try {
      await markAttendance({ employeeId, date: selectedDate, status });
      fetchDateAttendance(selectedDate);
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark attendance.');
    } finally { setActionLoad(''); }
  };

  const handleDelete = async (employeeId, fullName) => {
    setDeleteTarget({ employeeId, fullName });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { employeeId } = deleteTarget;
    setDeleteTarget(null);
    setActionLoad(`delete-${employeeId}`); setError('');
    try {
      await deleteEmployee(employeeId);
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete employee.');
    } finally { setActionLoad(''); }
  };

  /* ── Loading skeleton ── */
  if (loading) return (
    <div className="bg-surface border border-line rounded-2xl p-8">
      <Loader text="Loading employees…" />
    </div>
  );

  /* ── Main render ── */
  return (
    <div className="bg-surface border border-line rounded-2xl animate-fade-up">

      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-8 py-5
                      border-b border-line">
        {/* Left: title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center bg-elevated
                          border border-line rounded-md text-lg flex-shrink-0"><FaRegUser /></div>
          <h2 className="font-display font-bold text-[18px] text-t1">Employees</h2>
          <span className="bg-accent/10 border border-accent/20 text-accent text-[12px]
                           font-semibold rounded-full px-2.5 py-0.5 font-display">
            {employees.length}
          </span>
        </div>

        {/* Right: date toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex flex-col gap-1">
            <label htmlFor="att-date-picker"
              className="text-[10px] font-semibold uppercase tracking-widest text-t3">
              Marking attendance for
            </label>
            <div className="flex items-center gap-2">
              <input
                id="att-date-picker"
                type="date"
                value={selectedDate}
                max={today}
                onChange={handleDateChange}
                className={inputCls}
              />
              {!isToday && (
                <button
                  onClick={() => setSelectedDate(today)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-accent/10 border
                             border-accent/25 rounded-lg text-accent text-[12px] font-semibold
                             transition-all hover:bg-accent/20 whitespace-nowrap"
                >↩ Today</button>
              )}
            </div>
          </div>
          {!isToday && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gold/10 border
                             border-gold/20 rounded-full text-gold text-[11px] font-semibold
                             animate-fade-up self-end mb-0.5">
              📅 Editing past date
            </span>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-8 mt-4 flex items-center gap-2 bg-rose/10 border border-rose/20
                        text-rose text-sm font-medium rounded-lg px-4 py-2.5 animate-fade-up">
          <span>⚠</span> {error}
        </div>
      )}

      {/* Empty state */}
      {employees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-t3">
          <span className="text-5xl mb-4 opacity-40">🏢</span>
          <p className="text-sm">No employees yet. Click <strong className="text-t2">Add Employee</strong> to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[13.5px] border-collapse">
            <thead>
              <tr>
                {['Employee ID', 'Name & Email', 'Department', dateLabel, 'All-Time Summary', 'Actions'].map((h, i) => (
                  <th key={i}
                    className="text-left text-[11px] font-bold uppercase tracking-widest
                               text-t3 px-5 py-3.5 border-b border-line whitespace-nowrap">
                    {h === dateLabel && attLoading
                      ? <span>{h} <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent
                                                    align-middle ml-1 animate-dot-pulse" /></span>
                      : h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => {
                const status      = getStatus(emp.employeeId);
                const summary     = presentDaySummary[emp.employeeId];
                const tPresent    = summary?.totalPresent ?? 0;
                const tAbsent     = summary?.totalAbsent  ?? 0;
                const tMarked     = summary?.totalMarked  ?? 0;

                return (
                  <tr key={emp._id}
                    className="border-b border-line/50 last:border-0 hover:bg-hover transition-colors">

                    {/* Employee ID */}
                    <td className="px-5 py-3.5">
                      <span className="bg-elevated border border-line rounded px-2 py-0.5
                                       font-mono text-[12px] text-accent">
                        {emp.employeeId}
                      </span>
                    </td>

                    {/* Name + Email */}
                    <td className="px-5 py-3.5">
                      <div className="text-t1 font-medium">{emp.fullName}</div>
                      <div className="text-t3 text-[12px] mt-0.5">{emp.email}</div>
                    </td>

                    {/* Department */}
                    <td className="px-5 py-3.5">
                      <span className="bg-accent/10 border border-accent/20 text-accent-h
                                       text-[12px] font-medium rounded-full px-2.5 py-0.5">
                        {emp.department}
                      </span>
                    </td>

                    {/* Status for selected date */}
                    <td className="px-5 py-3.5">
                      {attLoading ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full
                                         text-[12px] font-semibold border bg-elevated
                                         border-line text-t3">…</span>
                      ) : status ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full
                                          text-[12px] font-semibold border
                                          ${status === 'Present'
                                            ? 'bg-jade/10 border-jade/20 text-jade'
                                            : 'bg-rose/10 border-rose/20 text-rose'}`}>
                          {status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full
                                         text-[12px] font-semibold border bg-elevated
                                         border-line text-t3">Not Marked</span>
                      )}
                    </td>

                    {/* All-time summary */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span title="Present days"
                          className="font-display font-bold text-jade text-[13px]">
                          ✓ {tPresent}
                        </span>
                        <span className="text-line text-[12px]">|</span>
                        <span title="Absent days"
                          className="font-display font-bold text-rose text-[13px]">
                          ✗ {tAbsent}
                        </span>
                        <span className="text-line text-[12px]">|</span>
                        <span title="Total marked" className="text-t3 text-[12px]">
                          {tMarked}d
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          onClick={() => handleAttendance(emp.employeeId, 'Present')}
                          disabled={!!actionLoading || isFuture}
                          title={isFuture ? 'Cannot mark future dates' : 'Mark Present'}
                          className={actionBtn(
                            status === 'Present'
                              ? 'bg-jade/10 border-jade/20 text-jade'
                              : 'hover:bg-jade/10 hover:border-jade/20 hover:text-jade'
                          )}
                        >
                          {actionLoading === `${emp.employeeId}-Present`
                            ? <Loader size="sm" /> : '✓ Present'}
                        </button>

                        <button
                          onClick={() => handleAttendance(emp.employeeId, 'Absent')}
                          disabled={!!actionLoading || isFuture}
                          title={isFuture ? 'Cannot mark future dates' : 'Mark Absent'}
                          className={actionBtn(
                            status === 'Absent'
                              ? 'bg-rose/10 border-rose/20 text-rose'
                              : 'hover:bg-rose/10 hover:border-rose/20 hover:text-rose'
                          )}
                        >
                          {actionLoading === `${emp.employeeId}-Absent`
                            ? <Loader size="sm" /> : '✗ Absent'}
                        </button>

                        <button
                          onClick={() => setHistoryEmp(emp)}
                          title="View History"
                          className={actionBtn('hover:bg-accent/10 hover:border-accent/20 hover:text-accent')}
                        >
                          📋 History
                        </button>

                        <button
                          onClick={() => handleDelete(emp.employeeId, emp.fullName)}
                          disabled={!!actionLoading}
                          title="Delete Employee"
                          className={actionBtn('hover:bg-rose/10 hover:border-rose/20 hover:text-rose')}
                        >
                          {actionLoading === `delete-${emp.employeeId}`
                            ? <Loader size="sm" /> : <MdDelete />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Attendance History Modal */}
      {historyEmp && (
        <AttendanceHistory
          employee={historyEmp}
          onClose={() => setHistoryEmp(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-5
                     bg-black/75 backdrop-blur-sm animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && setDeleteTarget(null)}
        >
          <div className="bg-surface border border-line rounded-2xl w-full max-w-[420px]
                          shadow-modal animate-slide-up">

            {/* Modal Header */}
            <div className="flex items-start justify-between px-7 pt-6 pb-5 border-b border-line">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center bg-rose/10
                                border border-rose/20 rounded-md text-lg flex-shrink-0">🗑</div>
                <div>
                  <h2 className="font-display font-bold text-[17px] text-t1">Delete Employee</h2>
                  <p className="text-[12px] text-t3 mt-0.5">This action cannot be undone</p>
                </div>
              </div>
              <button
                onClick={() => setDeleteTarget(null)}
                className="w-8 h-8 flex items-center justify-center bg-elevated border border-line
                           rounded-md text-t2 text-sm transition-all hover:bg-rose/10
                           hover:border-rose/30 hover:text-rose"
                aria-label="Close"
              >✕</button>
            </div>

            {/* Modal Body */}
            <div className="px-7 py-6">
              <p className="text-[14px] text-t2 leading-relaxed">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-t1">"{deleteTarget.fullName}"</span>?
                {' '}Their employee record and all attendance history will be permanently removed.
              </p>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 px-4 py-2.5 bg-elevated border border-line rounded-lg
                             text-t2 text-[13px] font-semibold transition-all
                             hover:bg-hover hover:text-t1"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-rose/10 border border-rose/25 rounded-lg
                             text-rose text-[13px] font-semibold transition-all
                             hover:bg-rose/20 hover:border-rose/40"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;