import React, { useEffect, useState } from 'react';
import { Paper, Typography, CircularProgress, Box, IconButton } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import api from '../services/api';
import PeopleIcon from '@mui/icons-material/People';
import StarRateIcon from '@mui/icons-material/StarRate';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SEO from '../components/seo/SEO';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    averageRating: 0,
    totalPositive: 0,
    topReviewers: []
  });

  const trendData = [
    { name: 'Jan', Total: 120, Positive: 90 },
    { name: 'Feb', Total: 180, Positive: 130 },
    { name: 'Mar', Total: 250, Positive: 190 },
    { name: 'Apr', Total: 210, Positive: 160 },
    { name: 'May', Total: 390, Positive: 310 },
    { name: 'Jun', Total: 450, Positive: 380 },
    { name: 'Jul', Total: 520, Positive: 450 },
    { name: 'Aug', Total: 480, Positive: 400 },
    { name: 'Sep', Total: 610, Positive: 530 },
    { name: 'Oct', Total: 720, Positive: 640 },
  ];

  const liveFeed = [
    { id: 1, user: 'Alex M.', action: 'left a 5-star review', item: 'Wayfarer Smart', time: 'Just now', color: 'bg-emerald-500' },
    { id: 2, user: 'Sarah K.', action: 'marked a review as helpful', item: 'Review #1402', time: '2 mins ago', color: 'bg-blue-500' },
    { id: 3, user: 'David P.', action: 'left a 4-star review', item: 'Aviator Pro', time: '15 mins ago', color: 'bg-emerald-500' },
    { id: 4, user: 'Emma R.', action: 'joined the platform', item: 'New User', time: '1 hour ago', color: 'bg-purple-500' },
    { id: 5, user: 'James T.', action: 'left a 2-star review', item: 'Wayfarer Smart', time: '3 hours ago', color: 'bg-rose-500' },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [usersRes, avgRatingRes, positiveRes, topReviewersRes] = await Promise.all([
          api.get('/users?limit=1'),
          api.get('/reviews/stats/average-rating'),
          api.get('/reviews/stats/positive-reviews'),
          api.get('/reviews/stats/top-reviewers?limit=5')
        ]);

        let totalUsers = 0;
        if (usersRes.data && usersRes.data.length > 0) totalUsers = usersRes.data.length;
        if (usersRes.data.pagination) totalUsers = usersRes.data.pagination.total || usersRes.data.length;

        setStats({
          totalUsers: totalUsers || 1,
          averageRating: avgRatingRes.data?.averageRating?.toFixed(1) || 0,
          totalPositive: positiveRes.data?.totalPositive || 0,
          topReviewers: topReviewersRes.data || []
        });
      } catch (error) {
        console.error('Error fetching analytics data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress className="text-indigo-500" />
      </Box>
    );
  }

  const COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-4 rounded-xl shadow-2xl border border-white/20 dark:border-white/10 backdrop-blur-xl">
          <p className="font-bold text-slate-800 dark:text-white mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-1">
              <span style={{ color: entry.color }} className="text-sm font-semibold capitalize">{entry.name}</span>
              <span className="text-slate-800 dark:text-white font-bold">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <SEO title="Analytics Hub" description="Real-time analytics and statistics of your reviews dataset." />
      
      <div className="flex flex-col gap-8 w-full max-w-full overflow-hidden pb-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-sm">
              Live Command Center
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg">
              Dynamic real-time analytics for Meta Glasses.
            </p>
          </div>
          <div className="px-5 py-2.5 glass rounded-full flex items-center gap-3 border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-bold tracking-widest uppercase">System Online</span>
          </div>
        </div>

        {/* 4-Column Flex Layout for Cards - Ensures they spread completely across the page */}
        <div className="flex flex-wrap w-full gap-6">
          <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]">
            <Paper className="glass rounded-[24px] p-6 relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.3)] transition-all duration-500 border border-white/40 dark:border-white/5 h-full">
              <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-20 group-hover:rotate-12 transition-all duration-500">
                <PeopleIcon sx={{ fontSize: 140 }} />
              </div>
              <div className="relative z-10 flex flex-col gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white transform group-hover:scale-110 transition-transform duration-500">
                  <PeopleIcon fontSize="medium" />
                </div>
                <div className="mt-2">
                  <Typography className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">{stats.totalUsers}</Typography>
                  <Typography className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Total Users</Typography>
                </div>
              </div>
            </Paper>
          </div>

          <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]">
            <Paper className="glass rounded-[24px] p-6 relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.3)] transition-all duration-500 border border-white/40 dark:border-white/5 h-full">
              <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-20 group-hover:rotate-12 transition-all duration-500">
                <StarRateIcon sx={{ fontSize: 140 }} />
              </div>
              <div className="relative z-10 flex flex-col gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30 text-white transform group-hover:scale-110 transition-transform duration-500">
                  <StarRateIcon fontSize="medium" />
                </div>
                <div className="mt-2">
                  <Typography className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">{stats.averageRating} <span className="text-2xl text-slate-400 font-bold">/ 5</span></Typography>
                  <Typography className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Avg Rating</Typography>
                </div>
              </div>
            </Paper>
          </div>

          <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]">
            <Paper className="glass rounded-[24px] p-6 relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] transition-all duration-500 border border-white/40 dark:border-white/5 h-full">
              <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-20 group-hover:rotate-12 transition-all duration-500">
                <ThumbUpIcon sx={{ fontSize: 140 }} />
              </div>
              <div className="relative z-10 flex flex-col gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 text-white transform group-hover:scale-110 transition-transform duration-500">
                  <ThumbUpIcon fontSize="medium" />
                </div>
                <div className="mt-2">
                  <Typography className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">{stats.totalPositive}</Typography>
                  <Typography className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Positive Feedback</Typography>
                </div>
              </div>
            </Paper>
          </div>

          <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]">
            <Paper className="rounded-[24px] p-6 relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(236,72,153,0.4)] transition-all duration-500 border-none bg-gradient-to-br from-purple-600 via-pink-600 to-rose-500 h-full">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white opacity-20 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute -top-10 -right-10 p-4 opacity-10 group-hover:opacity-30 group-hover:-translate-y-4 transition-all duration-500 text-white">
                <TrendingUpIcon sx={{ fontSize: 140 }} />
              </div>
              <div className="relative z-10 flex flex-col gap-4 text-white">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30 transform group-hover:scale-110 transition-transform duration-500">
                  <TrendingUpIcon fontSize="medium" />
                </div>
                <div className="mt-2">
                  <Typography className="text-4xl font-black tracking-tight">+42%</Typography>
                  <Typography className="text-pink-100 text-sm font-bold uppercase tracking-widest mt-1">Growth this Month</Typography>
                </div>
              </div>
            </Paper>
          </div>
        </div>

        {/* 2-Column Flex Layout for Charts & Live Feed - FULL WIDTH */}
        <div className="flex flex-wrap w-full gap-6">
          
          <div className="w-full xl:w-[calc(66.666%-12px)]">
            <Paper className="glass rounded-[24px] p-6 md:p-8 border border-white/40 dark:border-white/5 shadow-md h-full relative overflow-hidden min-h-[450px]">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-900/10 dark:to-transparent pointer-events-none"></div>
              <div className="relative z-10 flex justify-between items-center mb-8">
                <div>
                  <Typography variant="h5" className="font-extrabold text-slate-800 dark:text-white tracking-tight">
                    Volume & Sentiment Matrix
                  </Typography>
                  <Typography variant="body2" className="text-slate-500 font-medium mt-1">
                    Monthly tracking of total review volume vs positive sentiment mapping
                  </Typography>
                </div>
              </div>
              
              <div className="h-[350px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.01}/>
                      </linearGradient>
                      <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ec4899" stopOpacity={0.6}/>
                        <stop offset="100%" stopColor="#ec4899" stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 600 }} />
                    <CartesianGrid vertical={false} stroke="var(--tw-colors-slate-200)" strokeDasharray="5 5" className="dark:opacity-10" />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--tw-colors-slate-300)', strokeWidth: 1, strokeDasharray: '5 5', className: 'dark:stroke-slate-600' }} />
                    <Area 
                      type="monotone" 
                      dataKey="Total" 
                      stroke="#8b5cf6" 
                      strokeWidth={4} 
                      fill="url(#colorTotal)" 
                      activeDot={{ r: 8, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 3, className: 'shadow-lg' }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Positive" 
                      stroke="#ec4899" 
                      strokeWidth={4} 
                      fill="url(#colorPositive)" 
                      activeDot={{ r: 8, fill: '#ec4899', stroke: '#fff', strokeWidth: 3, className: 'shadow-lg' }} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Paper>
          </div>

          <div className="w-full xl:w-[calc(33.333%-12px)]">
            <Paper className="glass rounded-[24px] p-6 border border-white/40 dark:border-white/5 shadow-md h-full flex flex-col min-h-[450px]">
              <div className="flex justify-between items-center mb-6 shrink-0">
                <Typography variant="h6" className="font-extrabold text-slate-800 dark:text-white tracking-tight">
                  Live Activity Stream
                </Typography>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                </span>
              </div>
              
              <div className="flex-1 overflow-hidden relative min-h-[300px]">
                <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-[#f8fafc] dark:from-[#111827] to-transparent z-10 pointer-events-none rounded-t-xl"></div>
                
                {/* Scroll container with cross-browser sleek scrollbar and proper padding to prevent clipping */}
                <div 
                  className="space-y-4 px-3 pb-6 pt-2 h-full overflow-y-auto relative z-0"
                  style={{ scrollbarWidth: 'thin', scrollbarColor: '#6366f1 transparent' }}
                >
                  {liveFeed.map((event) => (
                    <div key={event.id} className="flex gap-4 items-start p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                      <div className={`mt-1.5 shrink-0 w-2.5 h-2.5 rounded-full ${event.color} shadow-[0_0_8px_currentColor] group-hover:scale-125 transition-transform`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-800 dark:text-white font-medium truncate">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">{event.user}</span> {event.action}
                        </p>
                        <div className="flex justify-between items-center mt-1 w-full gap-2">
                          <p className="text-xs text-slate-500 font-semibold truncate">{event.item}</p>
                          <p className="text-xs text-slate-400 shrink-0">{event.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex gap-4 items-start p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 opacity-60">
                      <div className="mt-1.5 shrink-0 w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_currentColor]"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-800 dark:text-white font-medium truncate">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">Michael B.</span> left a 3-star review
                        </p>
                        <div className="flex justify-between items-center mt-1 w-full gap-2">
                          <p className="text-xs text-slate-500 font-semibold truncate">Wayfarer</p>
                          <p className="text-xs text-slate-400 shrink-0">5 hours ago</p>
                        </div>
                      </div>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#f8fafc] dark:from-[#111827] to-transparent z-10 pointer-events-none rounded-b-xl"></div>
              </div>
              <button className="mt-4 shrink-0 w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700">
                View All Activity
              </button>
            </Paper>
          </div>
        </div>

        {/* 2-Column Flex Layout for Pie Chart & Bar Chart - FULL WIDTH */}
        <div className="flex flex-wrap w-full gap-6">
          <div className="w-full lg:w-[calc(50%-12px)]">
            <Paper className="glass rounded-[24px] p-6 md:p-8 border border-white/40 dark:border-white/5 shadow-md flex flex-col items-center justify-center relative overflow-hidden group h-full min-h-[400px]">
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors duration-700"></div>
              <div className="relative z-10 w-full text-center mb-6">
                <Typography variant="h5" className="font-extrabold text-slate-800 dark:text-white tracking-tight">
                  Helpfulness Distribution
                </Typography>
                <Typography variant="body2" className="text-slate-500 font-medium mt-1">
                  Vote share among the top 5 contributors
                </Typography>
              </div>
              <div className="flex-1 w-full min-h-[300px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.topReviewers.filter(r => r.totalHelpful > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={90}
                      outerRadius={130}
                      paddingAngle={8}
                      dataKey="totalHelpful"
                      nameKey="_id"
                      stroke="none"
                      cornerRadius={8}
                    >
                      {stats.topReviewers.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity outline-none" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <Typography variant="h3" className="font-black text-slate-800 dark:text-white drop-shadow-sm">
                    {stats.topReviewers.reduce((acc, curr) => acc + (curr.totalHelpful || 0), 0)}
                  </Typography>
                  <Typography variant="caption" className="text-slate-500 font-bold uppercase tracking-widest mt-1">
                    Helpful Votes
                  </Typography>
                </div>
              </div>
            </Paper>
          </div>

          <div className="w-full lg:w-[calc(50%-12px)]">
            <Paper className="glass rounded-[24px] p-6 md:p-8 border border-white/40 dark:border-white/5 shadow-md flex flex-col relative overflow-hidden group h-full min-h-[400px]">
              <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors duration-700"></div>
              <div className="relative z-10 w-full mb-6">
                <Typography variant="h5" className="font-extrabold text-slate-800 dark:text-white tracking-tight">
                  Top Reviewers Output
                </Typography>
                <Typography variant="body2" className="text-slate-500 font-medium mt-1">
                  Total reviews published per user
                </Typography>
              </div>
              <div className="flex-1 w-full min-h-[300px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.topReviewers} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={40}>
                    <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="var(--tw-colors-slate-200)" className="dark:opacity-10" />
                    <XAxis dataKey="_id" tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--tw-colors-indigo-500)', opacity: 0.05 }} />
                    <Bar dataKey="totalReviews" name="Total Reviews" radius={[8, 8, 0, 0]}>
                      {stats.topReviewers.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Paper>
          </div>
        </div>

      </div>
    </>
  );
};

export default Dashboard;
