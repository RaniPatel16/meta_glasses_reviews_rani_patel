import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { deleteReview, fetchReviews, clearReviewError, setSelectedReview } from '../../store/slices/reviewsSlice';

const DeleteReviewModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { selectedReview, actionLoading } = useSelector((state) => state.reviews);

  const handleClose = () => {
    dispatch(clearReviewError());
    dispatch(setSelectedReview(null));
    onClose();
  };

  const handleDelete = async () => {
    if (!selectedReview) return;
    const result = await dispatch(deleteReview(selectedReview._id || selectedReview.id));
    if (!result.error) {
      handleClose();
      dispatch(fetchReviews({ page: 1, limit: 10 }));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{ className: 'glass rounded-[24px] border border-white/20' }}>
      <DialogTitle className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-700/50">
        <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">Delete Review</span>
        <IconButton onClick={handleClose} size="small" className="text-slate-500 hover:text-rose-500 transition-colors">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent className="pt-8 pb-6 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
          <WarningAmberIcon className="text-red-500" sx={{ fontSize: 40 }} />
        </div>
        <Typography variant="h6" className="font-bold text-slate-800 dark:text-white mb-2">
          Are you completely sure?
        </Typography>
        <Typography className="text-slate-500 dark:text-slate-400">
          This will permanently delete the review by <span className="font-bold text-slate-700 dark:text-slate-300">{selectedReview?.name}</span>. This action cannot be undone.
        </Typography>
      </DialogContent>
      
      <DialogActions className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 justify-center gap-3">
        <Button onClick={handleClose} disabled={actionLoading} className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl px-6 font-bold">
          Cancel
        </Button>
        <Button 
          onClick={handleDelete} 
          variant="contained" 
          disabled={actionLoading}
          className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl px-6 shadow-lg shadow-red-500/30 font-bold normal-case"
        >
          {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Yes, Delete it'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteReviewModal;
