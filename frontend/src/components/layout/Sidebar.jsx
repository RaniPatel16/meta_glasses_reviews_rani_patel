import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Toolbar } from '@mui/material';
import { DashboardRounded, PeopleRounded, TableChartRounded, SettingsRounded, LogoutRounded } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { setSidebarOpen } from '../../store/slices/uiSlice';

const drawerWidth = 260;

const Sidebar = () => {
  const { sidebarOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardRounded />, path: '/dashboard' },
    { text: 'Users', icon: <PeopleRounded />, path: '/users' },
    { text: 'Reviews Data', icon: <TableChartRounded />, path: '/reviews' },
    { text: 'Settings', icon: <SettingsRounded />, path: '/settings' },
  ];

  const handleClose = () => {
    dispatch(setSidebarOpen(false));
  };

  const drawerContent = (
    <Box className="h-full flex flex-col glass border-r-0 transition-colors z-20">
      {/* Logo Area */}
      <div className="p-6 flex items-center h-[72px]">
        <h1 className="text-2xl font-bold text-gradient tracking-tight m-0">
          Meta Glasses
        </h1>
      </div>
      
      <Box className="flex-grow px-4 py-4">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 ml-4">
          Menu
        </div>
        <List className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton 
                  component={Link} 
                  to={item.path} 
                  onClick={handleClose}
                  className={`rounded-xl transition-all duration-300 ease-in-out ${
                    isActive 
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  sx={{ paddingY: 1.5 }}
                >
                  <ListItemIcon className={`min-w-[40px] transition-colors ${
                    isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '0.95rem' 
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Bottom Action */}
      <Box className="p-4 border-t border-slate-200 dark:border-slate-800">
        <ListItem disablePadding>
          <ListItemButton className="rounded-xl text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors">
            <ListItemIcon className="min-w-[40px] text-inherit">
              <LogoutRounded />
            </ListItemIcon>
            <ListItemText primary="Log Out" primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, background: 'transparent', borderRight: 'none' },
        }}
      >
        {drawerContent}
      </Drawer>
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth, 
            background: 'transparent',
            borderRight: '1px solid rgba(148, 163, 184, 0.2)', 
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
