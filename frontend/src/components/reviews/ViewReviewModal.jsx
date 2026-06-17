import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Rating, Chip, Avatar, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VerifiedIcon from '@mui/icons-material/Verified';
import PublicIcon from '@mui/icons-material/Public';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { clearReviewError, setSelectedReview } from '../../store/slices/reviewsSlice';

const ViewReviewModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { selectedReview } = useSelector((state) => state.reviews);

  const handleClose = () => {
    dispatch(clearReviewError());
    dispatch(setSelectedReview(null));
    onClose();
  };

  if (!selectedReview) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ className: 'glass rounded-[24px] border border-white/20' }}>
      <DialogTitle className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-700/50">
        <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Review Details</span>
        <IconButton onClick={handleClose} size="small" className="text-slate-500 hover:text-emerald-500 transition-colors">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent className="pt-6 pb-8">
        <div className="flex flex-col gap-6">
          {/* Header section with User Info */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar 
                className="bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md"
                sx={{ width: 56, height: 56, fontSize: '1.5rem', fontWeight: 'bold' }}
              >
                {(selectedReview.name || 'U').charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <Typography variant="h6" className="font-bold text-slate-800 dark:text-white leading-tight">
                  {selectedReview.name}
                </Typography>
                <div className="flex items-center gap-2 mt-1">
                  <Rating 
                    value={selectedReview.rating || 0} 
                    readOnly 
                    size="small" 
                    precision={0.5} 
                    sx={{ color: '#f59e0b' }} 
                  />
                  <span className="text-slate-400 text-sm font-medium">({selectedReview.rating || 0}/5)</span>
                </div>
              </div>
            </div>
            
            {selectedReview.verifiedPurchase && (
              <Chip 
                icon={<VerifiedIcon style={{ color: 'inherit' }} />}
                label="Verified Purchase" 
                size="small" 
                className="font-bold tracking-wide bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30" 
              />
            )}
          </div>

          <Divider className="border-slate-200/50 dark:border-slate-700/50" />

          {/* Review Content */}
          <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-200/50 dark:border-slate-700/50">
            <Typography variant="h6" className="font-bold text-slate-800 dark:text-slate-200 mb-3">
              "{selectedReview.title}"
            </Typography>
            <Typography className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
              {selectedReview.comment}
            </Typography>
          </div>

          {/* Metadata Footer */}
          <div className="flex flex-wrap items-center gap-6 mt-2 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
              <PublicIcon fontSize="small" className="text-slate-400" />
              <span className="font-medium">{selectedReview.country || 'Global'}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
              <CalendarTodayIcon fontSize="small" className="text-slate-400" />
              <span className="font-medium">{formatDate(selectedReview.date || selectedReview.createdAt)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReviewModal;
