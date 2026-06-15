import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import RateReviewIcon from '@mui/icons-material/RateReview';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Placeholder data for Step 4 (will be replaced by real backend data in Step 5)
const mockBarData = [
  { name: 'Jan', reviews: 400 },
  { name: 'Feb', reviews: 300 },
  { name: 'Mar', reviews: 550 },
  { name: 'Apr', reviews: 200 },
  { name: 'May', reviews: 700 },
  { name: 'Jun', reviews: 650 },
];

const mockPieData = [
  { name: 'Verified', value: 800 },
  { name: 'Unverified', value: 300 },
];

const COLORS = ['#10b981', '#f43f5e'];

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <Paper className="glass rounded-2xl p-6 flex items-center justify-between shadow-sm border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
    <div>
      <Typography variant="body2" className="text-slate-500 dark:text-slate-400 font-medium mb-1">
        {title}
      </Typography>
      <Typography variant="h4" className="font-bold text-slate-800 dark:text-white">
        {value}
      </Typography>
    </div>
    <div className={`p-4 rounded-xl ${colorClass}`}>
      <Icon fontSize="large" className="text-white" />
    </div>
  </Paper>
);

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Header section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Analytics Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Overview of system metrics and review statistics.</p>
      </div>

      {/* Summary Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Users" 
            value="1,245" 
            icon={PeopleIcon} 
            colorClass="bg-blue-500 shadow-lg shadow-blue-500/30" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Reviews" 
            value="8,432" 
            icon={RateReviewIcon} 
            colorClass="bg-indigo-500 shadow-lg shadow-indigo-500/30" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Average Rating" 
            value="4.6" 
            icon={StarIcon} 
            colorClass="bg-amber-500 shadow-lg shadow-amber-500/30" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Verified Purchases" 
            value="6,120" 
            icon={CheckCircleIcon} 
            colorClass="bg-emerald-500 shadow-lg shadow-emerald-500/30" 
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper className="glass rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 h-[400px] flex flex-col">
            <Typography variant="h6" className="font-bold text-slate-800 dark:text-white mb-4">
              Reviews Over Time (Placeholder)
            </Typography>
            <Box className="flex-grow w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockBarData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="reviews" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper className="glass rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 h-[400px] flex flex-col">
            <Typography variant="h6" className="font-bold text-slate-800 dark:text-white mb-4">
              Review Authenticity (Placeholder)
            </Typography>
            <Box className="flex-grow w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {mockPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Unverified</span>
              </div>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
