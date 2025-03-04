const express = require("express");
const User = require("../models/usermodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

// Register new user
router.post("/register", async (req, res) => {
  try {
    // Check if user already exists
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(200).json({
        success: true,
        message: "User already exists", // Error message
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User created successfully", // Success message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message, // Server error message
    });
  }
});
router.post("/login", async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(201).json({
        success: true,
        message: "user not found", // Error message
      });
    } else {
      // if user is active
      if (user.Status !== "active") {
        throw new Error("The user account is blocked , please contact admin");
      }
    }

    //Validate password
    const validpassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validpassword) {
      return res.status(200).json({
        success: false,
        message: "Invalid password", // Error message
      });
    }
    // Generate token only if user exists
    const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
      expiresIn: "5h",
    });
    // Send success response
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: token,
    });
  } catch (error) {
    // Error handling
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// Example of using return after sending a response

router.get("/get-current-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    // if (!user) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "User not found", // Handle case where user is not found
    //   });
    // }
    res.status(200).json({
      success: true,
      message: "user fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// get all users
router.get("/get-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.send({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// update user status
router.put("/update-user-status/:id", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.send({
      success: true,
      message: "User status updated successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
