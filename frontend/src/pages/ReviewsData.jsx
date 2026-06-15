import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews, setSelectedReview } from '../store/slices/reviewsSlice';
import ReviewTable from '../components/reviews/ReviewTable';
import AddReviewModal from '../components/reviews/AddReviewModal';
import EditReviewModal from '../components/reviews/EditReviewModal';
import DeleteReviewModal from '../components/reviews/DeleteReviewModal';
import ViewReviewModal from '../components/reviews/ViewReviewModal';
import { Button, Pagination, TextField, InputAdornment, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const ReviewsData = () => {
  const dispatch = useDispatch();
  const { reviews, loading, pagination } = useSelector((state) => state.reviews);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState('all');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = { page, limit: 10 };
      if (searchQuery) params.search = searchQuery;
      if (ratingFilter !== 'all') params.rating = ratingFilter;
      
      dispatch(fetchReviews(params));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [dispatch, page, searchQuery, ratingFilter]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleAddClick = () => {
    setIsAddOpen(true);
  };

  const handleEditClick = (review) => {
    dispatch(setSelectedReview(review));
    setIsEditOpen(true);
  };

  const handleDeleteClick = (review) => {
    dispatch(setSelectedReview(review));
    setIsDeleteOpen(true);
  };

  const handleViewClick = (review) => {
    dispatch(setSelectedReview(review));
    setIsViewOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Reviews Data</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and moderate customer reviews from the dataset.</p>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md px-6 py-2 normal-case"
        >
          Add New Review
        </Button>
      </div>

      {/* Toolbar / Search / Filter */}
      <div className="glass p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4 shadow-sm border border-white/40 dark:border-white/5">
        <TextField
          placeholder="Search by title, review, or name..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="text-slate-400" />
              </InputAdornment>
            ),
            className: "bg-white/50 dark:bg-slate-800/50 rounded-xl"
          }}
          className="w-full sm:flex-1"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '0.75rem',
              '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.3)' },
            }
          }}
        />
        
        <TextField
          select
          size="small"
          value={ratingFilter}
          onChange={(e) => {
            setRatingFilter(e.target.value);
            setPage(1); // Reset page on filter change
          }}
          className="w-full sm:w-48 bg-white/50 dark:bg-slate-800/50 rounded-xl"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '0.75rem',
              '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.3)' },
            }
          }}
        >
          <MenuItem value="all">All Ratings</MenuItem>
          <MenuItem value="5">5 Stars</MenuItem>
          <MenuItem value="4">4 Stars</MenuItem>
          <MenuItem value="3">3 Stars</MenuItem>
          <MenuItem value="2">2 Stars</MenuItem>
          <MenuItem value="1">1 Star</MenuItem>
        </TextField>
      </div>

      {/* Main Table */}
      <ReviewTable 
        reviews={reviews} 
        loading={loading} 
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onView={handleViewClick}
      />

      {/* Pagination */}
      {pagination?.pages > 1 && (
        <div className="flex justify-end mt-4">
          <Pagination 
            count={pagination.pages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
            shape="rounded"
            className="dark:text-white"
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'var(--tw-colors-slate-600)',
                '.dark &': { color: 'var(--tw-colors-slate-300)' }
              }
            }}
          />
        </div>
      )}

      {/* Modals */}
      <AddReviewModal open={isAddOpen} onClose={() => setIsAddOpen(false)} />
      {isEditOpen && <EditReviewModal open={isEditOpen} onClose={() => setIsEditOpen(false)} />}
      <DeleteReviewModal open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} />
      {isViewOpen && <ViewReviewModal open={isViewOpen} onClose={() => setIsViewOpen(false)} />}
    </div>
  );
};

export default ReviewsData;
