import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../store/slices/usersSlice';
import UserTable from '../components/users/UserTable';
import AddUserModal from '../components/users/AddUserModal';
import EditUserModal from '../components/users/EditUserModal';
import DeleteUserModal from '../components/users/DeleteUserModal';
import { Button, Pagination, TextField, InputAdornment, Paper, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SEO from '../components/seo/SEO';

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading, pagination } = useSelector((state) => state.users);
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchUsers({ page, limit: 10, search: searchQuery }));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [dispatch, page, searchQuery]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const stats = useMemo(() => {
    const total = pagination?.total || users.length || 0;
    const admins = users.filter(u => u.role === 'admin').length || 0;
    const active = users.filter(u => (u.status || 'active') === 'active').length || 0;
    
    return { total, admins, active };
  }, [users, pagination]);

  return (
    <>
      <SEO title="Users Management" description="Manage system administrators and user roles." />
      
      {/* w-full and max-w-full to guarantee it stretches completely */}
      <div className="flex flex-col gap-8 w-full max-w-full overflow-hidden pb-10">
        
        {/* Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-sm">
              User Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg">
              Manage system administrators and user roles.
            </p>
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl shadow-[0_10px_20px_-10px_rgba(99,102,241,0.5)] px-6 py-2.5 font-bold normal-case transform transition-transform hover:-translate-y-1"
          >
            Add New User
          </Button>
        </div>

        {/* 3-Column Flex Layout for Stats - Unique UI Element */}
        <div className="flex flex-wrap w-full gap-6">
          <div className="w-full sm:w-[calc(33.333%-16px)]">
            <Paper className="glass rounded-[24px] p-6 relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.3)] transition-all duration-500 border border-white/40 dark:border-white/5 h-full">
              <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-20 group-hover:rotate-12 transition-all duration-500">
                <PeopleIcon sx={{ fontSize: 120 }} />
              </div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white transform group-hover:scale-110 transition-transform duration-500">
                  <PeopleIcon fontSize="medium" />
                </div>
                <div>
                  <Typography className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{stats.total}</Typography>
                  <Typography className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Total Users</Typography>
                </div>
              </div>
            </Paper>
          </div>

          <div className="w-full sm:w-[calc(33.333%-16px)]">
            <Paper className="glass rounded-[24px] p-6 relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(236,72,153,0.3)] transition-all duration-500 border border-white/40 dark:border-white/5 h-full">
              <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-20 group-hover:rotate-12 transition-all duration-500">
                <AdminPanelSettingsIcon sx={{ fontSize: 120 }} />
              </div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30 text-white transform group-hover:scale-110 transition-transform duration-500">
                  <AdminPanelSettingsIcon fontSize="medium" />
                </div>
                <div>
                  <Typography className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{stats.admins}</Typography>
                  <Typography className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Administrators</Typography>
                </div>
              </div>
            </Paper>
          </div>

          <div className="w-full sm:w-[calc(33.333%-16px)]">
            <Paper className="glass rounded-[24px] p-6 relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] transition-all duration-500 border border-white/40 dark:border-white/5 h-full">
              <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-20 group-hover:rotate-12 transition-all duration-500">
                <VerifiedUserIcon sx={{ fontSize: 120 }} />
              </div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 text-white transform group-hover:scale-110 transition-transform duration-500">
                  <VerifiedUserIcon fontSize="medium" />
                </div>
                <div>
                  <Typography className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{stats.active}</Typography>
                  <Typography className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Active Accounts</Typography>
                </div>
              </div>
            </Paper>
          </div>
        </div>

        <div className="flex flex-col w-full gap-6">
          {/* Toolbar / Search */}
          <div className="glass p-4 rounded-[20px] flex items-center justify-between shadow-sm border border-white/40 dark:border-white/5 w-full">
            <TextField
              placeholder="Search users by name or email..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-indigo-400 dark:text-indigo-500" />
                  </InputAdornment>
                ),
                className: "bg-white/50 dark:bg-slate-900/50 rounded-[12px] hover:bg-white dark:hover:bg-slate-900 transition-colors"
              }}
              className="w-full sm:w-96"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '& fieldset': { borderColor: 'rgba(99, 102, 241, 0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#6366f1', borderWidth: '2px' },
                }
              }}
            />
          </div>

          {/* Main Table */}
          <div className="w-full">
            <UserTable 
              users={users} 
              loading={loading} 
              onEdit={() => setIsEditOpen(true)}
              onDelete={() => setIsDeleteOpen(true)}
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
                    '.dark &': { color: 'var(--tw-colors-slate-300)' }
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Modals */}
        <AddUserModal open={isAddOpen} onClose={() => setIsAddOpen(false)} />
        {isEditOpen && <EditUserModal open={isEditOpen} onClose={() => setIsEditOpen(false)} />}
        <DeleteUserModal open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} />
      </div>
    </>
  );
};

export default Users;
