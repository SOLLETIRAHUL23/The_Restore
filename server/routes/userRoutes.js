// const router = require("express").Router();
// const User = require("../models/usermodel");
// const bcrypt = require("bcryptjs");

// // New user Register
// router.post("/register", async (req, res) => {
//   try {
//     //check if the user alredy exists
//     console.log(req.body);
//     const user = await User.findOne({ email: req.body.email });
//     console.log(user);
//     if (user) {
//       res.send({
//         success: true,
//         message: "user already exists",
//       });
//       //throw new Error("user already exists");
//     }

//     //hash password

//     // const salt = await bcrypt.genSalt(10);
//     // const hashedPassword = await bcrypt.hash(req.body.password, salt);
//     // req.body.Password = hashedPassword;

//     //New user
//     // const newUser = new User({
//     //   name: req.body.Name,
//     //   email: req.body.Email,
//     //   password: req.body.Password,
//     // });
//     const newUser = new User(req.body);
//     console.log(newUser);
//     await newUser.save();
//     res.send({
//       success: true,
//       message: "User created succesfully",
//     });
//   } catch (error) {
//     res.send({
//       success: false,
//       message: error.message,
//     });
//   }
// });

// // user login

// module.exports = router;
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
      expiresIn: "1h",
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

// router.post("/login", async (req, res) => {
//   try {
//     //check if user exists
//     const user = await User.findOne({ email: req.body.email });
//     const token = jwt.sign({ userid: user._id }, process.env.jwt_secret, {
//       expiresIn: "1h",
//     });
//     if (!user) {
//       return res.status(200).json({
//         success: false,
//         message: "user not found", // Error message
//       });
//     }
//     const validpassword = await bcrypt.compare(
//       req.body.password,
//       user.password
//     );
//     if (!validpassword) {
//       return res.status(200).json({
//         success: false,
//         message: "Invalid password", // Error message
//       });
//     }
//     res.send({
//       success: true,
//       message: "User logged in successfully",
//       data: token,
//     });
//   } catch (error) {
//     res.send({
//       success: false,
//       message: error.message,
//     });
//   }
// });

// router.get("/get-current-user", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.body.userId);
//     res.send({
//       success: true,
//       message: "user fetched successfully",
//       data: user,
//     });
//   } catch (error) {
//     res.send({
//       success: false,
//       message: error.message,
//     });
//   }
// });
module.exports = router;
