import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError } from '../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import SEO from '../components/seo/SEO';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    dispatch(clearAuthError());
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [token, navigate, dispatch]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Full Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    }),
    onSubmit: async (values) => {
      const { confirmPassword, ...data } = values;
      await dispatch(registerUser(data));
    },
  });

  return (
    <>
      <SEO title="Register Admin" description="Create a new admin account for the Meta Glasses Reviews Dashboard." />
      <div className="flex min-h-screen bg-slate-50 dark:bg-[#0b0f19] transition-colors relative overflow-hidden flex-row-reverse">
        {/* Right Panel - Branding/Art */}
        <div className="hidden lg:flex w-1/2 relative flex-col justify-center items-center overflow-hidden border-l border-slate-200 dark:border-slate-800">
          {/* Animated Background Blobs */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-500/20 dark:bg-pink-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob z-0"></div>
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-amber-500/20 dark:bg-amber-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000 z-0"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000 z-0"></div>
          
          <div className="relative z-10 text-center px-12 max-w-2xl">
            <div className="mb-8 inline-flex items-center justify-center p-4 bg-white/10 dark:bg-black/20 rounded-3xl backdrop-blur-md border border-white/20 dark:border-white/5 shadow-2xl">
               <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-amber-500 flex items-center justify-center shadow-inner">
                 <span className="text-3xl font-extrabold text-white">M</span>
               </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-pink-600 via-amber-500 to-orange-500 dark:from-pink-400 dark:via-amber-400 dark:to-orange-400 mb-6 tracking-tight">
              Join the Vision
            </h1>
            <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Create an account in seconds and take full control of your Meta Glasses reviews.
            </p>
          </div>
        </div>
      
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        {/* Mobile decorative blobs */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-10 right-10 w-72 h-72 bg-pink-500/20 rounded-full filter blur-[80px] animate-blob"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-500/20 rounded-full filter blur-[80px] animate-blob animation-delay-2000"></div>
        </div>

        <div className="w-full max-w-md p-8 sm:p-10 glass rounded-[2rem] z-10 relative">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">Create Account</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Join the administration team</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50/80 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-sm text-center backdrop-blur-sm flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
              <TextField
                fullWidth
                id="name"
                name="name"
                placeholder="John Doe"
                variant="outlined"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlined className="text-slate-400" />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyles}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
              <TextField
                fullWidth
                id="email"
                name="email"
                placeholder="admin@example.com"
                variant="outlined"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined className="text-slate-400" />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyles}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Password</label>
              <TextField
                fullWidth
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                variant="outlined"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined className="text-slate-400" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={textFieldStyles}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Confirm Password</label>
              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                variant="outlined"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined className="text-slate-400" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={textFieldStyles}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3.5 px-4 bg-gradient-to-r from-pink-600 to-orange-500 hover:from-pink-500 hover:to-orange-400 text-white rounded-[1rem] font-bold text-lg shadow-[0_8px_20px_-6px_rgba(219,39,119,0.5)] transition-all hover:shadow-[0_12px_24px_-6px_rgba(219,39,119,0.6)] disabled:opacity-70 disabled:hover:shadow-none flex items-center justify-center transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? <CircularProgress size={28} color="inherit" thickness={5} /> : 'Register Now'}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-600 dark:text-slate-400 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-pink-600 dark:text-pink-400 font-bold hover:text-pink-500 transition-colors">
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1rem',
    transition: 'all 0.3s ease',
    '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.3)' },
    '&:hover fieldset': { borderColor: '#db2777' },
    '&.Mui-focused fieldset': { borderColor: '#db2777', borderWidth: '2px' },
    '.dark &': {
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
      '&:hover fieldset': { borderColor: '#f472b6' },
      '&.Mui-focused fieldset': { borderColor: '#f472b6' },
    }
  },
  '& .MuiInputBase-input': {
    color: 'inherit',
    paddingY: '14px',
    '&::placeholder': { color: '#94a3b8', opacity: 1 }
  }
};

export default Register;
