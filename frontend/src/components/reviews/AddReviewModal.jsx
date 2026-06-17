import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, CircularProgress, IconButton, Rating, Typography, FormControlLabel, Switch } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { createReview, fetchReviews } from '../../store/slices/reviewsSlice';

const AddReviewModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { actionLoading } = useSelector((state) => state.reviews);

  const formik = useFormik({
    initialValues: {
      name: '',
      rating: 5,
      title: '',
      comment: '',
      country: 'United States',
      verifiedPurchase: true
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      rating: Yup.number().min(1).max(5).required('Required'),
      title: Yup.string().required('Required'),
      comment: Yup.string().required('Required'),
      country: Yup.string().required('Required')
    }),
    onSubmit: async (values, { resetForm }) => {
      const result = await dispatch(createReview(values));
      if (!result.error) {
        resetForm();
        onClose();
        dispatch(fetchReviews({ page: 1, limit: 10 })); // Refresh table
      }
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ className: 'glass rounded-[24px] border border-white/20' }}>
      <DialogTitle className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-700/50">
        <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Create New Review</span>
        <IconButton onClick={onClose} size="small" className="text-slate-500 hover:text-rose-500 transition-colors">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={formik.handleSubmit}>
        <DialogContent className="space-y-5 pt-6">
          <TextField
            fullWidth
            label="Reviewer Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
          
          <div className="flex flex-col gap-2">
            <Typography className="text-slate-600 dark:text-slate-400 font-semibold text-sm">Rating</Typography>
            <Rating
              name="rating"
              value={formik.values.rating}
              onChange={(event, newValue) => {
                formik.setFieldValue('rating', newValue);
              }}
              size="large"
              sx={{ color: '#f59e0b' }}
            />
            {formik.touched.rating && formik.errors.rating && (
              <Typography color="error" variant="caption">{formik.errors.rating}</Typography>
            )}
          </div>

          <TextField
            fullWidth
            label="Review Title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Review Comment"
            name="comment"
            value={formik.values.comment}
            onChange={formik.handleChange}
            error={formik.touched.comment && Boolean(formik.errors.comment)}
            helperText={formik.touched.comment && formik.errors.comment}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
          
          <div className="flex gap-4">
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={formik.values.country}
              onChange={formik.handleChange}
              error={formik.touched.country && Boolean(formik.errors.country)}
              helperText={formik.touched.country && formik.errors.country}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            
            <div className="flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded-xl px-4 flex-1">
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.verifiedPurchase}
                    onChange={(e) => formik.setFieldValue('verifiedPurchase', e.target.checked)}
                    color="primary"
                  />
                }
                label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Verified</span>}
              />
            </div>
          </div>
        </DialogContent>
        
        <DialogActions className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <Button onClick={onClose} disabled={actionLoading} className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl px-4 font-bold">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={actionLoading}
            className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-xl px-6 shadow-lg shadow-orange-500/30 font-bold normal-case"
          >
            {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Submit Review'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddReviewModal;
