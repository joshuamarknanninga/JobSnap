import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', businessName: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <h1>Create JobSnap account</h1>
      <p>Launch your cleaning SaaS workflow in minutes.</p>
      <form onSubmit={handleSubmit}>
        <input placeholder="Full name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
        <input placeholder="Business name" value={form.businessName} onChange={(e) => setForm((prev) => ({ ...prev, businessName: e.target.value }))} required />
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required />
        <input placeholder="Password (min 6)" type="password" minLength={6} value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} required />
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? 'Creating…' : 'Create Account'}</button>
      </form>
      <p>Already have an account? <Link to="/login">Sign in</Link></p>
    </div>
  );
};

export default RegisterPage;
