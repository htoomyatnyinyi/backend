import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";
import { check } from "express-validator";
import { verifyToken, checkRole } from "../middleware/middleware.js";

const router = express.Router();

router.post(
  "/register",
  [
    check("email", "Valid email is required").isEmail(),
    check("password", "Password must be 6+ characters").isLength({ min: 6 }),
  ],

  async (req, res) => {
    console.log(req.body, req.cookies, "at routes");
    try {
      const { email, password, role = "user" } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
        [email, hashedPassword, role]
      );

      res.status(201).json({ message: "User created" });
    } catch (error) {
      res.status(500).json({ message: "Error registering user" });
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login request:", { email, password });
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    console.log("Query result:", users);

    if (!users[0] || !(await bcrypt.compare(password, users[0].password))) {
      console.log("Login failed: Invalid credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: users[0].id, email: users[0].email, role: users[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    console.log("Generated token:", token);

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    // });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // True in production
      sameSite: "strict",
      path: "/",
    });
    console.log("Cookie set: token");

    res.json({
      user: { id: users[0].id, email: users[0].email, role: users[0].role },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Error logging in" });
  }
});
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
//       email,
//     ]);

//     if (!users[0] || !(await bcrypt.compare(password, users[0].password))) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { id: users[0].id, email: users[0].email, role: users[0].role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//     });

//     res.json({
//       user: { id: users[0].id, email: users[0].email, role: users[0].role },
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error logging in" });
//   }
// });

// backend/routes/auth.js
router.get("/test", verifyToken, (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
});

// router.get("/me", verifyToken, async (req, res) => {
//   res.json({ user: req.user });
// });

// backend/routes/auth.js
router.get("/me", verifyToken, async (req, res) => {
  console.log("Reached /me endpoint with user:", req.user); // Debug log
  res.json({ user: req.user });
});
router.get("/admin", verifyToken, checkRole(["admin"]), (req, res) => {
  res.json({ message: "Admin access granted" });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

export default router;
