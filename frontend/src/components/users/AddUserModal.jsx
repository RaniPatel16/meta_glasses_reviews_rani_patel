import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, CircularProgress, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { createUser, fetchUsers } from '../../store/slices/usersSlice';

const AddUserModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { actionLoading } = useSelector((state) => state.users);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
      status: 'active'
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string()
        .min(6, 'At least 6 characters')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/, 'Must contain uppercase, lowercase, and a number')
        .required('Required'),
      role: Yup.string().required('Required'),
      status: Yup.string().required('Required')
    }),
    onSubmit: async (values, { resetForm }) => {
      const result = await dispatch(createUser(values));
      if (!result.error) {
        resetForm();
        onClose();
        dispatch(fetchUsers({ page: 1, limit: 10 })); // Refresh table
      }
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ className: 'glass rounded-2xl' }}>
      <DialogTitle className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
        <span className="font-bold text-slate-800 dark:text-white">Add New User</span>
        <IconButton onClick={onClose} size="small" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={formik.handleSubmit}>
        <DialogContent className="space-y-4 pt-6">
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <TextField
            fullWidth
            select
            label="Role"
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
          <TextField
            fullWidth
            select
            label="Status"
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </DialogContent>
        
        <DialogActions className="p-4 border-t border-slate-200 dark:border-slate-700">
          <Button onClick={onClose} disabled={actionLoading} className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl px-4">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={actionLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 shadow-md shadow-indigo-500/30"
          >
            {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Create User'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddUserModal;
