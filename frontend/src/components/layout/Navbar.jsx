import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Box, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import { 
  Menu as MenuIcon, LightMode, DarkMode, AccountCircle, 
  NotificationsOutlined, Settings as SettingsIcon, Logout, Person 
} from '@mui/icons-material';
import { toggleSidebar, toggleTheme } from '../../store/slices/uiSlice';
import toast from 'react-hot-toast';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mode = useSelector((state) => state.ui.mode);

  // State for profile menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleClose();
  };

  const handleLogout = () => {
    handleClose();
    // In a real app, you'd dispatch a logout action here
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleNotificationsClick = () => {
    toast('You have 0 new notifications', {
      icon: '🔔',
    });
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      className="glass border-b transition-colors z-20"
      sx={{ background: 'transparent' }}
    >
      <Toolbar className="flex justify-between items-center py-2 min-h-[72px]">
        <div className="flex items-center gap-4">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => dispatch(toggleSidebar())}
            sx={{ display: { xs: 'block', md: 'none' } }}
            className="text-slate-700 dark:text-slate-300"
          >
            <MenuIcon />
          </IconButton>
          
          <div className="hidden md:flex flex-col">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white tracking-tight m-0">
              Admin Dashboard
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Welcome back, Super Admin
            </span>
          </div>
        </div>

        <Box className="flex items-center gap-2">
          <IconButton 
            onClick={handleNotificationsClick}
            className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <NotificationsOutlined />
          </IconButton>
          
          <IconButton 
            onClick={() => dispatch(toggleTheme())}
            className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {mode === 'dark' ? <LightMode className="text-amber-400" /> : <DarkMode className="text-indigo-600" />}
          </IconButton>

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block"></div>
          
          <IconButton 
            onClick={handleProfileClick}
            aria-controls={open ? 'profile-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <AccountCircle sx={{ fontSize: 32 }} />
          </IconButton>

          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 0,
              className: 'mt-2 border border-slate-200 dark:border-slate-700 shadow-xl dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] bg-white dark:bg-slate-800 rounded-xl overflow-hidden',
              sx: { minWidth: 200 }
            }}
          >
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 mb-2">
              <p className="text-sm font-bold text-slate-800 dark:text-white">Super Admin</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">admin@metaglasses.com</p>
            </div>
            
            <MenuItem onClick={() => handleNavigate('/profile')} className="hover:bg-slate-100 dark:hover:bg-slate-700/50 py-2.5 transition-colors">
              <ListItemIcon>
                <Person fontSize="small" className="text-indigo-500" />
              </ListItemIcon>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">My Profile</span>
            </MenuItem>
            
            <MenuItem onClick={() => handleNavigate('/settings')} className="hover:bg-slate-100 dark:hover:bg-slate-700/50 py-2.5 transition-colors">
              <ListItemIcon>
                <SettingsIcon fontSize="small" className="text-amber-500" />
              </ListItemIcon>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Settings</span>
            </MenuItem>
            
            <Divider className="my-1 border-slate-200 dark:border-slate-700" />
            
            <MenuItem onClick={handleLogout} className="hover:bg-rose-50 dark:hover:bg-rose-900/20 py-2.5 transition-colors group">
              <ListItemIcon>
                <Logout fontSize="small" className="text-rose-500 group-hover:text-rose-600 transition-colors" />
              </ListItemIcon>
              <span className="text-sm font-semibold text-rose-500 group-hover:text-rose-600 transition-colors">Logout</span>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
