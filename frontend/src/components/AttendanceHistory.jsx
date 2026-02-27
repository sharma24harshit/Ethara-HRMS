import React, { useState, useEffect } from 'react';
import { getAttendanceByEmployee } from '../services/api';
import Loader from './Loader';

const AttendanceHistory = ({ employee, onClose }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getAttendanceByEmployee(employee.employeeId);
        setRecords(res.data.data);
      } catch (err) {
        setError('Failed to load attendance history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [employee.employeeId]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const presentCount = records.filter((r) => r.status === 'Present').length;
  const absentCount = records.filter((r) => r.status === 'Absent').length;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Attendance History</h2>
            <p className="modal-subtitle">
              {employee.fullName} &middot; <span className="emp-id-badge">{employee.employeeId}</span>
            </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">&#x2715;</button>
        </div>

        {!loading && !error && records.length > 0 && (
          <div className="history-stats">
            <div className="stat-chip stat-present">
              <span className="stat-dot"></span>Present: <strong>{presentCount}</strong>
            </div>
            <div className="stat-chip stat-absent">
              <span className="stat-dot"></span>Absent: <strong>{absentCount}</strong>
            </div>
            <div className="stat-chip stat-total">
              Total: <strong>{records.length}</strong>
            </div>
          </div>
        )}

        <div className="modal-body">
          {loading && <Loader text="Loading history…" />}
          {error && <div className="alert alert-error">{error}</div>}
          {!loading && !error && records.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <p>No attendance records found.</p>
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
                  <tr key={record._id}>
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