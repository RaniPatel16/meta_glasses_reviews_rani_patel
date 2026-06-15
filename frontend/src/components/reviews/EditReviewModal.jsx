import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress, IconButton, FormControlLabel, Switch, Rating, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { updateReview, fetchReviews, setSelectedReview } from '../../store/slices/reviewsSlice';

const EditReviewModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { actionLoading, selectedReview } = useSelector((state) => state.reviews);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: selectedReview?.name || '',
      title: selectedReview?.title || '',
      review: selectedReview?.review || '',
      rating: selectedReview?.rating || 5,
      country: selectedReview?.country || '',
      verifiedPurchase: selectedReview?.verifiedPurchase || false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      title: Yup.string().min(5, 'At least 5 chars').max(200, 'Max 200 chars').required('Required'),
      review: Yup.string().required('Required'),
      rating: Yup.number().min(1).max(5).required('Required'),
      country: Yup.string().required('Required')
    }),
    onSubmit: async (values) => {
      if (!selectedReview?.reviewID) return;
      const result = await dispatch(updateReview({ id: selectedReview.reviewID, data: values }));
      if (!result.error) {
        handleClose();
        dispatch(fetchReviews({ page: 1, limit: 10 }));
      }
    }
  });

  const handleClose = () => {
    dispatch(setSelectedReview(null));
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ className: 'glass rounded-2xl' }}>
      <DialogTitle className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
        <span className="font-bold text-slate-800 dark:text-white">Edit Review ({selectedReview?.reviewID})</span>
        <IconButton onClick={handleClose} size="small" className="text-slate-500">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={formik.handleSubmit}>
        <DialogContent className="space-y-4 pt-6">
          <TextField
            fullWidth label="Reviewer Name" name="name"
            value={formik.values.name} onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          
          <div className="flex flex-col gap-1">
            <Typography component="legend" className="text-slate-600 dark:text-slate-400 text-sm">Rating</Typography>
            <Rating
              name="rating"
              value={formik.values.rating}
              onChange={(event, newValue) => {
                formik.setFieldValue('rating', newValue);
              }}
            />
          </div>

          <TextField
            fullWidth label="Review Title" name="title"
            value={formik.values.title} onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
          
          <TextField
            fullWidth label="Review Text" name="review" multiline rows={4}
            value={formik.values.review} onChange={formik.handleChange}
            error={formik.touched.review && Boolean(formik.errors.review)}
            helperText={formik.touched.review && formik.errors.review}
          />

          <div className="flex items-center gap-4">
            <TextField
              fullWidth label="Country" name="country"
              value={formik.values.country} onChange={formik.handleChange}
              error={formik.touched.country && Boolean(formik.errors.country)}
              helperText={formik.touched.country && formik.errors.country}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.verifiedPurchase}
                  onChange={formik.handleChange}
                  name="verifiedPurchase"
                  color="primary"
                />
              }
              label={<span className="text-slate-700 dark:text-slate-300 whitespace-nowrap">Verified Purchase</span>}
            />
          </div>
        </DialogContent>
        
        <DialogActions className="p-4 border-t border-slate-200 dark:border-slate-700">
          <Button onClick={handleClose} disabled={actionLoading} className="text-slate-600 dark:text-slate-400">Cancel</Button>
          <Button type="submit" variant="contained" disabled={actionLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6">
            {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditReviewModal;
