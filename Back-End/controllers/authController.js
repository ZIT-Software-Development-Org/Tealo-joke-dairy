import sequelize from "../config/database.js";
import bcrypt from "bcrypt";

export const createData = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    //Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the user into the database
    const query = `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
    `;
    const values = [name, email, hashedPassword];
    await sequelize.query(query, values);

    res.status(201).json({ success: true, message: "Data created successfully" });
    console.log('Data created successfully')
    
  } catch (error) {
    console.error("Failed to create data:", error);
    res.status(500).json({ success: false, message: "Failed to create data" });
  }
};