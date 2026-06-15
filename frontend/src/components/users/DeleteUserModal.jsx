import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { deleteUser, fetchUsers, setSelectedUser } from '../../store/slices/usersSlice';

const DeleteUserModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { actionLoading, selectedUser } = useSelector((state) => state.users);

  const handleClose = () => {
    dispatch(setSelectedUser(null));
    onClose();
  };

  const handleDelete = async () => {
    const userId = selectedUser?._id || selectedUser?.id;
    if (!userId) return;

    const result = await dispatch(deleteUser(userId));
    if (!result.error) {
      handleClose();
      dispatch(fetchUsers({ page: 1, limit: 10 }));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{ className: 'glass rounded-2xl' }}>
      <DialogTitle className="flex justify-between items-center">
        <span className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <WarningAmberRoundedIcon className="text-red-500" /> Confirm Deletion
        </span>
        <IconButton onClick={handleClose} size="small" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Typography className="text-slate-600 dark:text-slate-300 mt-2">
          Are you sure you want to delete user <strong>{selectedUser?.name}</strong>? This action cannot be undone.
        </Typography>
      </DialogContent>
      
      <DialogActions className="p-4">
        <Button onClick={handleClose} disabled={actionLoading} className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl px-4">
          Cancel
        </Button>
        <Button 
          onClick={handleDelete} 
          variant="contained" 
          disabled={actionLoading}
          className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 shadow-md shadow-red-500/30"
        >
          {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserModal;
