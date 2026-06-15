import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Paper, Switch, FormControlLabel, Divider, Typography, 
  Radio, RadioGroup, FormControl, FormLabel, Button
} from '@mui/material';
import { toggleTheme } from '../store/slices/uiSlice';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import TableViewIcon from '@mui/icons-material/TableView';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import toast from 'react-hot-toast';
import SEO from '../components/seo/SEO';

const Settings = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.ui);

  // Example of Phase 12: Session Storage implementation
  const [tableView, setTableView] = useState('comfortable');
  const [emailAlerts, setEmailAlerts] = useState(true);

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

  const handleSavePreferences = () => {
    toast.success('All preferences saved successfully!');
  };

  return (
    <>
      <SEO title="Settings & Preferences" description="Configure your workspace and system notifications." />
      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Settings & Preferences</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your UI theme, dashboard preferences, and local storage configurations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Appearance Settings */}
        <Paper className="glass rounded-2xl p-6 md:p-8 border border-white/40 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              {mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
            </div>
            <Typography variant="h6" className="font-bold text-slate-800 dark:text-white">
              Appearance
            </Typography>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <Typography className="font-semibold text-slate-700 dark:text-slate-200">Dark Mode</Typography>
              <Typography variant="body2" className="text-slate-500">
                Toggle the global application theme.
              </Typography>
            </div>
            <Switch 
              checked={mode === 'dark'} 
              onChange={handleThemeToggle} 
              color="primary" 
            />
          </div>
          
          <Divider className="my-6 border-slate-200 dark:border-slate-800" />
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400">
              <TableViewIcon />
            </div>
            <Typography variant="h6" className="font-bold text-slate-800 dark:text-white">
              Session Preferences
            </Typography>
          </div>
          
          <FormControl component="fieldset" className="w-full">
            <FormLabel component="legend" className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Default Data Table Spacing
            </FormLabel>
            <RadioGroup
              row
              name="tableView"
              value={tableView}
              onChange={handleTableViewChange}
              className="flex justify-around w-full mt-2"
            >
              <FormControlLabel 
                value="compact" 
                control={<Radio size="small" />} 
                label={<span className="text-slate-700 dark:text-slate-300">Compact</span>} 
              />
              <FormControlLabel 
                value="comfortable" 
                control={<Radio size="small" />} 
                label={<span className="text-slate-700 dark:text-slate-300">Comfortable</span>} 
              />
            </RadioGroup>
          </FormControl>
          <Typography variant="caption" className="text-slate-400 mt-2 block">
            * This setting is saved in <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">sessionStorage</code> and resets when you close the browser tab.
          </Typography>
        </Paper>

        {/* Notifications & System */}
        <Paper className="glass rounded-2xl p-6 md:p-8 border border-white/40 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400">
              <NotificationsActiveIcon />
            </div>
            <Typography variant="h6" className="font-bold text-slate-800 dark:text-white">
              Notifications
            </Typography>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <Typography className="font-semibold text-slate-700 dark:text-slate-200">Email Alerts</Typography>
              <Typography variant="body2" className="text-slate-500">
                Receive weekly analytics summaries.
              </Typography>
            </div>
            <Switch 
              checked={emailAlerts} 
              onChange={handleAlertsToggle} 
              color="secondary" 
            />
          </div>

          <div className="flex items-center justify-between py-4 mt-2">
            <div>
              <Typography className="font-semibold text-slate-700 dark:text-slate-200">Push Notifications</Typography>
              <Typography variant="body2" className="text-slate-500">
                Notify on new user registrations.
              </Typography>
            </div>
            <Switch disabled color="primary" />
          </div>

          <Divider className="my-6 border-slate-200 dark:border-slate-800" />
          
          <div className="mt-8 flex justify-end">
            <Button 
              variant="contained" 
              onClick={handleSavePreferences}
              className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white rounded-xl px-6 py-2 shadow-md normal-case font-semibold"
            >
              Save Preferences
            </Button>
          </div>
        </Paper>

      </div>
    </div>
    </>
  );
};

export default Settings;
