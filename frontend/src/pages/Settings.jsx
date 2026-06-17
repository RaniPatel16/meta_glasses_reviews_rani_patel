import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Paper, Switch, Divider, Typography, 
  Radio, RadioGroup, FormControl, FormLabel, Button
} from '@mui/material';
import { toggleTheme } from '../store/slices/uiSlice';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import TableViewIcon from '@mui/icons-material/TableView';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SecurityIcon from '@mui/icons-material/Security';
import ApiIcon from '@mui/icons-material/Api';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import toast from 'react-hot-toast';
import SEO from '../components/seo/SEO';

const Settings = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.ui);

  // Form States
  const [tableView, setTableView] = useState('comfortable');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(true);
  const [analyticsTracking, setAnalyticsTracking] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);

  // Initialize from session storage
  useEffect(() => {
    const savedTableView = sessionStorage.getItem('pref_tableView');
    if (savedTableView) {
      setTableView(savedTableView);
    }
  }, []);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleTableViewChange = (event) => {
    const newValue = event.target.value;
    setTableView(newValue);
    sessionStorage.setItem('pref_tableView', newValue);
    toast.success(`Table view set to ${newValue}`);
  };

  const handleAlertsToggle = (event) => {
    setEmailAlerts(event.target.checked);
  };

  const handlePushToggle = (event) => {
    setPushNotifications(event.target.checked);
    if(event.target.checked) toast.success("Push notifications enabled");
  };

  const handleSessionToggle = (event) => {
    setSessionTimeout(event.target.checked);
    if(event.target.checked) {
      toast.success("Auto-logout enabled (30 mins)");
    } else {
      toast.error("Warning: Auto-logout disabled");
    }
  };

  const handle2FA = () => {
    toast.success("Verification email sent! Please check your inbox to configure 2FA.");
  };

  const handleSavePreferences = () => {
    toast.success('All global preferences saved successfully!');
  };

  const handleExportData = () => {
    toast.success('Your data archive is being generated. You will receive an email shortly.');
  };

  // New Handlers
  const handleRevealApiKey = () => {
    setShowApiKey(!showApiKey);
    if (!showApiKey) toast.success('API Key revealed for 60 seconds.');
  };

  const handleManageWebhooks = () => {
    toast.error('Webhook management requires elevated privileges. Please contact super-admin.');
  };

  const handleAnalyticsToggle = (event) => {
    setAnalyticsTracking(event.target.checked);
    if (event.target.checked) {
      toast.success('Analytics tracking enabled.');
    } else {
      toast.success('Analytics tracking disabled.');
    }
  };

  const handleManagePlan = () => {
    toast.success('Redirecting to Stripe Billing Portal...');
  };

  const handleDownloadInvoice = () => {
    toast.success('Downloading invoice INV-2026-10-01.pdf...');
  };

  return (
    <>
      <SEO title="Settings & Preferences" description="Configure your workspace and system notifications." />
      
      {/* Forced Full Width Container */}
      <div className="flex flex-col gap-8 w-full max-w-full overflow-hidden pb-10">
        
        {/* Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 drop-shadow-sm">
              Global Settings
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg">
              Manage your UI theme, dashboard preferences, and local storage configurations.
            </p>
          </div>
          <Button 
            variant="contained" 
            onClick={handleSavePreferences}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-xl px-8 py-3 shadow-[0_10px_20px_-10px_rgba(99,102,241,0.5)] normal-case font-bold transform transition-transform hover:-translate-y-1"
          >
            Save All Changes
          </Button>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          
          {/* Row 1: Appearance */}
          <Paper className="glass rounded-[24px] p-8 border border-white/40 dark:border-white/5 shadow-lg group hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.2)] transition-all duration-500 relative overflow-hidden flex flex-col h-full">
            <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all duration-500">
              <DarkModeIcon sx={{ fontSize: 150 }} />
            </div>
            
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white">
                {mode === 'dark' ? <DarkModeIcon fontSize="medium" /> : <LightModeIcon fontSize="medium" />}
              </div>
              <div>
                <Typography variant="h5" className="font-extrabold text-slate-800 dark:text-white tracking-tight">
                  Appearance
                </Typography>
                <Typography variant="caption" className="text-slate-500 font-bold uppercase tracking-wider">
                  Visual Style
                </Typography>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col gap-4">
              <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-800/50">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography className="font-bold text-slate-700 dark:text-slate-200 text-lg">Dark Mode</Typography>
                    <Typography variant="body2" className="text-slate-500">
                      Toggle the global application theme.
                    </Typography>
                  </div>
                  <Switch 
                    checked={mode === 'dark'} 
                    onChange={handleThemeToggle} 
                    color="primary" 
                    sx={{ transform: 'scale(1.2)' }}
                  />
                </div>
              </div>
              
              <Divider className="my-2 border-slate-200/50 dark:border-slate-800/50" />
              
              <div className="flex items-center gap-4 mb-2 relative z-10">
                <div className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-md shadow-teal-500/30 text-white">
                  <TableViewIcon fontSize="small" />
                </div>
                <Typography variant="h6" className="font-bold text-slate-800 dark:text-white tracking-tight">
                  Session Preferences
                </Typography>
              </div>
              
              <FormControl component="fieldset" className="w-full">
                <FormLabel component="legend" className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                  Default Data Table Spacing
                </FormLabel>
                <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-2 border border-slate-200/50 dark:border-slate-800/50 flex">
                  <RadioGroup
                    row
                    name="tableView"
                    value={tableView}
                    onChange={handleTableViewChange}
                    className="flex justify-around w-full"
                  >
                    <label className={`flex-1 flex justify-center py-2 rounded-xl cursor-pointer transition-all ${tableView === 'compact' ? 'bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 border border-transparent'}`}>
                      <Radio value="compact" size="small" className="hidden" />
                      <span className={`font-bold ${tableView === 'compact' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>Compact</span>
                    </label>
                    <label className={`flex-1 flex justify-center py-2 rounded-xl cursor-pointer transition-all ${tableView === 'comfortable' ? 'bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 border border-transparent'}`}>
                      <Radio value="comfortable" size="small" className="hidden" />
                      <span className={`font-bold ${tableView === 'comfortable' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>Comfortable</span>
                    </label>
                  </RadioGroup>
                </div>
              </FormControl>
              <Typography variant="caption" className="text-slate-400 mt-2 block leading-relaxed">
                * Saved in <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-indigo-500 dark:text-indigo-400">sessionStorage</code> (resets on tab close).
              </Typography>
            </div>
          </Paper>

          {/* Row 1: Notifications & System */}
          <Paper className="glass rounded-[24px] p-8 border border-white/40 dark:border-white/5 shadow-lg group hover:shadow-[0_20px_40px_-15px_rgba(244,63,94,0.2)] transition-all duration-500 relative overflow-hidden flex flex-col h-full">
            <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all duration-500">
              <NotificationsActiveIcon sx={{ fontSize: 150 }} />
            </div>
            
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30 text-white">
                <NotificationsActiveIcon fontSize="medium" />
              </div>
              <div>
                <Typography variant="h5" className="font-extrabold text-slate-800 dark:text-white tracking-tight">
                  Notifications
                </Typography>
                <Typography variant="caption" className="text-slate-500 font-bold uppercase tracking-wider">
                  Alerts & Updates
                </Typography>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col gap-4">
              <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
                <div>
                  <Typography className="font-bold text-slate-700 dark:text-slate-200 text-lg">Email Alerts</Typography>
                  <Typography variant="body2" className="text-slate-500">
                    Receive weekly analytics summaries.
                  </Typography>
                </div>
                <Switch 
                  checked={emailAlerts} 
                  onChange={handleAlertsToggle} 
                  color="secondary" 
                  sx={{ transform: 'scale(1.2)' }}
                />
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
                <div>
                  <Typography className="font-bold text-slate-700 dark:text-slate-200 text-lg">Push Notifications</Typography>
                  <Typography variant="body2" className="text-slate-500">
                    Notify on new user registrations.
                  </Typography>
                </div>
                <Switch 
                  checked={pushNotifications}
                  onChange={handlePushToggle}
                  color="secondary" 
                  sx={{ transform: 'scale(1.2)' }} 
                />
              </div>

              <div className="mt-4 p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-800/30 text-sm text-slate-600 dark:text-slate-400">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">Note:</span> Browser notification permissions may need to be enabled in your browser settings.
              </div>
            </div>
          </Paper>
          
          {/* Row 1: Security & Access */}
          <Paper className="glass rounded-[24px] p-8 border border-white/40 dark:border-white/5 shadow-lg group hover:shadow-[0_20px_40px_-15px_rgba(234,179,8,0.2)] transition-all duration-500 relative overflow-hidden flex flex-col h-full">
            <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all duration-500">
              <SecurityIcon sx={{ fontSize: 150 }} />
            </div>
            
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 text-white">
                <SecurityIcon fontSize="medium" />
              </div>
              <div>
                <Typography variant="h5" className="font-extrabold text-slate-800 dark:text-white tracking-tight">
                  Security
                </Typography>
                <Typography variant="caption" className="text-slate-500 font-bold uppercase tracking-wider">
                  Access Control
                </Typography>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col gap-4">
              <div className="bg-amber-50/50 dark:bg-amber-900/10 rounded-2xl p-5 border border-amber-200/50 dark:border-amber-700/30 text-center flex flex-col items-center justify-center">
                <Typography className="font-bold text-amber-700 dark:text-amber-400 mb-2">Two-Factor Authentication</Typography>
                <Typography variant="body2" className="text-slate-600 dark:text-slate-400 mb-4">
                  Add an extra layer of security to your admin account.
                </Typography>
                <Button 
                  onClick={handle2FA}
                  variant="outlined" 
                  color="warning" 
                  size="small" 
                  className="rounded-xl font-bold normal-case px-6 hover:bg-amber-100 dark:hover:bg-amber-900/50"
                >
                  Enable 2FA
                </Button>
              </div>
              
              <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
                <div>
                  <Typography className="font-bold text-slate-700 dark:text-slate-200">Session Timeout</Typography>
                  <Typography variant="body2" className="text-slate-500">Auto-logout after 30 mins</Typography>
                </div>
                <Switch 
                  checked={sessionTimeout} 
                  onChange={handleSessionToggle}
                  color="warning" 
                  sx={{ transform: 'scale(1.1)' }} 
                />
              </div>
            </div>
          </Paper>

          {/* Row 2: API & Integrations */}
          <Paper className="glass rounded-[24px] p-8 border border-white/40 dark:border-white/5 shadow-lg group hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.2)] transition-all duration-500 relative overflow-hidden flex flex-col h-full">
            <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all duration-500">
              <ApiIcon sx={{ fontSize: 150 }} />
            </div>
            
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 text-white">
                <ApiIcon fontSize="medium" />
              </div>
              <div>
                <Typography variant="h5" className="font-extrabold text-slate-800 dark:text-white tracking-tight">
                  Integrations
                </Typography>
                <Typography variant="caption" className="text-slate-500 font-bold uppercase tracking-wider">
                  API Keys & Webhooks
                </Typography>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col gap-4">
              <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/50">
                <Typography className="font-bold text-slate-700 dark:text-slate-200 mb-1">Production API Key</Typography>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono text-sm px-3 py-2 rounded-lg truncate">
                    {showApiKey ? 'pk_live_51MabcXYZ...789qwertY' : 'pk_live_*************************a9f2'}
                  </div>
                  <Button 
                    variant="contained" 
                    size="small" 
                    onClick={handleRevealApiKey}
                    className="bg-emerald-500 hover:bg-emerald-600 shadow-none normal-case rounded-lg min-w-0 px-4 py-2"
                  >
                    {showApiKey ? 'Hide' : 'Reveal'}
                  </Button>
                </div>
              </div>

              <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl p-4 border border-emerald-200/50 dark:border-emerald-700/30 flex items-center justify-between">
                <div>
                  <Typography className="font-bold text-emerald-700 dark:text-emerald-400">Webhook Status</Typography>
                  <Typography variant="body2" className="text-slate-600 dark:text-slate-400">3 endpoints active</Typography>
                </div>
                <Button 
                  size="small" 
                  onClick={handleManageWebhooks}
                  className="text-emerald-600 dark:text-emerald-400 normal-case font-bold"
                >
                  Manage
                </Button>
              </div>
            </div>
          </Paper>

          {/* Row 2: Data & Privacy */}
          <Paper className="glass rounded-[24px] p-8 border border-white/40 dark:border-white/5 shadow-lg group hover:shadow-[0_20px_40px_-15px_rgba(56,189,248,0.2)] transition-all duration-500 relative overflow-hidden flex flex-col h-full">
            <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all duration-500">
              <PrivacyTipIcon sx={{ fontSize: 150 }} />
            </div>
            
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-lg shadow-sky-500/30 text-white">
                <PrivacyTipIcon fontSize="medium" />
              </div>
              <div>
                <Typography variant="h5" className="font-extrabold text-slate-800 dark:text-white tracking-tight">
                  Data & Privacy
                </Typography>
                <Typography variant="caption" className="text-slate-500 font-bold uppercase tracking-wider">
                  Compliance & Exports
                </Typography>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col gap-4">
              <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
                <div>
                  <Typography className="font-bold text-slate-700 dark:text-slate-200 text-lg">Analytics Tracking</Typography>
                  <Typography variant="body2" className="text-slate-500">
                    Share anonymous usage data.
                  </Typography>
                </div>
                <Switch 
                  checked={analyticsTracking} 
                  onChange={handleAnalyticsToggle}
                  color="info" 
                  sx={{ transform: 'scale(1.2)' }} 
                />
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/50 flex flex-col items-start gap-3">
                <div>
                  <Typography className="font-bold text-slate-700 dark:text-slate-200">Data Archive</Typography>
                  <Typography variant="body2" className="text-slate-500">
                    Download a copy of all your organization's data.
                  </Typography>
                </div>
                <Button 
                  onClick={handleExportData}
                  variant="outlined" 
                  color="info" 
                  className="rounded-xl w-full font-bold normal-case"
                >
                  Request Data Export
                </Button>
              </div>
            </div>
          </Paper>

          {/* Row 2: Billing & Plans */}
          <Paper className="glass rounded-[24px] p-8 border border-white/40 dark:border-white/5 shadow-lg group hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.2)] transition-all duration-500 relative overflow-hidden flex flex-col h-full">
            <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all duration-500">
              <CreditCardIcon sx={{ fontSize: 150 }} />
            </div>
            
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/30 text-white">
                <CreditCardIcon fontSize="medium" />
              </div>
              <div>
                <Typography variant="h5" className="font-extrabold text-slate-800 dark:text-white tracking-tight">
                  Billing
                </Typography>
                <Typography variant="caption" className="text-slate-500 font-bold uppercase tracking-wider">
                  Plan & Invoices
                </Typography>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col gap-4">
              <div className="bg-purple-50/50 dark:bg-purple-900/10 rounded-2xl p-5 border border-purple-200/50 dark:border-purple-700/30 flex flex-col items-center text-center">
                <Typography className="font-bold text-purple-700 dark:text-purple-400 mb-1">Enterprise Plan</Typography>
                <Typography variant="body2" className="text-slate-600 dark:text-slate-400 mb-4">
                  $299/mo • Renews on Nov 1, 2026
                </Typography>
                <Button 
                  onClick={handleManagePlan}
                  variant="contained" 
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-none font-bold normal-case w-full"
                >
                  Manage Plan
                </Button>
              </div>
              
              <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
                <div>
                  <Typography className="font-bold text-slate-700 dark:text-slate-200">Latest Invoice</Typography>
                  <Typography variant="body2" className="text-slate-500">Oct 1, 2026</Typography>
                </div>
                <Button 
                  onClick={handleDownloadInvoice}
                  size="small" 
                  className="text-purple-600 dark:text-purple-400 normal-case font-bold"
                >
                  Download
                </Button>
              </div>
            </div>
          </Paper>

        </div>
      </div>
    </>
  );
};

export default Settings;
