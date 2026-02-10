import express from "express";
import { auth } from "express-openid-connect";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connect from "./db/connect.js";
import asyncHandler from "express-async-handler";
import fs from "fs";
import User from "./models/UserModel.js";

dotenv.config();

const app = express();

/* =========================
   AUTH0 CONFIG (LOCALHOST)
========================= */
const config = {
  authRequired: false,
  auth0Logout: true,

  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL, // http://localhost:8000
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,

  routes: {
    login: "/login",
    logout: "/logout",
    callback: "/callback",
    postLogoutRedirect: process.env.CLIENT_URL, // http://localhost:3000
  },

  session: {
    rolling: true,
    absoluteDuration: 30 * 24 * 60 * 60 * 1000, // 30 days
    cookie: {
      secure: false,   // MUST be false for HTTP
      sameSite: "Lax", // works on localhost
    },
  },
};

/* =========================
   MIDDLEWARES
========================= */
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =========================
   AUTH0 MIDDLEWARE
========================= */
app.use(auth(config));

/* =========================
   ENSURE USER IN DB
========================= */
const ensureUserInDB = asyncHandler(async (user) => {
  const existingUser = await User.findOne({ auth0Id: user.sub });

  if (!existingUser) {
    const newUser = new User({
      auth0Id: user.sub,
      email: user.email,
      name: user.name,
      role: "jobseeker",
      profilePicture: user.picture,
    });

    await newUser.save();
    console.log("✅ User added to DB:", user.email);
  }
});

/* =========================
   ROOT ROUTE
========================= */
app.get("/", async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    await ensureUserInDB(req.oidc.user);
    return res.redirect(process.env.CLIENT_URL);
  }
  res.send("Logged out");
});

/* =========================
   API ROUTES (AUTO LOAD)
========================= */
const routeFiles = fs.readdirSync("./routes").filter(file => file.endsWith('.js'));

for (const file of routeFiles) {
  const route = await import(`./routes/${file}`);
  app.use("/api/v1", route.default);
}

/* =========================
   SERVER START
========================= */
const startServer = async () => {
  try {
    await connect();
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error("❌ Server error:", error.message);
    process.exit(1);
  }
};

startServer();
