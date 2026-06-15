import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, CircularProgress, Paper, Avatar } from '@mui/material';
import { updateProfile, clearAuthError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import SEO from '../components/seo/SEO';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string()
        .min(6, 'At least 6 characters')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/, 'Must contain uppercase, lowercase, and a number'),
    }),
    onSubmit: async (values, { resetForm }) => {
      const dataToUpdate = { name: values.name, email: values.email };
      if (values.password) {
        dataToUpdate.password = values.password;
      }
      
      const userId = user?._id || user?.id;
      if (!userId) return;

      const result = await dispatch(updateProfile({ id: userId, data: dataToUpdate }));
      if (!result.error) {
        toast.success('Profile updated successfully!');
        resetForm({ values: { ...values, password: '' } });
      }
    },
  });

  if (!user) return null;

  return (
    <>
      <SEO title="My Profile" description="Manage your admin profile and personal preferences." />
      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Profile Management</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Update your personal information and account settings.</p>
      </div>

      <Paper className="glass rounded-2xl p-6 md:p-10 border border-white/40 dark:border-white/5 shadow-sm mt-4">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4 w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 pb-8 md:pb-0 md:pr-8">
            <Avatar 
              sx={{ width: 120, height: 120 }} 
              className="bg-indigo-600 text-4xl shadow-lg shadow-indigo-500/30"
            >
              {user?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{user?.name}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{user?.role?.toUpperCase()}</p>
            </div>
            <div className="mt-4 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 w-full text-center border border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Account Status</p>
              <p className="text-emerald-600 dark:text-emerald-400 font-bold capitalize">{user?.status || 'Active'}</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex-1 w-full">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Edit Information</h3>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Full Name"
                variant="outlined"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                InputProps={{ className: "bg-white/50 dark:bg-slate-900/50 rounded-xl" }}
              />
              
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                type="email"
                variant="outlined"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                InputProps={{ className: "bg-white/50 dark:bg-slate-900/50 rounded-xl" }}
              />

              <div>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="New Password (Optional)"
                  type="password"
                  variant="outlined"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{ className: "bg-white/50 dark:bg-slate-900/50 rounded-xl" }}
                />
                <p className="text-xs text-slate-400 mt-2 ml-1">Leave blank if you do not want to change your password.</p>
              </div>

              <div className="pt-4 flex justify-end">
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={loading || !formik.dirty}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 py-2.5 shadow-md shadow-indigo-500/30 normal-case font-semibold text-base"
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Paper>
    </div>
    </>
  );
};

export default Profile;
