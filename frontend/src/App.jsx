import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline, CircularProgress } from '@mui/material';
import { useEffect, useMemo, lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/routes/ProtectedRoute';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Users = lazy(() => import('./pages/Users'));
const ReviewsData = lazy(() => import('./pages/ReviewsData'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  const mode = useSelector((state) => state.ui.mode);

  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: '"Outfit", "Helvetica", "Arial", sans-serif',
        },
        palette: {
          mode,
          primary: {
            main: '#6366f1', // Indigo 500
            dark: '#4f46e5',
            light: '#818cf8',
          },
          secondary: {
            main: '#ec4899', // Pink 500
          },
          background: {
            default: mode === 'dark' ? '#0b0f19' : '#f8fafc',
            paper: mode === 'dark' ? '#111827' : '#ffffff',
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
        },
      }),
    [mode]
  );

  useEffect(() => {
    // Sync Tailwind dark mode
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'glass dark:bg-slate-800 dark:text-white',
          style: {
            backdropFilter: 'blur(10px)',
            background: mode === 'dark' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            color: mode === 'dark' ? '#fff' : '#1e293b',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            borderRadius: '16px',
            border: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }} 
      />
      <Router>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-[#0b0f19]">
            <CircularProgress className="text-indigo-500" />
          </div>
        }>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes inside Layout */}
            <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="reviews" element={<ReviewsData />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
