import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography, Rating, Chip, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { setSelectedReview } from '../../store/slices/reviewsSlice';

const ViewReviewModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { selectedReview } = useSelector((state) => state.reviews);

  const handleClose = () => {
    dispatch(setSelectedReview(null));
    onClose();
  };

  if (!selectedReview) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ className: 'glass rounded-2xl' }}>
      <DialogTitle className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
        <span className="font-bold text-slate-800 dark:text-white">Review Details</span>
        <IconButton onClick={handleClose} size="small" className="text-slate-500">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent className="pt-6 space-y-6">
        <div>
          <Typography variant="caption" className="text-slate-400 font-semibold uppercase tracking-wider">Reviewer</Typography>
          <Typography variant="body1" className="text-slate-800 dark:text-slate-200 font-medium">{selectedReview.name}</Typography>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <Typography variant="caption" className="text-slate-400 font-semibold uppercase tracking-wider block">Rating</Typography>
            <Rating value={selectedReview.rating} readOnly size="small" />
          </div>
          <div>
            <Typography variant="caption" className="text-slate-400 font-semibold uppercase tracking-wider block">Status</Typography>
            <Chip 
              label={selectedReview.verifiedPurchase ? 'Verified Purchase' : 'Unverified'} 
              size="small" 
              className={selectedReview.verifiedPurchase ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 font-semibold' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}
            />
          </div>
        </div>

        <div>
          <Typography variant="caption" className="text-slate-400 font-semibold uppercase tracking-wider">Title</Typography>
          <Typography variant="h6" className="text-slate-800 dark:text-slate-200 font-bold leading-tight">{selectedReview.title}</Typography>
        </div>

        <Divider className="border-slate-200 dark:border-slate-700" />

        <div>
          <Typography variant="caption" className="text-slate-400 font-semibold uppercase tracking-wider">Review Content</Typography>
          <Typography variant="body1" className="text-slate-600 dark:text-slate-400 mt-1 whitespace-pre-wrap">
            {selectedReview.review}
          </Typography>
        </div>

        <div className="flex gap-8">
          <div>
            <Typography variant="caption" className="text-slate-400 font-semibold uppercase tracking-wider">Location</Typography>
            <Typography variant="body2" className="text-slate-700 dark:text-slate-300">{selectedReview.country}</Typography>
          </div>
          <div>
            <Typography variant="caption" className="text-slate-400 font-semibold uppercase tracking-wider">Date</Typography>
            <Typography variant="body2" className="text-slate-700 dark:text-slate-300">
              {new Date(selectedReview.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
          </div>
        </div>
      </DialogContent>
      
      <DialogActions className="p-4 border-t border-slate-200 dark:border-slate-700">
        <Button onClick={handleClose} variant="contained" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewReviewModal;
