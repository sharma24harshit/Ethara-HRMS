import React, { useState, useEffect, useCallback } from 'react';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeList from '../components/EmployeeList';
import { getEmployees, getAttendanceByDate, getAttendanceSummary } from '../services/api';
import getTodayDate from '../utils/getTodayDate';

const Dashboard = () => {
  const [employees,        setEmployees] = useState([]);
  const [presentDaySummary, setSummary] = useState({});
  const [loading,          setLoading]  = useState(true);
  const [stats,            setStats]    = useState({ total: 0, present: 0, absent: 0, unmarked: 0 });
  const [showAddModal,     setShowAdd]  = useState(false);
  const [toast,            setToast]    = useState(null); // { message, type }

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
      setEmployees(emps);
      setSummary(sumRes.data.data);
      setStats({
        total:   emps.length,
        present: att.filter((r) => r.status === 'Present').length,
        absent:  att.filter((r) => r.status === 'Absent').length,
        unmarked: Math.max(0, emps.length - att.length),
      });
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleEmployeeAdded = (fullName) => {
    setShowAdd(false);
    fetchData();
    showToast(`Employee "${fullName}" added successfully!`);
  };

  /* ── Stats card config ── */
  const statCards = [
    { num: stats.total,   label: 'Total Employees', ring: 'border-line',       num_cls: 'text-accent' },
    { num: stats.present, label: 'Present Today',   ring: 'border-jade/25',    num_cls: 'text-jade'   },
    { num: stats.absent,  label: 'Absent Today',    ring: 'border-rose/25',    num_cls: 'text-rose'   },
    { num: stats.unmarked,label: 'Not Marked Today',ring: 'border-gold/25',    num_cls: 'text-gold'   },
  ];

  const statBg = ['', 'bg-jade/5', 'bg-rose/5', 'bg-gold/5'];

  return (
    <div className="max-w-[1400px] mx-auto px-6 pb-16">

      {/* ── Header ── */}
      <header className="flex items-center justify-between py-7 border-b border-line mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-accent text-white
                          rounded-xl font-display font-extrabold text-2xl
                          shadow-glow-accent flex-shrink-0">E</div>
          <div>
            <h1 className="font-display font-extrabold text-[22px] text-t1 leading-tight
                           tracking-wide">HRMS</h1>
            <p className="text-[11px] text-t3 uppercase tracking-[0.08em] mt-0.5">
              Human Resource Management System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[10px] text-t3 uppercase tracking-widest font-semibold">Today</span>
            <span className="font-display font-semibold text-[15px] text-accent">{today}</span>
          </div>
        </div>
      </header>

      {/* ── Stats Bar ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => (
          <div key={i}
            className={`bg-surface ${statBg[i]} border ${s.ring} rounded-2xl px-6 py-5
                        transition-all hover:-translate-y-0.5 hover:shadow-card`}>
            <div className={`font-display font-extrabold text-[36px] leading-none mb-1.5 ${s.num_cls}`}>
              {s.num}
            </div>
            <div className="text-[12px] text-t2 font-medium tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Employee Table ── */}
      <div className='flex justify-end mb-2'>
      <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-accent hover:bg-accent-h text-white
                       font-display font-semibold text-[14px] px-5 py-2.5 rounded-xl
                       shadow-glow-accent transition-all active:scale-[0.98] whitespace-nowrap"
          >
            <span className="text-base leading-none">＋</span> Add Employee
          </button>
      </div>
      <main>
        <EmployeeList
          employees={employees}
          presentDaySummary={presentDaySummary}
          loading={loading}
          onRefresh={fetchData}
        />
      </main>

      {/* ── Add Employee Modal ── */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-5
                     bg-black/75 backdrop-blur-sm animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && setShowAdd(false)}
        >
          <div className="bg-surface border border-line rounded-2xl w-full max-w-[560px]
                          shadow-modal animate-slide-up">

            {/* Modal header */}
            <div className="flex items-start justify-between px-7 pt-6 pb-5 border-b border-line">
              <div>
                <h2 className="font-display font-bold text-[18px] text-t1">Add New Employee</h2>
                <p className="text-[13px] text-t2 mt-1">Fill in the details to register a new employee</p>
              </div>
              <button
                onClick={() => setShowAdd(false)}
                className="w-8 h-8 flex items-center justify-center bg-elevated border border-line
                           rounded-md text-t2 text-sm transition-all hover:bg-rose/10
                           hover:border-rose/30 hover:text-rose"
                aria-label="Close"
              >✕</button>
            </div>

            {/* Modal body — form */}
            <div className="px-7 py-6">
              <EmployeeForm onEmployeeAdded={handleEmployeeAdded} />
            </div>
          </div>
        </div>
      )}
      {/* ── Toast Notification ── */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-5 py-3.5
                         rounded-xl border shadow-modal animate-slide-up max-w-sm
                         ${toast.type === 'success'
                           ? 'bg-surface border-jade/30 text-jade'
                           : 'bg-surface border-rose/30 text-rose'}`}>
          <span className="text-lg flex-shrink-0">
            {toast.type === 'success' ? '✓' : '⚠'}
          </span>
          <p className="text-[13px] font-medium text-t1 leading-snug">{toast.message}</p>
          <button
            onClick={() => setToast(null)}
            className="ml-auto text-t3 hover:text-t1 text-xs flex-shrink-0 transition-colors"
          >✕</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;