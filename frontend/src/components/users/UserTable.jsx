import React from 'react';
import { useDispatch } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Skeleton, Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { setSelectedUser } from '../../store/slices/usersSlice';

const UserTable = ({ users, loading, onEdit, onDelete }) => {
  const dispatch = useDispatch();

  const handleEdit = (user) => {
    dispatch(setSelectedUser(user));
    onEdit();
  };

  const handleDelete = (user) => {
    dispatch(setSelectedUser(user));
    onDelete();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
  };

  if (loading && users.length === 0) {
    return (
      <TableContainer component={Paper} className="glass rounded-[24px] shadow-none overflow-hidden border border-white/40 dark:border-white/5">
        <Table sx={{ minWidth: 650 }}>
          <TableHead className="bg-slate-50/50 dark:bg-slate-900/50">
            <TableRow>
              {['User', 'Email', 'Role', 'Status', 'Joined Date', 'Actions'].map((header) => (
                <TableCell key={header} className="font-semibold text-slate-600 dark:text-slate-300 border-b-slate-200 dark:border-b-slate-700">
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(6)].map((_, j) => (
                  <TableCell key={j} className="border-b-slate-100 dark:border-b-slate-800"><Skeleton animation="wave" height={24} /></TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (!loading && users.length === 0) {
    return (
      <div className="p-16 text-center glass rounded-[24px] border border-white/40 dark:border-white/5">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">🔍</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200">No Users Found</h3>
        <p className="text-slate-500 mt-2 text-lg">There are currently no users matching your criteria.</p>
      </div>
    );
  }

  return (
    <TableContainer component={Paper} className="glass rounded-[24px] shadow-lg border border-white/40 dark:border-white/5 overflow-hidden bg-transparent">
      <Table sx={{ minWidth: 650 }} aria-label="users table">
        <TableHead className="bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md">
          <TableRow>
            <TableCell className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700 uppercase tracking-wider text-xs">User Profile</TableCell>
            <TableCell className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700 uppercase tracking-wider text-xs">Contact</TableCell>
            <TableCell className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700 uppercase tracking-wider text-xs">Access Level</TableCell>
            <TableCell className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700 uppercase tracking-wider text-xs">Account Status</TableCell>
            <TableCell className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700 uppercase tracking-wider text-xs">Joined Date</TableCell>
            <TableCell align="right" className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700 uppercase tracking-wider text-xs">Manage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow 
              key={user._id || user.id} 
              className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors group cursor-default"
            >
              <TableCell className="border-b-slate-200/50 dark:border-b-slate-800/50">
                <div className="flex items-center gap-3">
                  <Avatar 
                    className="bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md group-hover:scale-110 transition-transform"
                    sx={{ width: 40, height: 40, fontWeight: 'bold' }}
                  >
                    {(user.name || 'U').charAt(0).toUpperCase()}
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-base">{user.name}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 tracking-wider">ID: {(user._id || user.id || '').substring(0, 8)}</span>
                  </div>
                </div>
              </TableCell>
              
              <TableCell className="border-b-slate-200/50 dark:border-b-slate-800/50">
                <span className="text-slate-600 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-sm border border-slate-200 dark:border-slate-700">
                  {user.email}
                </span>
              </TableCell>
              
              <TableCell className="border-b-slate-200/50 dark:border-b-slate-800/50">
                <Chip 
                  label={user.role} 
                  size="small" 
                  className={`capitalize font-bold tracking-wide px-1 ${
                    user.role === 'admin' 
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 dark:text-pink-300 border border-purple-500/30' 
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`} 
                />
              </TableCell>
              
              <TableCell className="border-b-slate-200/50 dark:border-b-slate-800/50">
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${(user.status || 'active') === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                  <span className={`capitalize font-semibold text-sm ${
                    (user.status || 'active') === 'active' 
                      ? 'text-emerald-700 dark:text-emerald-400' 
                      : 'text-red-700 dark:text-red-400'
                  }`}>
                    {user.status || 'Active'}
                  </span>
                </span>
              </TableCell>
              
              <TableCell className="text-slate-500 dark:text-slate-400 font-medium text-sm border-b-slate-200/50 dark:border-b-slate-800/50">
                {formatDate(user.createdAt)}
              </TableCell>
              
              <TableCell align="right" className="border-b-slate-200/50 dark:border-b-slate-800/50">
                <IconButton 
                  onClick={() => handleEdit(user)} 
                  size="small" 
                  className="text-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 mr-2 transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/30"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  onClick={() => handleDelete(user)} 
                  size="small" 
                  className="text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-500/30"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
