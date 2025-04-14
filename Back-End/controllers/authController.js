import User  from "../models/Signup.js"; // Import your User model
import evn from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

evn.config(); // Load environment variables from .env file
export const signUp = async (req, res) => {
  // console.log(req.body); // Log the request body for debugging
  const { name, email, password, confirmPassword } = req.body;

  try {
    if(password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    // Hash the password 
    const hashedPassword = await bcrypt.hash(password, 10);

    //Checking for existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

  

    // Check if the email is already in use
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create the user
    const newUser = await User.create({
      name,
      email,
      password_hash: hashedPassword,
    });

    // Respond with success
    console.log("User created successfully");
    res.status(201).json({ message: "User created successfully", user: newUser });
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
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //JWT TOKEN
    const JWT_SECRET = process.env.JWT_SECRET;
    // Respond with success
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    
    res.status(200).json({
      message: "User logged in successfully",
      user,
      token, // send the token to the client
    });
    res.status(200).json({ message: "User logged in successfully", user });

  } catch (error) {
    console.error("Failed to login:", error);
    res.status(500).json({ message: "Failed to login", error: error.message });
  }
};