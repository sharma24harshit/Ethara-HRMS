import React, { useState } from 'react';
import { deleteEmployee, markAttendance } from '../services/api';
import AttendanceHistory from './AttendanceHistory';
import Loader from './Loader';
import getTodayDate from '../utils/getTodayDate';

const EmployeeList = ({ employees, todayAttendance, presentDaySummary = {}, loading, onRefresh }) => {
  const [historyEmployee, setHistoryEmployee] = useState(null);
  const [actionLoading, setActionLoading]     = useState('');
  const [error, setError]                     = useState('');

  const today = getTodayDate();

  const getTodayStatus = (employeeId) => {
    const record = todayAttendance.find((r) => r.employeeId === employeeId);
    return record ? record.status : null;
  };

  const handleAttendance = async (employeeId, status) => {
    setActionLoading(`${employeeId}-${status}`);
    setError('');
    try {
      await markAttendance({ employeeId, date: today, status });
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark attendance.');
    } finally {
      setActionLoading('');
    }
  };

  const handleDelete = async (employeeId, fullName) => {
    if (!window.confirm(`Delete employee "${fullName}"? This cannot be undone.`)) return;
    setActionLoading(`delete-${employeeId}`);
    setError('');
    try {
      await deleteEmployee(employeeId);
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete employee.');
    } finally {
      setActionLoading('');
    }
  };

  if (loading) return (
    <div className="card list-card">
      <Loader text="Loading employees…" />
    </div>
  );

  return (
    <div className="card list-card">
      <div className="card-header">
        <span className="card-icon">👥</span>
        <h2 className="card-title">Employees</h2>
        <span className="count-badge">{employees.length}</span>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>
      )}

      {employees.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🏢</span>
          <p>No employees yet. Click <strong>Add Employee</strong> to get started.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Today's Status</th>
                <th>Total Present Days</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => {
                const todayStatus   = getTodayStatus(emp.employeeId);
                const summary       = presentDaySummary[emp.employeeId];
                const totalPresent  = summary?.totalPresent ?? 0;
                const totalMarked   = summary?.totalMarked  ?? 0;

                return (
                  <tr key={emp._id}>
                    <td>
                      <span className="emp-id-badge">{emp.employeeId}</span>
                    </td>
                    <td className="emp-name">{emp.fullName}</td>
                    <td className="emp-email">{emp.email}</td>
                    <td>
                      <span className="dept-badge">{emp.department}</span>
                    </td>
                    <td>
                      {todayStatus ? (
                        <span className={`status-badge ${todayStatus === 'Present' ? 'status-present' : 'status-absent'}`}>
                          {todayStatus}
                        </span>
                      ) : (
                        <span className="status-badge status-none">Not Marked</span>
                      )}
                    </td>
                    <td>
                      <div className="present-days-cell">
                        <span className="present-days-num">{totalPresent}</span>
                        {totalMarked > 0 && (
                          <span className="present-days-sub">/ {totalMarked} marked</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="action-group">
                        <button
                          className={`btn-action btn-present ${todayStatus === 'Present' ? 'active' : ''}`}
                          onClick={() => handleAttendance(emp.employeeId, 'Present')}
                          disabled={!!actionLoading}
                          title="Mark Present"
                        >
                          {actionLoading === `${emp.employeeId}-Present`
                            ? <Loader size="sm" />
                            : '✓ Present'}
                        </button>
                        <button
                          className={`btn-action btn-absent ${todayStatus === 'Absent' ? 'active' : ''}`}
                          onClick={() => handleAttendance(emp.employeeId, 'Absent')}
                          disabled={!!actionLoading}
                          title="Mark Absent"
                        >
                          {actionLoading === `${emp.employeeId}-Absent`
                            ? <Loader size="sm" />
                            : '✗ Absent'}
                        </button>
                        <button
                          className="btn-action btn-history"
                          onClick={() => setHistoryEmployee(emp)}
                          title="View History"
                        >
                          📋 History
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDelete(emp.employeeId, emp.fullName)}
                          disabled={!!actionLoading}
                          title="Delete Employee"
                        >
                          {actionLoading === `delete-${emp.employeeId}`
                            ? <Loader size="sm" />
                            : '🗑'}
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

      {historyEmployee && (
        <AttendanceHistory
          employee={historyEmployee}
          onClose={() => setHistoryEmployee(null)}
        />
      )}
    </div>
  );
};

export default EmployeeList;