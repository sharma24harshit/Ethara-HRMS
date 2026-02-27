import React, { useState, useEffect, useCallback } from 'react';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeList from '../components/EmployeeList';
import { getEmployees, getAttendanceByDate } from '../services/api';
import getTodayDate from '../utils/getTodayDate';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, unmarked: 0 });

  const today = getTodayDate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [empRes, attRes] = await Promise.all([
        getEmployees(),
        getAttendanceByDate(today),
      ]);
      const emps = empRes.data.data;
      const att = attRes.data.data;
      setEmployees(emps);
      setTodayAttendance(att);

      const present = att.filter((r) => r.status === 'Present').length;
      const absent = att.filter((r) => r.status === 'Absent').length;
      const unmarked = emps.length - att.length;
      setStats({ total: emps.length, present, absent, unmarked: Math.max(0, unmarked) });
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="header-brand">
          <div className="brand-logo">E</div>
          <div>
            <h1 className="brand-name">ETHARA HRMS</h1>
            <p className="brand-tagline">Human Resource Management System</p>
          </div>
        </div>
        <div className="header-date">
          <span className="date-label">Today</span>
          <span className="date-value">{today}</span>
        </div>
      </header>

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

      <main className="dash-main">
        <EmployeeForm onEmployeeAdded={fetchData} />
        <EmployeeList
          employees={employees}
          todayAttendance={todayAttendance}
          loading={loading}
          onRefresh={fetchData}
        />
      </main>
    </div>
  );
};

export default Dashboard;