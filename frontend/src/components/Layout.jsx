import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/customers', label: 'Customers' },
  { to: '/estimates', label: 'Estimates' },
  { to: '/jobs', label: 'Jobs' },
  { to: '/invoices', label: 'Invoices' }
];

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>JobSnap</h2>
        <p>{user?.business?.name || 'Your business'}</p>
        <nav>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button className="btn btn-danger" type="button" onClick={logout}>Log out</button>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
};

export default Layout;
