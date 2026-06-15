import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { deleteReview, fetchReviews, setSelectedReview } from '../../store/slices/reviewsSlice';

const DeleteReviewModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { actionLoading, selectedReview } = useSelector((state) => state.reviews);

  const handleClose = () => {
    dispatch(setSelectedReview(null));
    onClose();
  };

  const handleDelete = async () => {
    if (!selectedReview?.reviewID) return;

    const result = await dispatch(deleteReview(selectedReview.reviewID));
    if (!result.error) {
      handleClose();
      dispatch(fetchReviews({ page: 1, limit: 10 }));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{ className: 'glass rounded-2xl' }}>
      <DialogTitle className="flex justify-between items-center">
        <span className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <WarningAmberRoundedIcon className="text-red-500" /> Confirm Deletion
        </span>
        <IconButton onClick={handleClose} size="small" className="text-slate-500">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Typography className="text-slate-600 dark:text-slate-300 mt-2">
          Are you sure you want to delete review <strong>{selectedReview?.reviewID}</strong> by <strong>{selectedReview?.name}</strong>? This action cannot be undone.
        </Typography>
      </DialogContent>
      
      <DialogActions className="p-4">
        <Button onClick={handleClose} disabled={actionLoading} className="text-slate-600 dark:text-slate-400">Cancel</Button>
        <Button onClick={handleDelete} variant="contained" disabled={actionLoading} className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6">
          {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteReviewModal;
