import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/routes/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Users from './pages/Users';
import ReviewsData from './pages/ReviewsData';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

// Placeholders for inner pages
const Settings = () => <div className="p-8 text-center text-2xl dark:text-white">Settings Content Placeholder</div>;

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
      </Router>
    </ThemeProvider>
  );
}

export default App;
