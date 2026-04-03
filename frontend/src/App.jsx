import { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import IntroGate from './components/IntroGate';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReportsPage from './pages/ReportsPage';
import ResourcePage from './pages/ResourcePage';

const introKey = 'jobsnap_intro_seen';

const ProtectedLayout = () => (
  <ProtectedRoute>
    <Layout>
      <Outlet />
    </Layout>
  </ProtectedRoute>
);

const App = () => {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    setShowIntro(localStorage.getItem(introKey) !== 'true');
  }, []);

  const dismissIntro = () => {
    localStorage.setItem(introKey, 'true');
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <IntroGate onEnter={dismissIntro} onSkip={dismissIntro} />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/customers"
            element={<ResourcePage resource="customers" title="Customers" fields={[{ name: 'name', label: 'Customer name', required: true }, { name: 'email', label: 'Email' }, { name: 'phone', label: 'Phone' }, { name: 'address', label: 'Service address' }]} />}
          />
          <Route
            path="/estimates"
            element={<ResourcePage resource="estimates" title="Estimates" fields={[{ name: 'customer', label: 'Customer ID', required: true }, { name: 'title', label: 'Title', required: true }, { name: 'tax', label: 'Tax', type: 'number' }]} />}
          />
          <Route
            path="/jobs"
            element={<ResourcePage resource="jobs" title="Jobs" fields={[{ name: 'customer', label: 'Customer ID', required: true }, { name: 'scheduledDate', label: 'Date (YYYY-MM-DD)', required: true }, { name: 'address', label: 'Address', required: true }]} />}
          />
          <Route
            path="/invoices"
            element={<ResourcePage resource="invoices" title="Invoices" fields={[{ name: 'customer', label: 'Customer ID', required: true }, { name: 'invoiceNumber', label: 'Invoice #', required: true }, { name: 'dueDate', label: 'Due date', required: true }, { name: 'amount', label: 'Amount', type: 'number' }]} />}
          />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
