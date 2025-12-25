import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { findUserByEmail, createUserInCosmos } from "../services/cosmosService.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123"; // Ise .env mein rakhna chahiye

// --- REGISTER ---
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash Password (Security)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Save User
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword, // Encrypted password save hoga
      type: "user", // Taaki blogs se mix na ho
      createdAt: new Date().toISOString()
    };

    await createUserInCosmos(newUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
};

// --- LOGIN ---
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find User
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Generate Token (Digital ID Card)
    const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, {
      expiresIn: "1d", // 1 din tak valid rahega
    });

    res.status(200).json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
};