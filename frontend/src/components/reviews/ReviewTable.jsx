import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Skeleton, Rating, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ReviewTable = ({ reviews, loading, onEdit, onDelete, onView }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
  };

  if (loading && reviews.length === 0) {
    return (
      <TableContainer component={Paper} className="glass rounded-2xl shadow-none overflow-hidden">
        <Table sx={{ minWidth: 800 }}>
          <TableHead className="bg-slate-50/50 dark:bg-slate-800/50">
            <TableRow>
              {['Reviewer', 'Rating', 'Title', 'Country', 'Status', 'Date', 'Actions'].map((header) => (
                <TableCell key={header} className="font-semibold text-slate-600 dark:text-slate-300 border-b-slate-200 dark:border-b-slate-700">
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(7)].map((_, j) => (
                  <TableCell key={j} className="border-b-slate-100 dark:border-b-slate-800"><Skeleton animation="wave" height={24} /></TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (!loading && reviews.length === 0) {
    return (
      <div className="p-12 text-center glass rounded-2xl">
        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No Reviews Found</h3>
        <p className="text-slate-500 mt-2">There are currently no reviews matching your criteria.</p>
      </div>
    );
  }

  return (
    <TableContainer component={Paper} className="glass rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden bg-transparent">
      <Table sx={{ minWidth: 800 }} aria-label="reviews table">
        <TableHead className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
          <TableRow>
            <TableCell className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700">Reviewer</TableCell>
            <TableCell className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700">Rating</TableCell>
            <TableCell className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700">Title</TableCell>
            <TableCell className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700">Country</TableCell>
            <TableCell className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700">Status</TableCell>
            <TableCell className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700">Date</TableCell>
            <TableCell align="right" className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reviews.map((review) => (
            <TableRow 
              key={review._id || review.id} 
              className="hover:bg-white/30 dark:hover:bg-slate-800/30 transition-colors"
            >
              <TableCell className="font-semibold text-slate-800 dark:text-slate-200 border-b-slate-200/50 dark:border-b-slate-800/50">
                {review.name}
              </TableCell>
              <TableCell className="border-b-slate-200/50 dark:border-b-slate-800/50">
                <Rating value={review.rating || 0} readOnly size="small" precision={0.5} />
              </TableCell>
              <TableCell className="text-slate-600 dark:text-slate-400 border-b-slate-200/50 dark:border-b-slate-800/50 max-w-[200px] truncate" title={review.title}>
                {review.title}
              </TableCell>
              <TableCell className="text-slate-600 dark:text-slate-400 border-b-slate-200/50 dark:border-b-slate-800/50">
                {review.country}
              </TableCell>
              <TableCell className="border-b-slate-200/50 dark:border-b-slate-800/50">
                <Chip 
                  label={review.verifiedPurchase ? 'Verified' : 'Unverified'} 
                  size="small" 
                  className={`font-semibold ${
                    review.verifiedPurchase
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`} 
                />
              </TableCell>
              <TableCell className="text-slate-500 dark:text-slate-400 text-sm border-b-slate-200/50 dark:border-b-slate-800/50">
                {formatDate(review.date)}
              </TableCell>
              <TableCell align="right" className="border-b-slate-200/50 dark:border-b-slate-800/50">
                <Tooltip title="View Details">
                  <IconButton 
                    onClick={() => onView(review)} 
                    size="small" 
                    className="text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 mr-1"
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit Review">
                  <IconButton 
                    onClick={() => onEdit(review)} 
                    size="small" 
                    className="text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 mr-1"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Review">
                  <IconButton 
                    onClick={() => onDelete(review)} 
                    size="small" 
                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReviewTable;
