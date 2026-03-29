import { useEffect, useState } from 'react';
import apiClient from '../api/client';

const DashboardPage = () => {
  const [metrics, setMetrics] = useState({ customers: 0, estimates: 0, jobs: 0, invoices: 0 });

  useEffect(() => {
    const load = async () => {
      const [customers, estimates, jobs, invoices] = await Promise.all([
        apiClient.get('/customers'),
        apiClient.get('/estimates'),
        apiClient.get('/jobs'),
        apiClient.get('/invoices')
      ]);

      setMetrics({
        customers: customers.data.length,
        estimates: estimates.data.length,
        jobs: jobs.data.length,
        invoices: invoices.data.length
      });
    };

    load().catch(() => {});
  }, []);

  return (
    <section>
      <h1>Business dashboard</h1>
      <div className="grid">
        <article><h3>Customers</h3><p>{metrics.customers}</p></article>
        <article><h3>Estimates</h3><p>{metrics.estimates}</p></article>
        <article><h3>Jobs</h3><p>{metrics.jobs}</p></article>
        <article><h3>Invoices</h3><p>{metrics.invoices}</p></article>
      </div>
      <p>Track your entire cleaning operation from one mobile-friendly dashboard.</p>
    </section>
  );
};

export default DashboardPage;
