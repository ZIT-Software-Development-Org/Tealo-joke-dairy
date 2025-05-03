import db from '../models/index.js';
const { User } = db;

export const signUp = async (req, res) => {
  console.log("Incoming signup data:", req.body);
  const { name, email, password } = req.body;

  try {
    //Checking for existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create the user - the password will be hashed in the model hooks
    const newUser = await User.create({
      username: name,
      email,
      hash_password: password, // This will be hashed by the model hooks
      registration_date: new Date(),
      is_active: true,
      is_admin: false
    });

    // Store user ID in session
    req.session.userID = newUser.id;
    req.session.email = newUser.email;

    // Respond with success
    console.log("User created successfully");
    res.status(201).json({ 
      message: "User created successfully", 
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("Failed to create data:", error);
    res.status(500).json({ message: "Failed to create user", error: error.message });
  } 
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Store user ID in session
    req.session.userID = user.id;
    req.session.email = user.email;

    // Respond with success
    console.log("User logged in successfully");
    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Failed to login:", error);
    res.status(500).json({ message: "Failed to login", error: error.message });
  }
};