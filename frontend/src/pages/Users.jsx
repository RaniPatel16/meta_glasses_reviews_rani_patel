import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../store/slices/usersSlice';
import UserTable from '../components/users/UserTable';
import AddUserModal from '../components/users/AddUserModal';
import EditUserModal from '../components/users/EditUserModal';
import DeleteUserModal from '../components/users/DeleteUserModal';
import { Button, Pagination, TextField, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
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

  return (
    <>
      <SEO title="Users Management" description="Manage system administrators and user roles." />
      <div className="flex flex-col gap-6">
        {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">User Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage system administrators and users.</p>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md px-6 py-2 normal-case"
        >
          Add New User
        </Button>
      </div>

      {/* Toolbar / Search */}
      <div className="glass p-4 rounded-2xl flex items-center justify-between shadow-sm border border-white/40 dark:border-white/5">
        <TextField
          placeholder="Search users by name or email..."
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
          className="w-full sm:w-80"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '0.75rem',
              '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.3)' },
            }
          }}
        />
      </div>

      {/* Main Table */}
      <UserTable 
        users={users} 
        loading={loading} 
        onEdit={() => setIsEditOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
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
      <AddUserModal open={isAddOpen} onClose={() => setIsAddOpen(false)} />
      {isEditOpen && <EditUserModal open={isEditOpen} onClose={() => setIsEditOpen(false)} />}
      <DeleteUserModal open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} />
    </div>
    </>
  );
};

export default Users;
