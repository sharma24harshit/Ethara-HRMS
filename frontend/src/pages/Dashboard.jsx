import React, { useState, useEffect, useCallback } from 'react';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeList from '../components/EmployeeList';
import { getEmployees, getAttendanceByDate, getAttendanceSummary } from '../services/api';
import getTodayDate from '../utils/getTodayDate';

const Dashboard = () => {
  const [employees, setEmployees]         = useState([]);
  const [todayAttendance, setTodayAtt]    = useState([]);
  const [presentDaySummary, setSummary]   = useState({});
  const [loading, setLoading]             = useState(true);
  const [stats, setStats]                 = useState({ total: 0, present: 0, absent: 0, unmarked: 0 });
  const [showAddModal, setShowAddModal]   = useState(false);

  const today = getTodayDate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [empRes, attRes, sumRes] = await Promise.all([
        getEmployees(),
        getAttendanceByDate(today),
        getAttendanceSummary(),
      ]);
      const emps = empRes.data.data;
      const att  = attRes.data.data;
      const sum  = sumRes.data.data;

      setEmployees(emps);
      setTodayAtt(att);
      setSummary(sum);

      const present  = att.filter((r) => r.status === 'Present').length;
      const absent   = att.filter((r) => r.status === 'Absent').length;
      const unmarked = Math.max(0, emps.length - att.length);
      setStats({ total: emps.length, present, absent, unmarked });
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleEmployeeAdded = () => {
    setShowAddModal(false);
    fetchData();
  };

  return (
    <div className="dashboard">
      {/* ── Header ── */}
      <header className="dash-header">
        <div className="header-brand">
          <div className="brand-logo">E</div>
          <div>
            <h1 className="brand-name">ETHARA HRMS</h1>
            <p className="brand-tagline">Human Resource Management System</p>
          </div>
        </div>
        <div className="header-right">
          <div className="header-date">
            <span className="date-label">Today</span>
            <span className="date-value">{today}</span>
          </div>
          <button className="btn btn-primary btn-add-emp" onClick={() => setShowAddModal(true)}>
            <span className="btn-plus">＋</span> Add Employee
          </button>
        </div>
      </header>

      {/* ── Stats Bar ── */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-num">{stats.total}</div>
          <div className="stat-label">Total Employees</div>
        </div>
        <div className="stat-card stat-card--present">
          <div className="stat-num">{stats.present}</div>
          <div className="stat-label">Present Today</div>
        </div>
        <div className="stat-card stat-card--absent">
          <div className="stat-num">{stats.absent}</div>
          <div className="stat-label">Absent Today</div>
        </div>
        <div className="stat-card stat-card--unmarked">
          <div className="stat-num">{stats.unmarked}</div>
          <div className="stat-label">Not Marked</div>
        </div>
      </div>

      {/* ── Employee Table ── */}
      <main className="dash-main">
        <EmployeeList
          employees={employees}
          todayAttendance={todayAttendance}
          presentDaySummary={presentDaySummary}
          loading={loading}
          onRefresh={fetchData}
        />
      </main>

      {/* ── Add Employee Modal ── */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}>
          <div className="modal modal--form">
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Add New Employee</h2>
                <p className="modal-subtitle">Fill in the details to register a new employee</p>
              </div>
              <button className="modal-close" onClick={() => setShowAddModal(false)} aria-label="Close">
                &#x2715;
              </button>
            </div>
            <div className="modal-body modal-body--form">
              <EmployeeForm onEmployeeAdded={handleEmployeeAdded} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;