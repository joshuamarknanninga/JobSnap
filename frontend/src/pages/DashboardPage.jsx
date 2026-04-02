import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';

const isSameDay = (dateA, dateB) => (
  dateA.getFullYear() === dateB.getFullYear()
  && dateA.getMonth() === dateB.getMonth()
  && dateA.getDate() === dateB.getDate()
);

const DashboardPage = () => {
  const [metrics, setMetrics] = useState({ customers: 0, estimates: 0, jobs: 0, invoices: 0 });
  const [actionItems, setActionItems] = useState({ todaysJobs: 0, overdueInvoices: 0, unsentEstimates: 0 });

  useEffect(() => {
    const load = async () => {
      const [customers, estimates, jobs, invoices] = await Promise.all([
        apiClient.get('/customers'),
        apiClient.get('/estimates'),
        apiClient.get('/jobs'),
        apiClient.get('/invoices')
      ]);

      const now = new Date();
      const jobsToday = jobs.data.filter((job) => job.scheduledDate && isSameDay(new Date(job.scheduledDate), now));
      const overdueInvoices = invoices.data.filter((invoice) => {
        if (!invoice.dueDate || invoice.status === 'paid') {
          return false;
        }
        return invoice.status === 'overdue' || new Date(invoice.dueDate) < now;
      });
      const unsentEstimates = estimates.data.filter((estimate) => estimate.status === 'draft');

      setMetrics({
        customers: customers.data.length,
        estimates: estimates.data.length,
        jobs: jobs.data.length,
        invoices: invoices.data.length
      });

      setActionItems({
        todaysJobs: jobsToday.length,
        overdueInvoices: overdueInvoices.length,
        unsentEstimates: unsentEstimates.length
      });
    };

    load().catch(() => {});
  }, []);

  const actionCards = useMemo(() => ([
    { label: "Today's jobs", value: actionItems.todaysJobs, to: '/jobs' },
    { label: 'Overdue invoices', value: actionItems.overdueInvoices, to: '/invoices' },
    { label: 'Draft estimates', value: actionItems.unsentEstimates, to: '/estimates' }
  ]), [actionItems]);

  return (
    <section>
      <h1>Business dashboard</h1>
      <div className="grid">
        <article><h3>Customers</h3><p>{metrics.customers}</p></article>
        <article><h3>Estimates</h3><p>{metrics.estimates}</p></article>
        <article><h3>Jobs</h3><p>{metrics.jobs}</p></article>
        <article><h3>Invoices</h3><p>{metrics.invoices}</p></article>
      </div>

      <h2>Action needed</h2>
      <div className="grid action-grid">
        {actionCards.map((item) => (
          <article key={item.label}>
            <h3>{item.label}</h3>
            <p>{item.value}</p>
            <Link className="btn btn-ghost" to={item.to}>Review</Link>
          </article>
        ))}
      </div>
      <p>Track your entire cleaning operation from one mobile-friendly dashboard.</p>
    </section>
  );
};

export default DashboardPage;
