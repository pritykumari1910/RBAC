import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome, {user?.email}!</h1>
        <p><strong>Role:</strong> {user?.role}</p>

        {user?.role === 'admin' && (
          <div className="alert alert-warning">
            <h3>Admin Panel</h3>
            <p>You have full access (view_users, manage_roles, etc.)</p>
          </div>
        )}

        {user?.role === 'moderator' && (
          <div className="alert alert-info">
            <h3>Moderator Tools</h3>
            <p>You can view all users</p>
          </div>
        )}

        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>
    </div>
  );
}