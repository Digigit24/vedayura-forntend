import { Navigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAuthLoading } = useShop();

  // Wait for auth to finish loading before redirecting
  if (isAuthLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;