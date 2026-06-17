import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews, setSelectedReview } from '../store/slices/reviewsSlice';
import ReviewTable from '../components/reviews/ReviewTable';
import AddReviewModal from '../components/reviews/AddReviewModal';
import EditReviewModal from '../components/reviews/EditReviewModal';
import DeleteReviewModal from '../components/reviews/DeleteReviewModal';
import ViewReviewModal from '../components/reviews/ViewReviewModal';
import { Button, Pagination, TextField, InputAdornment, MenuItem, Paper, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import StarRateIcon from '@mui/icons-material/StarRate';
import RateReviewIcon from '@mui/icons-material/RateReview';
import VerifiedIcon from '@mui/icons-material/Verified';
import SEO from '../components/seo/SEO';

const ReviewsData = () => {
  const dispatch = useDispatch();
  const { reviews, loading, pagination } = useSelector((state) => state.reviews);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState('all');

  // Modal States
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

  const stats = useMemo(() => {
    const total = pagination?.total || reviews.length || 0;
    const avgRating = reviews.length ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1) : 0;
    const verified = reviews.filter(r => r.verifiedPurchase).length || 0;
    
    return { total, avgRating, verified };
  }, [reviews, pagination]);

  return (
    <>
      <SEO title="Reviews Management" description="View, moderate, and manage all customer product reviews." />
      
      {/* w-full and max-w-full to guarantee it stretches completely */}
      <div className="flex flex-col gap-8 w-full max-w-full overflow-hidden pb-10">
        
        {/* Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 drop-shadow-sm">
              Review Analytics
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg">
              Manage, moderate, and analyze customer sentiment.
            </p>
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 text-white rounded-xl shadow-[0_10px_20px_-10px_rgba(249,115,22,0.5)] px-6 py-2.5 font-bold normal-case transform transition-transform hover:-translate-y-1"
          >
            Create Review
          </Button>
        </div>

        {/* 3-Column Flex Layout for Stats - Unique UI Element */}
        <div className="flex flex-wrap w-full gap-6">
          <div className="w-full sm:w-[calc(33.333%-16px)]">
            <Paper className="glass rounded-[24px] p-6 relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.3)] transition-all duration-500 border border-white/40 dark:border-white/5 h-full">
              <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-20 group-hover:rotate-12 transition-all duration-500">
                <RateReviewIcon sx={{ fontSize: 120 }} />
              </div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-lg shadow-orange-500/30 text-white transform group-hover:scale-110 transition-transform duration-500">
                  <RateReviewIcon fontSize="medium" />
                </div>
                <div>
                  <Typography className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{stats.total}</Typography>
                  <Typography className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Total Reviews</Typography>
                </div>
              </div>
            </Paper>
          </div>

          <div className="w-full sm:w-[calc(33.333%-16px)]">
            <Paper className="glass rounded-[24px] p-6 relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(234,179,8,0.3)] transition-all duration-500 border border-white/40 dark:border-white/5 h-full">
              <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-20 group-hover:rotate-12 transition-all duration-500">
                <StarRateIcon sx={{ fontSize: 120 }} />
              </div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 text-white transform group-hover:scale-110 transition-transform duration-500">
                  <StarRateIcon fontSize="medium" />
                </div>
                <div>
                  <Typography className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{stats.avgRating} <span className="text-lg text-slate-400">/ 5</span></Typography>
                  <Typography className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Average Rating</Typography>
                </div>
              </div>
            </Paper>
          </div>

          <div className="w-full sm:w-[calc(33.333%-16px)]">
            <Paper className="glass rounded-[24px] p-6 relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] transition-all duration-500 border border-white/40 dark:border-white/5 h-full">
              <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-20 group-hover:rotate-12 transition-all duration-500">
                <VerifiedIcon sx={{ fontSize: 120 }} />
              </div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 text-white transform group-hover:scale-110 transition-transform duration-500">
                  <VerifiedIcon fontSize="medium" />
                </div>
                <div>
                  <Typography className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{stats.verified}</Typography>
                  <Typography className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Verified Purchases</Typography>
                </div>
              </div>
            </Paper>
          </div>
        </div>

        <div className="flex flex-col w-full gap-6">
          {/* Toolbar / Search / Filter */}
          <div className="glass p-4 rounded-[20px] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-white/40 dark:border-white/5 w-full">
            <TextField
              placeholder="Search by title, review, or name..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-amber-500 dark:text-amber-400" />
                  </InputAdornment>
                ),
                className: "bg-white/50 dark:bg-slate-900/50 rounded-[12px] hover:bg-white dark:hover:bg-slate-900 transition-colors"
              }}
              className="w-full sm:flex-1"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '& fieldset': { borderColor: 'rgba(245, 158, 11, 0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(245, 158, 11, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#f59e0b', borderWidth: '2px' },
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
              className="w-full sm:w-56"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  '.dark &': { backgroundColor: 'rgba(15, 23, 42, 0.5)' },
                  '& fieldset': { borderColor: 'rgba(245, 158, 11, 0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(245, 158, 11, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#f59e0b', borderWidth: '2px' },
                }
              }}
            >
              <MenuItem value="all" className="font-medium">All Ratings</MenuItem>
              <MenuItem value="5" className="font-medium text-amber-500">★★★★★ (5 Stars)</MenuItem>
              <MenuItem value="4" className="font-medium text-amber-500">★★★★☆ (4 Stars)</MenuItem>
              <MenuItem value="3" className="font-medium text-amber-500">★★★☆☆ (3 Stars)</MenuItem>
              <MenuItem value="2" className="font-medium text-amber-500">★★☆☆☆ (2 Stars)</MenuItem>
              <MenuItem value="1" className="font-medium text-amber-500">★☆☆☆☆ (1 Star)</MenuItem>
            </TextField>
          </div>

          {/* Main Table */}
          <div className="w-full">
            <ReviewTable 
              reviews={reviews} 
              loading={loading} 
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onView={handleViewClick}
            />
          </div>

          {/* Pagination */}
          {pagination?.pages > 1 && (
            <div className="flex justify-end mt-2 w-full glass p-3 rounded-[16px] border border-white/40 dark:border-white/5">
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
                    fontWeight: 'bold',
                    '.dark &': { color: 'var(--tw-colors-slate-300)' },
                    '&.Mui-selected': {
                      backgroundColor: 'var(--tw-colors-amber-500)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'var(--tw-colors-amber-600)',
                      }
                    }
                  }
                }}
              />
            </div>
          )}
        </div>
        
        {/* Modals */}
        <AddReviewModal open={isAddOpen} onClose={() => setIsAddOpen(false)} />
        {isEditOpen && <EditReviewModal open={isEditOpen} onClose={() => setIsEditOpen(false)} />}
        <DeleteReviewModal open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} />
        <ViewReviewModal open={isViewOpen} onClose={() => setIsViewOpen(false)} />
        
      </div>
    </>
  );
};

export default ReviewsData;
