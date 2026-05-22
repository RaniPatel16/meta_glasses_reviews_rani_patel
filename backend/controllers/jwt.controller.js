const jwt = require('jsonwebtoken');

// @desc    Generate JWT token
// @route   POST /api/v1/jwt/generate-token
const generateToken = (req, res) => {
  try {
    const { id, role } = req.body;
    if (!id || !role) {
      return res.status(400).json({ message: 'Please provide user id and role' });
    }
    const token = jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify JWT token
// @route   POST /api/v1/jwt/verify-token
const verifyToken = (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token is required' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    res.json({ valid: true, decoded });
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
};

// @desc    Refresh JWT token
// @route   POST /api/v1/jwt/refresh-token
const refreshJwtToken = (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token is required' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123', { ignoreExpiration: true });
    const newToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
    
    res.json({ token: newToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Access JWT protected profile
// @route   GET /api/v1/jwt/profile
const getJwtProfile = (req, res) => {
  res.json({ message: 'You have accessed the protected profile route', user: req.user });
};

// @desc    Access JWT protected dashboard
// @route   GET /api/v1/jwt/dashboard
const getJwtDashboard = (req, res) => {
  res.json({ message: 'You have accessed the protected dashboard route', user: req.user });
};

// @desc    Access admin protected route
// @route   GET /api/v1/jwt/admin
const getJwtAdmin = (req, res) => {
  res.json({ message: 'Welcome Admin. You have accessed the admin-only route' });
};

// @desc    Access user protected route
// @route   GET /api/v1/jwt/user
const getJwtUser = (req, res) => {
  res.json({ message: 'Welcome User. You have accessed the user-level route' });
};

// @desc    Logout JWT session
// @route   DELETE /api/v1/jwt/logout
const logoutJwt = (req, res) => {
  res.json({ message: 'JWT session logged out' });
};

module.exports = {
  getJwtProfile,
  getJwtDashboard,
  generateToken,
  verifyToken,
  refreshJwtToken,
  getJwtAdmin,
  getJwtUser,
  logoutJwt
};
