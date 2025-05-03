// middleware/auth.js

export const authMiddleware = async (req, res, next) => {
  console.log('Auth middleware - Session:', req.session);

  try {
    // Check for valid session
    if (req.session && req.session.userID) {
      console.log('Auth middleware - Authenticated via session, userID:', req.session.userID);
      return next();
    }

    console.log('Auth middleware - No valid session found');
    return res.status(401).json({ message: 'Not authenticated' });
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// If you're using CommonJS exports (require/module.exports), change to:
// module.exports = { authMiddleware };