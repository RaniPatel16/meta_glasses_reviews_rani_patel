import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Toolbar, IconButton, Box } from '@mui/material';
import { Menu as MenuIcon, LightMode, DarkMode, AccountCircle, NotificationsOutlined } from '@mui/icons-material';
import { toggleSidebar, toggleTheme } from '../../store/slices/uiSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.ui.mode);

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
          
          <IconButton className="text-slate-600 dark:text-slate-300">
            <AccountCircle sx={{ fontSize: 32 }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
