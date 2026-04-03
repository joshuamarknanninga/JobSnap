import { useEffect, useMemo, useState } from 'react';
import apiClient from '../api/client';

const monthKey = (dateInput) => {
  const date = new Date(dateInput);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const ReportsPage = () => {
  const [estimates, setEstimates] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [estimateRes, invoiceRes, jobRes] = await Promise.all([
        apiClient.get('/estimates'),
        apiClient.get('/invoices'),
        apiClient.get('/jobs')
      ]);

      setEstimates(estimateRes.data);
      setInvoices(invoiceRes.data);
      setJobs(jobRes.data);
    };

    load().catch(() => {});
  }, []);

  const acceptedEstimates = estimates.filter((estimate) => estimate.status === 'accepted').length;
  const estimateConversion = estimates.length ? Math.round((acceptedEstimates / estimates.length) * 100) : 0;

  const paidInvoices = invoices.filter((invoice) => invoice.status === 'paid');
  const paidRevenue = paidInvoices.reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);

  const monthlyRevenue = useMemo(() => {
    const map = new Map();
    paidInvoices.forEach((invoice) => {
      const key = monthKey(invoice.issueDate || invoice.createdAt || Date.now());
      map.set(key, (map.get(key) || 0) + Number(invoice.amount || 0));
    });

    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [paidInvoices]);

  const completedJobs = jobs.filter((job) => job.status === 'completed').length;

  return (
    <section>
      <h1>Reports</h1>
      <div className="grid">
        <article><h3>Estimate conversion</h3><p>{estimateConversion}%</p></article>
        <article><h3>Paid revenue</h3><p>${paidRevenue.toFixed(2)}</p></article>
        <article><h3>Completed jobs</h3><p>{completedJobs}</p></article>
      </div>

      <h2>Monthly paid revenue</h2>
      <ul className="list">
        {monthlyRevenue.length === 0 && <li><span>No paid invoices yet.</span></li>}
        {monthlyRevenue.map(([month, amount]) => (
          <li key={month}>
            <strong>{month}</strong>
            <span>${amount.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ReportsPage;
