import React, { useState } from 'react';
import { createEmployee } from '../services/api';
import Loader from './Loader';

const DEPARTMENTS = [
 'Marketing','Sales','Finance',
 'IT & Infrastructure', 'Other'
];

/* ── shared Tailwind snippets ── */
const inputCls =
  'w-full bg-elevated border border-line rounded-lg text-t1 font-body text-sm ' +
  'px-3 py-2.5 outline-none transition-all duration-200 ' +
  'focus:border-accent focus:ring-2 focus:ring-accent/20 placeholder:text-t3';

const labelCls = 'block text-[10px] font-semibold uppercase tracking-widest text-t3 mb-1.5';

const EmployeeForm = ({ onEmployeeAdded }) => {
  const [form, setForm]       = useState({ employeeId: '', fullName: '', email: '', department: '' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { employeeId, fullName, email, department } = form;
    if (!employeeId || !fullName || !email || !department) {
      setError('All fields are required.'); return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.'); return;
    }
    setLoading(true);
    try {
      await createEmployee(form);
      setSuccess(`Employee "${fullName}" added successfully!`);
      setForm({ employeeId: '', fullName: '', email: '', department: '' });
      if (onEmployeeAdded) onEmployeeAdded(fullName);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="employeeId" className={labelCls}>Employee ID</label>
          <input id="employeeId" name="employeeId" type="text"
            placeholder="e.g. EMP-001" value={form.employeeId}
            onChange={handleChange} autoComplete="off" className={inputCls} />
        </div>
        <div>
          <label htmlFor="fullName" className={labelCls}>Full Name</label>
          <input id="fullName" name="fullName" type="text"
            placeholder="e.g. Jane Smith" value={form.fullName}
            onChange={handleChange} autoComplete="off" className={inputCls} />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className={labelCls}>Email Address</label>
          <input id="email" name="email" type="email"
            placeholder="e.g. jane@company.com" value={form.email}
            onChange={handleChange} autoComplete="off" className={inputCls} />
        </div>
        <div>
          <label htmlFor="department" className={labelCls}>Department</label>
          <select id="department" name="department"
            value={form.department} onChange={handleChange}
            className={inputCls + ' cursor-pointer'}>
            <option value="">Select a department…</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Alerts */}
      {error   && (
        <div className="flex items-center gap-2 bg-rose/10 border border-rose/20 text-rose text-sm font-medium rounded-lg px-4 py-2.5 animate-fade-up">
          <span>⚠</span> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-jade/10 border border-jade/20 text-jade text-sm font-medium rounded-lg px-4 py-2.5 animate-fade-up">
          <span>✓</span> {success}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-h
                   disabled:opacity-50 disabled:cursor-not-allowed text-white font-display
                   font-semibold text-sm rounded-lg px-6 py-2.5 transition-all duration-200
                   shadow-glow-accent hover:shadow-glow-accent active:scale-[0.98]"
      >
        {loading ? <Loader size="sm" /> : 'Add Employee'}
      </button>
    </form>
  );
};

export default EmployeeForm;