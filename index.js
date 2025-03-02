// backend/server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.js";
dotenv.config();

const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:5173", // Vite's default port
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// Allow all origins for CORS
app.use(
  cors({
    origin: "*", // Allows all origins
    credentials: true, // Still allows cookies
  })
);
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:5173", // Set in .env
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type"],
//   })
// );

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// import dotenv from "dotenv";
// // const authRoutes = require("./routes/auth");
// // const db = require("./config/db");
// // import { pool } from "./src/config/database";
// import authRoutes from "./src/routes/auth.js";
// // import { verifyToken, checkRole } from "./src/middleware/auth.js";
// dotenv.config();

// const app = express();

// // app.use(
// //   cors({
// //     origin: "http://localhost:5173",
// //     credentials: true,
// //   })
// // );

// // backend/server.js
// const corsOptions = {
//   origin: "http://localhost:5173", // Vite default port (not 3000)
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions)); // Handle preflight requests

// app.use(express.json());
// app.use(cookieParser());

// app.use("/api/auth", authRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// export default app;
