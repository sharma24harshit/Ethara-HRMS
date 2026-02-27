import React, { useState } from 'react';
import { deleteEmployee, markAttendance } from '../services/api';
import AttendanceHistory from './AttendanceHistory';
import Loader from './Loader';
import getTodayDate from '../utils/getTodayDate';

const EmployeeList = ({ employees, todayAttendance, loading, onRefresh }) => {
  const [historyEmployee, setHistoryEmployee] = useState(null);
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState('');

  const today = getTodayDate();

  const getAttendanceStatus = (employeeId) => {
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

  if (loading) return <Loader text="Loading employees…" />;

  return (
    <div className="card list-card">
      <div className="card-header">
        <span className="card-icon">👥</span>
        <h2 className="card-title">Employees</h2>
        <span className="count-badge">{employees.length}</span>
      </div>

      {error && <div className="alert alert-error" style={{ margin: '0 0 1rem' }}>{error}</div>}

      {employees.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🏢</span>
          <p>No employees registered yet. Add your first employee above.</p>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => {
                const status = getAttendanceStatus(emp.employeeId);
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
                      {status ? (
                        <span className={`status-badge ${status === 'Present' ? 'status-present' : 'status-absent'}`}>
                          {status}
                        </span>
                      ) : (
                        <span className="status-badge status-none">Not Marked</span>
                      )}
                    </td>
                    <td>
                      <div className="action-group">
                        <button
                          className={`btn-action btn-present ${status === 'Present' ? 'active' : ''}`}
                          onClick={() => handleAttendance(emp.employeeId, 'Present')}
                          disabled={!!actionLoading}
                          title="Mark Present"
                        >
                          {actionLoading === `${emp.employeeId}-Present` ? <Loader size="sm" /> : '✓ Present'}
                        </button>
                        <button
                          className={`btn-action btn-absent ${status === 'Absent' ? 'active' : ''}`}
                          onClick={() => handleAttendance(emp.employeeId, 'Absent')}
                          disabled={!!actionLoading}
                          title="Mark Absent"
                        >
                          {actionLoading === `${emp.employeeId}-Absent` ? <Loader size="sm" /> : '✗ Absent'}
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
                          {actionLoading === `delete-${emp.employeeId}` ? <Loader size="sm" /> : '🗑'}
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