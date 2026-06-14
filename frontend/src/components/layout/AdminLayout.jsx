import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const AdminLayout = () => {
  return (
    <Box className="flex min-h-screen transition-colors relative overflow-hidden bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {/* Premium Decorative Gradient Blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-300/30 dark:bg-indigo-600/10 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-pink-300/30 dark:bg-purple-600/10 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-amber-200/20 dark:bg-transparent blur-[100px] pointer-events-none z-0"></div>

      <Sidebar />
      <Box component="main" className="flex-grow flex flex-col min-w-0 z-10 relative">
        <Navbar />
        <Box className="p-6 md:p-8 flex-grow overflow-auto">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
