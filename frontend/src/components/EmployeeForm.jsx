import React, { useState } from 'react';
import { createEmployee } from '../services/api';
import Loader from './Loader';

const EmployeeForm = ({ onEmployeeAdded }) => {
  const [form, setForm] = useState({ employeeId: '', fullName: '', email: '', department: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { employeeId, fullName, email, department } = form;
    if (!employeeId || !fullName || !email || !department) {
      setError('All fields are required.');
      return;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await createEmployee(form);
      setSuccess(`Employee "${fullName}" added successfully!`);
      setForm({ employeeId: '', fullName: '', email: '', department: '' });
      if (onEmployeeAdded) onEmployeeAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card form-card">
      <div className="card-header">
        <span className="card-icon">＋</span>
        <h2 className="card-title">Add Employee</h2>
      </div>
      <form onSubmit={handleSubmit} className="emp-form" noValidate>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="employeeId">Employee ID</label>
            <input
              id="employeeId"
              name="employeeId"
              type="text"
              placeholder="e.g. EMP-001"
              value={form.employeeId}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="e.g. Jane Smith"
              value={form.fullName}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. jane@company.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <input
              id="department"
              name="department"
              type="text"
              placeholder="e.g. Engineering"
              value={form.department}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <Loader size="sm" /> : 'Add Employee'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;