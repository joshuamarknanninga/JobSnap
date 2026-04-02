import { useEffect, useMemo, useState } from 'react';
import apiClient from '../api/client';

const ResourcePage = ({ resource, title, fields }) => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const singular = useMemo(() => title.endsWith('s') ? title.slice(0, -1) : title, [title]);

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
      await apiClient.post(`/${resource}`, form);
      setForm({});
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || `Could not create ${resource.slice(0, -1)}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <h1>{title}</h1>
      <form className="inline-form" onSubmit={handleSubmit}>
        {fields.map((field) => (
          <input
            key={field.name}
            type={field.type || 'text'}
            placeholder={field.label}
            value={form[field.name] || ''}
            onChange={(e) => setForm((prev) => ({ ...prev, [field.name]: e.target.value }))}
            required={field.required}
          />
        ))}
        <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? `Saving ${singular}…` : `Add ${singular}`}</button>
      </form>
      {error && <p className="error">{error}</p>}
      <ul className="list">
        {items.map((item) => (
          <li key={item._id}>
            <strong>{item.name || item.title || item.invoiceNumber || item.address}</strong>
            <span>{item.email || item.status || item.amount || item.phone || '—'}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ResourcePage;
