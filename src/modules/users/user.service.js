import { providerEnum } from "../../common/enum/user.enum.js";
import userModel from "../../DB/models/user.model.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "secretKey";
const PHONE_SECRET = process.env.PHONE_SECRET || "phoneSecret";

// ===================== SIGNUP =====================
export const signUp = async (req, res) => {
  try {
    const { name, email, password, phone, age } = req.body;

    const emailExists = await userModel.findOne({ email });
    if (emailExists) {
      return res.status(409).json({ message: "email already exists" });
    }

    // hash password
    const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);

    // encrypt phone
    const encryptedPhone = CryptoJS.AES.encrypt(phone, PHONE_SECRET).toString();

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      phone: encryptedPhone,
      age,
      provider: providerEnum.system,
    });

    // remove password from response
    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(201).json({
      message: "user created successfully",
      user: safeUser,
    });
  } catch (error) {
    return res.status(400).json({
      message: "validation error",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email, provider: providerEnum.system });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    return res.status(400).json({
      message: "validation error",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.userId;

    // ممنوع تعديل الباسورد هنا
    if (req.body.password) {
      return res.status(400).json({ message: "Cannot update password" });
    }

    // لو بيغير email اتأكد أنه مش موجود لحد تاني
    if (req.body.email) {
      const emailExists = await userModel.findOne({ email: req.body.email });
      if (emailExists && emailExists._id.toString() !== userId) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    const user = await userModel
      .findByIdAndUpdate(userId, req.body, { new: true })
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User updated", user });
  } catch (error) {
    return res.status(400).json({ message: "validation error", error: error.message });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const userId = req.userId;

    const deleted = await userModel.findByIdAndDelete(userId);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return res.status(400).json({ message: "validation error", error: error.message });
  }
};


export const getUser = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ message: "validation error", error: error.message });
  }
};
