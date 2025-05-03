import db from '../models/index.js';
const { User, Joke } = db;
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile-pictures')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname))
  }
});

export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
      return;
    }
    cb(null, true);
  }
});

export const uploadProfilePicture = async (req, res) => {
  try {
    // Get user ID from either session or JWT token
    const userId = req.user?.id || req.session?.userID;
    if (!userId) {
      console.log('No user ID found in either session or token');
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user's profile picture URL
    const profilePictureUrl = `/uploads/profile-pictures/${req.file.filename}`;
    await user.update({ profile_picture: profilePictureUrl });

    res.json({ 
      message: "Profile picture updated successfully",
      profile_picture: profilePictureUrl
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({ 
      message: "Error uploading profile picture", 
      error: error.message 
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    // Get user ID from either session or JWT token
    const userId = req.user?.id || req.session?.userID;
    if (!userId) {
      console.log('No user ID found in either session or token');
      return res.status(401).json({ message: "Not authenticated" });
    }

    console.log('Fetching user profile for ID:', userId);
    console.log('Auth info:', {
      session: req.session,
      user: req.user,
      headers: req.headers
    });
    const user = await User.findByPk(userId, {
      include: [{
        model: Joke,
        as: 'jokes',
        attributes: ['id', 'content', 'likes', 'createdAt'],
        separate: true,
        order: [['createdAt', 'DESC']],
        limit: 5
      }],
      attributes: {
        exclude: ['hash_password'] // Don't send password hash
      }
    });
    
    console.log('User found:', user ? 'yes' : 'no');
    if (user) {
      console.log('Jokes found:', user.jokes ? user.jokes.length : 0);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate total likes
    const totalLikes = user.jokes ? user.jokes.reduce((sum, joke) => sum + (joke.likes || 0), 0) : 0;

    const userProfile = {
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profile_picture: user.profile_picture,
      registration_date: user.registration_date,
      totalJokes: user.jokes ? user.jokes.length : 0,
      totalLikes: totalLikes,
      recentJokes: user.jokes || [] // Already limited to 5 in the query
    };

    res.json(userProfile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  console.log('Update profile request received');
  console.log('Session:', req.session);
  console.log('Request body:', req.body);
  const userId = req.session?.userID;
  console.log('User ID from session:', userId);
  
  if (!userId) {
    console.log('No user ID found in session');
    return res.status(401).json({ message: "Not authenticated" });
  }
  const { username, email, currentPassword, newPassword, bio } = req.body;

  try {
    console.log('Looking up user with ID:', userId);
    const user = await User.findByPk(userId);
    
    if (!user) {
      console.log('No user found with ID:', userId);
      return res.status(404).json({ message: "User not found" });
    }
    console.log('Found user:', { id: user.id, username: user.username });

    // If user wants to change password, verify current password
    if (newPassword) {
      const isValidPassword = await user.verifyPassword(currentPassword);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Update user fields
    const updates = {
      ...(username && { username }),
      ...(email && { email }),
      ...(newPassword && { hash_password: newPassword }), // Will be hashed by model hooks
      ...(bio && { bio })
    };

    await user.update(updates);

    // Return updated user without sensitive information
    const updatedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      registration_date: user.registration_date
    };

    res.status(200).json({ 
      message: "Profile updated successfully", 
      user: updatedUser 
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};
