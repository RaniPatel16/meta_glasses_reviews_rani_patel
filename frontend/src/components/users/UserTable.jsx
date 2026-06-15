import React from 'react';
import { useDispatch } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Skeleton } from '@mui/material';
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
      <TableContainer component={Paper} className="glass rounded-2xl shadow-none overflow-hidden">
        <Table sx={{ minWidth: 650 }}>
          <TableHead className="bg-slate-50/50 dark:bg-slate-800/50">
            <TableRow>
              {['Full Name', 'Email', 'Role', 'Status', 'Joined Date', 'Actions'].map((header) => (
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
      <div className="p-12 text-center glass rounded-2xl">
        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No Users Found</h3>
        <p className="text-slate-500 mt-2">There are currently no users in the system.</p>
      </div>
    );
  }

  return (
    <TableContainer component={Paper} className="glass rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden bg-transparent">
      <Table sx={{ minWidth: 650 }} aria-label="users table">
        <TableHead className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
          <TableRow>
            <TableCell className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700">ID</TableCell>
            <TableCell className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700">Full Name</TableCell>
            <TableCell className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700">Email</TableCell>
            <TableCell className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700">Role</TableCell>
            <TableCell className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700">Status</TableCell>
            <TableCell className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700">Joined Date</TableCell>
            <TableCell align="right" className="font-bold text-slate-700 dark:text-slate-200 border-b-slate-200 dark:border-b-slate-700">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow 
              key={user._id || user.id} 
              className="hover:bg-white/30 dark:hover:bg-slate-800/30 transition-colors"
            >
              <TableCell className="text-slate-600 dark:text-slate-400 border-b-slate-200/50 dark:border-b-slate-800/50 text-xs">
                {(user._id || user.id || '').substring(0, 8)}...
              </TableCell>
              <TableCell className="font-semibold text-slate-800 dark:text-slate-200 border-b-slate-200/50 dark:border-b-slate-800/50">
                {user.name}
              </TableCell>
              <TableCell className="text-slate-600 dark:text-slate-400 border-b-slate-200/50 dark:border-b-slate-800/50">
                {user.email}
              </TableCell>
              <TableCell className="border-b-slate-200/50 dark:border-b-slate-800/50">
                <Chip 
                  label={user.role} 
                  size="small" 
                  className={`capitalize font-semibold ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300' 
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`} 
                />
              </TableCell>
              <TableCell className="border-b-slate-200/50 dark:border-b-slate-800/50">
                <Chip 
                  label={user.status || 'active'} 
                  size="small" 
                  className={`capitalize font-semibold ${
                    (user.status || 'active') === 'active' 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                      : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                  }`} 
                />
              </TableCell>
              <TableCell className="text-slate-500 dark:text-slate-400 text-sm border-b-slate-200/50 dark:border-b-slate-800/50">
                {formatDate(user.createdAt)}
              </TableCell>
              <TableCell align="right" className="border-b-slate-200/50 dark:border-b-slate-800/50">
                <IconButton 
                  onClick={() => handleEdit(user)} 
                  size="small" 
                  className="text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 mr-1"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  onClick={() => handleDelete(user)} 
                  size="small" 
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
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
