import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useEffect, useMemo } from 'react';
import AdminLayout from './components/layout/AdminLayout';

// Placeholders
const Login = () => <div className="p-8 text-center text-2xl dark:text-white">Login Page Placeholder</div>;
const Register = () => <div className="p-8 text-center text-2xl dark:text-white">Register Page Placeholder</div>;
const Dashboard = () => <div className="p-8 text-center text-2xl dark:text-white">Dashboard Content Placeholder</div>;

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
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes inside Layout */}
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
