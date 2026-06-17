import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  TextField, Button, CircularProgress, Paper, Avatar, Divider, Chip, 
  IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Box
} from '@mui/material';
import { 
  Shield as ShieldIcon, 
  History as HistoryIcon, 
  VerifiedUser as VerifiedUserIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  PhotoCamera as PhotoCameraIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  Face as FaceIcon,
  CheckCircle as CheckCircleIcon,
  Fingerprint as FingerprintIcon
} from '@mui/icons-material';
import { updateProfile, clearAuthError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import SEO from '../components/seo/SEO';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [faceScanOpen, setFaceScanOpen] = useState(false);
  const [scanStatus, setScanStatus] = useState('idle'); // idle, scanning, success

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string()
        .min(6, 'At least 6 characters')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/, 'Must contain uppercase, lowercase, and a number'),
    }),
    onSubmit: async (values) => {
      // Open confirmation dialog instead of saving immediately
      setConfirmDialogOpen(true);
    },
  });

  const handleConfirmSave = async () => {
    setConfirmDialogOpen(false);
    const dataToUpdate = { name: formik.values.name, email: formik.values.email };
    if (formik.values.password) {
      dataToUpdate.password = formik.values.password;
    }
    
    const userId = user?._id || user?.id;
    if (!userId) return;

    const result = await dispatch(updateProfile({ id: userId, data: dataToUpdate }));
    if (!result.error) {
      toast.success('Profile updated successfully!');
      formik.resetForm({ values: { ...formik.values, password: '' } });
      setIsEditing(false); // Lock the form after successful save
    }
  };

  const handleCancelEdit = () => {
    formik.resetForm();
    setIsEditing(false);
  };

  const handlePhotoUpload = (type) => {
    toast.success(`Opening file browser to update ${type}...`);
  };

  const startFaceScan = () => {
    setFaceScanOpen(true);
    setScanStatus('scanning');
    
    // Simulate biometric scan process
    setTimeout(() => {
      setScanStatus('success');
      setTimeout(() => {
        setFaceScanOpen(false);
        setIsEditing(true);
        toast.success('Biometric verification successful. Editing unlocked.');
      }, 1500);
    }, 2500);
  };

  if (!user) return null;

  return (
    <>
      <SEO title="My Profile" description="Manage your admin profile and personal preferences." />
      
      {/* Inline styles for scanning animation */}
      <style>
        {`
          @keyframes scanLine {
            0% { top: 0; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
          .animate-scan {
            animation: scanLine 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
        `}
      </style>

      {/* Forced Full Width Container */}
      <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden pb-10 mt-2">
        
        {/* Header section with Hero Banner */}
        <div className="relative w-full mb-24 md:mb-20">
          
          {/* Cover Photo / Gradient Banner */}
          <div className="h-48 md:h-64 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative rounded-[32px] overflow-hidden shadow-2xl border border-white/20 dark:border-white/5">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/60"></div>
            
            {/* Edit Cover Photo Button */}
            <div className="absolute top-4 right-4 z-10">
              <IconButton 
                onClick={() => handlePhotoUpload('cover photo')}
                className="bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm"
                size="small"
              >
                <PhotoCameraIcon fontSize="small" />
              </IconButton>
            </div>
            
            <div className="absolute bottom-4 right-4 hidden md:block">
              <Button variant="contained" className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md font-bold rounded-xl shadow-lg normal-case border border-white/20">
                View Public Profile
              </Button>
            </div>
          </div>
          
          {/* Floating Profile Info Overlap */}
          <div className="absolute -bottom-16 left-4 md:left-12 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 z-10 w-full md:w-auto px-4 md:px-0">
            {/* Avatar container */}
            <div className="relative group">
              <Avatar 
                sx={{ width: 140, height: 140 }} 
                className="border-4 border-slate-50 dark:border-[#0b0f19] bg-gradient-to-br from-indigo-500 to-purple-600 text-5xl shadow-2xl font-extrabold"
              >
                {user?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 border-4 border-slate-50 dark:border-[#0b0f19] rounded-full z-10"></div>
              
              {/* Edit Avatar Overlay */}
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer border-4 border-transparent" onClick={() => handlePhotoUpload('profile photo')}>
                <PhotoCameraIcon className="text-white drop-shadow-md" />
              </div>
            </div>
            
            {/* Text container */}
            <div className="mb-2 text-center md:text-left flex flex-col items-center md:items-start">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white drop-shadow-sm tracking-tight leading-tight">
                {user?.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                <Chip 
                  icon={<VerifiedUserIcon sx={{ fontSize: 16 }} />} 
                  label={user?.role?.toUpperCase()} 
                  size="small" 
                  className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 border-none font-bold"
                />
                <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Joined {new Date().getFullYear()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="w-full px-2 md:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
            
            {/* Left Column: Details & Security */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Contact Information Card */}
              <Paper className="glass rounded-[24px] p-6 md:p-8 border border-white/40 dark:border-white/5 shadow-lg relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <BusinessIcon sx={{ fontSize: 150 }} />
                </div>
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <EmailIcon fontSize="small" />
                  </div>
                  Contact Information
                </h3>
                
                <div className="space-y-5 relative z-10">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 break-all">{user?.email}</p>
                  </div>
                  <Divider className="border-slate-100 dark:border-slate-800" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">+1 (555) 123-4567</p>
                  </div>
                  <Divider className="border-slate-100 dark:border-slate-800" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Department</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Administration</p>
                  </div>
                </div>
              </Paper>

              {/* Security Status Card */}
              <Paper className="glass rounded-[24px] p-6 md:p-8 border border-white/40 dark:border-white/5 shadow-lg relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <ShieldIcon sx={{ fontSize: 150 }} />
                </div>
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <ShieldIcon fontSize="small" />
                  </div>
                  Security Status
                </h3>
                
                <div className="space-y-4 relative z-10">
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-emerald-800 dark:text-emerald-400">Account Status</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-500 capitalize">{user?.status || 'Active & Secured'}</p>
                    </div>
                    <VerifiedUserIcon className="text-emerald-500" />
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-xl p-4 flex items-center justify-between mt-2">
                    <div>
                      <p className="text-sm font-bold text-amber-800 dark:text-amber-400">2FA Verification</p>
                      <p className="text-xs text-amber-600 dark:text-amber-500">Currently Disabled</p>
                    </div>
                    <Button size="small" variant="outlined" color="warning" className="rounded-lg normal-case font-bold py-1 bg-white dark:bg-slate-800">Enable</Button>
                  </div>
                </div>
              </Paper>
            </div>

            {/* Right Column: Edit Form & Activity */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Edit Profile Form */}
              <Paper className={`glass rounded-[24px] p-6 md:p-10 border shadow-lg transition-all duration-300 ${isEditing ? 'border-indigo-400 dark:border-indigo-500 shadow-indigo-500/20' : 'border-white/40 dark:border-white/5'}`}>
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                      Profile Settings
                      {!isEditing && <LockIcon fontSize="small" className="text-slate-400" />}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {isEditing ? 'Editing mode unlocked.' : 'Your profile details are currently locked.'}
                    </p>
                  </div>
                  
                  {!isEditing && (
                    <Button 
                      variant="contained" 
                      onClick={startFaceScan}
                      startIcon={<FingerprintIcon />}
                      className="bg-slate-800 hover:bg-slate-900 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-xl shadow-none font-bold normal-case shadow-[0_4px_14px_0_rgba(99,102,241,0.39)]"
                    >
                      Authenticate to Edit
                    </Button>
                  )}
                </div>
                
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField
                      fullWidth
                      id="name"
                      name="name"
                      label="Full Name"
                      variant="outlined"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      disabled={!isEditing}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                      InputProps={{ className: `rounded-xl ${isEditing ? 'bg-white dark:bg-slate-900/80' : 'bg-slate-50 dark:bg-slate-900/30'}` }}
                    />
                    
                    <TextField
                      fullWidth
                      id="email"
                      name="email"
                      label="Email Address"
                      type="email"
                      variant="outlined"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      disabled={!isEditing}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
                      InputProps={{ className: `rounded-xl ${isEditing ? 'bg-white dark:bg-slate-900/80' : 'bg-slate-50 dark:bg-slate-900/30'}` }}
                    />
                  </div>

                  <div className={`transition-all duration-500 ${isEditing ? 'opacity-100 max-h-[500px]' : 'opacity-50 max-h-0 overflow-hidden hidden'}`}>
                    <Divider className="my-6 border-slate-200/50 dark:border-slate-800/50" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Change Password</h4>
                      <TextField
                        fullWidth
                        id="password"
                        name="password"
                        label="New Password (Optional)"
                        type="password"
                        variant="outlined"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        disabled={!isEditing}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        InputProps={{ className: "bg-white dark:bg-slate-900/80 rounded-xl" }}
                      />
                      <p className="text-xs text-slate-400 mt-2 ml-1">Leave blank if you do not want to change your password.</p>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="pt-6 flex justify-end gap-3 mt-8">
                      <Button 
                        type="button" 
                        variant="outlined" 
                        onClick={handleCancelEdit}
                        className="rounded-xl px-6 py-2.5 normal-case font-bold border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={loading || !formik.dirty}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl px-8 py-2.5 shadow-[0_10px_20px_-10px_rgba(99,102,241,0.5)] normal-case font-bold transform transition-transform hover:-translate-y-1"
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Review Changes'}
                      </Button>
                    </div>
                  )}
                </form>
              </Paper>

              {/* Recent Login Activity */}
              <Paper className="glass rounded-[24px] p-6 md:p-8 border border-white/40 dark:border-white/5 shadow-lg relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <HistoryIcon sx={{ fontSize: 150 }} />
                </div>
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <HistoryIcon fontSize="small" />
                  </div>
                  Recent Login Activity
                </h3>
                
                <div className="space-y-4 relative z-10">
                  {[
                    { os: 'Windows 11 • Chrome', ip: '192.168.1.1', time: 'Just now', current: true },
                    { os: 'macOS 13 • Safari', ip: '192.168.1.42', time: '2 days ago', current: false },
                  ].map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${session.current ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                        <div>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                            {session.os} {session.current && <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400 ml-2 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full hidden sm:inline-block">Current Session</span>}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">IP: {session.ip}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-400">{session.time}</span>
                    </div>
                  ))}
                </div>
              </Paper>
              
            </div>
          </div>
        </div>
      </div>

      {/* Biometric Face ID Mock Modal */}
      <Dialog
        open={faceScanOpen}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          className: "rounded-[32px] glass bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 overflow-hidden shadow-2xl relative",
        }}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <DialogContent className="flex flex-col items-center justify-center p-10">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-2 tracking-tight">Biometric Scan</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-10 font-medium">
            Please position your face within the frame to authenticate and unlock profile settings.
          </p>

          <div className="relative w-48 h-48 rounded-3xl border-4 border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-inner flex items-center justify-center mb-6">
            
            {/* Camera Frame Corners UI */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-4 border-l-4 border-indigo-500 rounded-tl-sm"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-4 border-r-4 border-indigo-500 rounded-tr-sm"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-4 border-l-4 border-indigo-500 rounded-bl-sm"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-4 border-r-4 border-indigo-500 rounded-br-sm"></div>

            {scanStatus === 'scanning' ? (
              <>
                <FaceIcon sx={{ fontSize: 100 }} className="text-slate-400 dark:text-slate-600 opacity-50" />
                {/* Animated Scanning Line */}
                <div className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-scan z-10"></div>
                <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>
              </>
            ) : (
              <CheckCircleIcon sx={{ fontSize: 100 }} className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] transform scale-110 transition-transform duration-500" />
            )}
          </div>

          <div className="flex items-center gap-3">
            {scanStatus === 'scanning' ? (
              <>
                <CircularProgress size={16} className="text-indigo-500" />
                <span className="text-indigo-600 dark:text-indigo-400 font-bold animate-pulse">Analyzing Face Data...</span>
              </>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-lg">Match Verified</span>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        PaperProps={{
          className: "rounded-2xl glass bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700",
        }}
      >
        <DialogTitle className="font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
          <ShieldIcon className="text-indigo-500" />
          Confirm Profile Updates
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="text-slate-600 dark:text-slate-300">
            You are about to modify your core account details. Are you sure you want to apply these changes? For security reasons, this action is logged.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="p-4 pt-0">
          <Button onClick={() => setConfirmDialogOpen(false)} className="text-slate-500 font-bold normal-case">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmSave} 
            variant="contained" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md font-bold normal-case px-6"
            autoFocus
          >
            Yes, Apply Updates
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Profile;
