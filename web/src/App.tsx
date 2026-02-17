import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { SignIn } from './pages/SignIn';
import { LibraryView } from './pages/LibraryView';
import { useAuthStore } from './stores/authStore';

const ProtectedRoute = () => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route element={<ProtectedRoute />}>
           <Route path="/" element={<LibraryView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
