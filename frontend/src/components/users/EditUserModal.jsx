import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, CircularProgress, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { updateUser, fetchUsers, setSelectedUser } from '../../store/slices/usersSlice';

const EditUserModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { actionLoading, selectedUser } = useSelector((state) => state.users);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: selectedUser?.name || '',
      email: selectedUser?.email || '',
      role: selectedUser?.role || 'user',
      status: selectedUser?.status || 'active'
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      role: Yup.string().required('Required'),
      status: Yup.string().required('Required')
    }),
    onSubmit: async (values) => {
      const userId = selectedUser?._id || selectedUser?.id;
      if (!userId) return;
      
      const result = await dispatch(updateUser({ id: userId, data: values }));
      if (!result.error) {
        handleClose();
        dispatch(fetchUsers({ page: 1, limit: 10 })); // Refresh table
      }
    }
  });

  const handleClose = () => {
    dispatch(setSelectedUser(null));
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ className: 'glass rounded-2xl' }}>
      <DialogTitle className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
        <span className="font-bold text-slate-800 dark:text-white">Edit User</span>
        <IconButton onClick={handleClose} size="small" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
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
          <Button onClick={handleClose} disabled={actionLoading} className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl px-4">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={actionLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 shadow-md shadow-indigo-500/30"
          >
            {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditUserModal;
