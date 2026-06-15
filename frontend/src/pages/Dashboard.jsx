import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, CircularProgress, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';
import PeopleIcon from '@mui/icons-material/People';
import StarRateIcon from '@mui/icons-material/StarRate';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SEO from '../components/seo/SEO';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    averageRating: 0,
    totalPositive: 0,
    topReviewers: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch all necessary aggregation data concurrently
        const [usersRes, avgRatingRes, positiveRes, topReviewersRes] = await Promise.all([
          api.get('/users?limit=1'), // Just need pagination metadata for total
          api.get('/reviews/stats/average-rating'),
          api.get('/reviews/stats/positive-reviews'),
          api.get('/reviews/stats/top-reviewers?limit=5')
        ]);

        // Process users count (depends on how backend returns pagination)
        let totalUsers = 0;
        if (usersRes.data && usersRes.data.length > 0) {
           totalUsers = usersRes.data.length; // Fallback if no meta
        }
        if (usersRes.data.pagination) {
           totalUsers = usersRes.data.pagination.total || usersRes.data.length;
        }

        setStats({
          totalUsers: totalUsers || 1, // Fallback placeholder
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

  return (
    <>
      <SEO title="Analytics Overview" description="Real-time analytics and statistics of your reviews dataset." />
      <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Dashboard Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Overview of your Meta Glasses reviews dataset.</p>
      </div>

      {/* Summary Cards */}
      <Grid container spacing={4}>
        <Grid item xs={12} sm={4}>
          <Paper className="glass rounded-2xl p-6 flex items-center gap-4 border border-white/40 dark:border-white/5 shadow-sm">
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <PeopleIcon fontSize="large" />
            </div>
            <div>
              <Typography className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase">Total Users</Typography>
              <Typography className="text-3xl font-bold text-slate-800 dark:text-white">{stats.totalUsers}</Typography>
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper className="glass rounded-2xl p-6 flex items-center gap-4 border border-white/40 dark:border-white/5 shadow-sm">
            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <StarRateIcon fontSize="large" />
            </div>
            <div>
              <Typography className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase">Avg Rating</Typography>
              <Typography className="text-3xl font-bold text-slate-800 dark:text-white">{stats.averageRating} / 5</Typography>
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper className="glass rounded-2xl p-6 flex items-center gap-4 border border-white/40 dark:border-white/5 shadow-sm">
            <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <ThumbUpIcon fontSize="large" />
            </div>
            <div>
              <Typography className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase">Positive Reviews</Typography>
              <Typography className="text-3xl font-bold text-slate-800 dark:text-white">{stats.totalPositive}</Typography>
            </div>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Paper className="glass rounded-2xl p-6 border border-white/40 dark:border-white/5 shadow-sm h-full">
            <Typography variant="h6" className="font-bold text-slate-800 dark:text-white mb-6">
              Top Reviewers (By Total Reviews)
            </Typography>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topReviewers} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--tw-colors-slate-200)" className="dark:opacity-20" />
                  <XAxis dataKey="_id" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="totalReviews" radius={[6, 6, 0, 0]}>
                    {stats.topReviewers.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Paper className="glass rounded-2xl p-6 border border-white/40 dark:border-white/5 shadow-sm h-full flex flex-col">
            <Typography variant="h6" className="font-bold text-slate-800 dark:text-white mb-2">
              Reviewer Helpfulness
            </Typography>
            <Typography variant="body2" className="text-slate-500 mb-6">
              Distribution of helpful votes among top reviewers
            </Typography>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.topReviewers.filter(r => r.totalHelpful > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="totalHelpful"
                    nameKey="_id"
                  >
                    {stats.topReviewers.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
    </>
  );
};

export default Dashboard;
