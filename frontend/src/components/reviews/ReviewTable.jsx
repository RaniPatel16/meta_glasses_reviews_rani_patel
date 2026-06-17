import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Skeleton, Rating, Tooltip, Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VerifiedIcon from '@mui/icons-material/Verified';
import PublicIcon from '@mui/icons-material/Public';

const ReviewTable = ({ reviews, loading, onEdit, onDelete, onView }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
  };

  if (loading && reviews.length === 0) {
    return (
      <TableContainer component={Paper} className="glass rounded-[24px] shadow-none overflow-hidden border border-white/40 dark:border-white/5">
        <Table sx={{ minWidth: 800 }}>
          <TableHead className="bg-slate-50/50 dark:bg-slate-900/50">
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
      <div className="p-16 text-center glass rounded-[24px] border border-white/40 dark:border-white/5">
        <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">📝</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200">No Reviews Found</h3>
        <p className="text-slate-500 mt-2 text-lg">There are currently no reviews matching your filters.</p>
      </div>
    );
  }

  return (
    <TableContainer component={Paper} className="glass rounded-[24px] shadow-lg border border-white/40 dark:border-white/5 overflow-hidden bg-transparent">
      <Table sx={{ minWidth: 800 }} aria-label="reviews table">
        <TableHead className="bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md">
          <TableRow>
            <TableCell className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700 uppercase tracking-wider text-xs">Reviewer</TableCell>
            <TableCell className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700 uppercase tracking-wider text-xs">Rating</TableCell>
            <TableCell className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700 uppercase tracking-wider text-xs w-[30%]">Review Title</TableCell>
            <TableCell className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700 uppercase tracking-wider text-xs">Location</TableCell>
            <TableCell className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700 uppercase tracking-wider text-xs">Status</TableCell>
            <TableCell className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700 uppercase tracking-wider text-xs">Date</TableCell>
            <TableCell align="right" className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700 uppercase tracking-wider text-xs">Manage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reviews.map((review) => (
            <TableRow 
              key={review._id || review.id} 
              className="hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-colors group cursor-default"
            >
              <TableCell className="border-b-slate-200/50 dark:border-b-slate-800/50">
                <div className="flex items-center gap-3">
                  <Avatar 
                    className="bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm group-hover:scale-110 transition-transform"
                    sx={{ width: 36, height: 36, fontWeight: 'bold', fontSize: '1rem' }}
                  >
                    {(review.name || 'U').charAt(0).toUpperCase()}
                  </Avatar>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{review.name}</span>
                </div>
              </TableCell>
              
              <TableCell className="border-b-slate-200/50 dark:border-b-slate-800/50">
                <Rating 
                  value={review.rating || 0} 
                  readOnly 
                  size="small" 
                  precision={0.5} 
                  sx={{ 
                    color: '#f59e0b',
                    filter: 'drop-shadow(0px 2px 4px rgba(245, 158, 11, 0.3))' 
                  }} 
                />
              </TableCell>
              
              <TableCell className="border-b-slate-200/50 dark:border-b-slate-800/50">
                <div className="font-semibold text-slate-700 dark:text-slate-300 truncate pr-4 text-sm group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" title={review.title}>
                  "{review.title}"
                </div>
              </TableCell>
              
              <TableCell className="border-b-slate-200/50 dark:border-b-slate-800/50">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium text-sm">
                  <PublicIcon fontSize="small" className="text-slate-400 dark:text-slate-500" />
                  {review.country || 'Global'}
                </div>
              </TableCell>
              
              <TableCell className="border-b-slate-200/50 dark:border-b-slate-800/50">
                {review.verifiedPurchase ? (
                  <Chip 
                    icon={<VerifiedIcon style={{ color: 'inherit' }} />}
                    label="Verified" 
                    size="small" 
                    className="font-bold tracking-wide bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)] pl-1" 
                  />
                ) : (
                  <Chip 
                    label="Unverified" 
                    size="small" 
                    className="font-semibold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700" 
                  />
                )}
              </TableCell>
              
              <TableCell className="text-slate-500 dark:text-slate-400 font-medium text-sm border-b-slate-200/50 dark:border-b-slate-800/50">
                {formatDate(review.date)}
              </TableCell>
              
              <TableCell align="right" className="border-b-slate-200/50 dark:border-b-slate-800/50">
                <Tooltip title="View Details">
                  <IconButton 
                    onClick={() => onView(review)} 
                    size="small" 
                    className="text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 mr-1 transition-colors"
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit Review">
                  <IconButton 
                    onClick={() => onEdit(review)} 
                    size="small" 
                    className="text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-500/20 mr-1 transition-colors"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Review">
                  <IconButton 
                    onClick={() => onDelete(review)} 
                    size="small" 
                    className="text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
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
