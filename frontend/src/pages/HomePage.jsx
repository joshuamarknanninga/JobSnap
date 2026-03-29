import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <main className="hero">
      <h1>JobSnap</h1>
      <p>Simple SaaS for solo cleaning businesses. Track customers, estimates, jobs, and invoices in one place.</p>
      <div className="hero-actions">
        {isAuthenticated ? (
          <Link to="/dashboard">Open dashboard</Link>
        ) : (
          <>
            <Link to="/register">Get started</Link>
            <Link to="/login">Sign in</Link>
          </>
        )}
      </div>
    </main>
  );
};

export default HomePage;
