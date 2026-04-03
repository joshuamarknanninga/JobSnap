import { useEffect, useMemo, useState } from 'react';
import apiClient from '../api/client';

const createLineItem = () => ({ description: '', qty: 1, rate: 0 });

const ResourcePage = ({ resource, title, fields }) => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [workingId, setWorkingId] = useState('');
  const [lineItems, setLineItems] = useState([createLineItem()]);

  const singular = useMemo(() => (title.endsWith('s') ? title.slice(0, -1) : title), [title]);
  const isEstimate = resource === 'estimates';
  const subtotal = useMemo(
    () => lineItems.reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.rate || 0)), 0),
    [lineItems]
  );
  const tax = Number(form.tax || 0);
  const total = subtotal + tax;

  const loadData = async () => {
    const res = await apiClient.get(`/${resource}`);
    setItems(res.data);
  };

  useEffect(() => {
    loadData().catch(() => setError(`Unable to load ${resource}`));
  }, [resource]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = { ...form };
      if (isEstimate) {
        payload.lineItems = lineItems;
        payload.subtotal = subtotal;
        payload.total = total;
        payload.tax = tax;
      }

      await apiClient.post(`/${resource}`, payload);
      setForm({});
      setLineItems([createLineItem()]);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || `Could not create ${resource.slice(0, -1)}`);
    } finally {
      setSaving(false);
    }
  };

  const createJobFromEstimate = async (estimate) => {
    const scheduledDate = window.prompt('Scheduled date (YYYY-MM-DD):');
    const address = window.prompt('Service address:', estimate.customer?.address || '');

    if (!scheduledDate || !address) {
      return;
    }

    setWorkingId(estimate._id);
    setError('');

    try {
      await apiClient.post(`/workflows/estimates/${estimate._id}/create-job`, { scheduledDate, address });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create job from estimate');
    } finally {
      setWorkingId('');
    }
  };

  const createInvoiceFromJob = async (job) => {
    const dueDate = window.prompt('Invoice due date (YYYY-MM-DD):');

    if (!dueDate) {
      return;
    }

    setWorkingId(job._id);
    setError('');

    try {
      await apiClient.post(`/workflows/jobs/${job._id}/create-invoice`, { dueDate });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create invoice from job');
    } finally {
      setWorkingId('');
    }
  };


  const copyMessage = async (message) => {
    try {
      if (!navigator?.clipboard) {
        throw new Error('Clipboard unavailable');
      }
      await navigator.clipboard.writeText(message);
      setError('');
    } catch {
      setError('Could not copy message to clipboard.');
    }
  };

  const communicationButtons = (item) => {
    if (resource === 'jobs') {
      const text = `Hi! This is JobSnap. We're on the way for your cleaning appointment at ${item.address || 'your location'} today.`;
      return <button className="btn btn-ghost" type="button" onClick={() => copyMessage(text)}>Copy on-my-way text</button>;
    }

    if (resource === 'invoices') {
      const text = `Friendly reminder: your invoice ${item.invoiceNumber || ''} for $${Number(item.amount || 0).toFixed(2)} is due on ${item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'the due date'}.`;
      return <button className="btn btn-ghost" type="button" onClick={() => copyMessage(text)}>Copy reminder</button>;
    }

    if (resource === 'estimates') {
      const text = `Your estimate ${item.title || ''} is ready. Reply to approve and we can schedule your cleaning right away.`;
      return <button className="btn btn-ghost" type="button" onClick={() => copyMessage(text)}>Copy estimate text</button>;
    }

    return null;
  };

  const actionButton = (item) => {
    if (resource === 'estimates' && item.status === 'accepted') {
      return (
        <button className="btn btn-ghost" type="button" disabled={workingId === item._id} onClick={() => createJobFromEstimate(item)}>
          {workingId === item._id ? 'Creating…' : 'Create job'}
        </button>
      );
    }

    if (resource === 'jobs' && item.status === 'completed') {
      return (
        <button className="btn btn-ghost" type="button" disabled={workingId === item._id} onClick={() => createInvoiceFromJob(item)}>
          {workingId === item._id ? 'Creating…' : 'Create invoice'}
        </button>
      );
    }

    return null;
  };

  const inputTypeForField = (field) => {
    if (field.type) {
      return field.type;
    }
    if (field.name.toLowerCase().includes('date')) {
      return 'date';
    }
    return 'text';
  };

  return (
    <section>
      <h1>{title}</h1>
      <form className="inline-form" onSubmit={handleSubmit}>
        {fields.map((field) => (
          <input
            key={field.name}
            type={inputTypeForField(field)}
            step={field.type === 'number' ? '0.01' : undefined}
            placeholder={field.label}
            value={form[field.name] || ''}
            onChange={(e) => setForm((prev) => ({ ...prev, [field.name]: e.target.value }))}
            required={field.required}
          />
        ))}

        {isEstimate && (
          <div className="line-items-card">
            <h3>Line items</h3>
            {lineItems.map((lineItem, index) => (
              <div key={`line-${index}`} className="line-item-row">
                <input
                  placeholder="Description"
                  value={lineItem.description}
                  onChange={(e) => {
                    const next = [...lineItems];
                    next[index] = { ...next[index], description: e.target.value };
                    setLineItems(next);
                  }}
                  required
                />
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Qty"
                  value={lineItem.qty}
                  onChange={(e) => {
                    const next = [...lineItems];
                    next[index] = { ...next[index], qty: e.target.value };
                    setLineItems(next);
                  }}
                  required
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Rate"
                  value={lineItem.rate}
                  onChange={(e) => {
                    const next = [...lineItems];
                    next[index] = { ...next[index], rate: e.target.value };
                    setLineItems(next);
                  }}
                  required
                />
                <button
                  className="btn btn-danger"
                  type="button"
                  disabled={lineItems.length === 1}
                  onClick={() => setLineItems((prev) => prev.filter((_, i) => i !== index))}
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="line-items-actions">
              <button className="btn btn-ghost" type="button" onClick={() => setLineItems((prev) => [...prev, createLineItem()])}>+ Add line item</button>
              <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)} &nbsp; <strong>Total:</strong> ${total.toFixed(2)}</p>
            </div>
          </div>
        )}

        <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? `Saving ${singular}…` : `Add ${singular}`}</button>
      </form>
      {error && <p className="error">{error}</p>}
      <ul className="list">
        {items.map((item) => (
          <li key={item._id}>
            <div>
              <strong>{item.name || item.title || item.invoiceNumber || item.address}</strong>
              <span>{item.email || item.status || item.amount || item.phone || '—'}</span>
            </div>
            <div className="item-actions">{actionButton(item)}{communicationButtons(item)}</div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ResourcePage;
