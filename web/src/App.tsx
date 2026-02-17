import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { SignIn } from './pages/SignIn';
import { useAuthStore } from './stores/authStore';

const ProtectedRoute = () => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

const Dashboard = () => {
    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold">Welcome to Nexus Library</h1>
            <p>This is the protected dashboard view.</p>
        </div>
    );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route element={<ProtectedRoute />}>
           <Route path="/" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
