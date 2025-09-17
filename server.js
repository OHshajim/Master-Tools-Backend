// ----------------------
// Imports & Config
// ----------------------
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const { watchCollections } = require("./utils/watchCollections");

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

// ----------------------
// Middleware
// ----------------------
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(express.json());
const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:3000", // if you use another dev port
  "chrome-extension://peiihbdphmclmfafbecboinnloeigpol",
  process.env.CLIENT_ORIGIN, // prod client
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ----------------------
// Routes
// ----------------------
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/plans", require("./routes/planRoutes"));
app.use("/api/archivedPlans", require("./routes/archivedPlansRoutes"));
app.use("/api/coupons", require("./routes/couponRoutes"));
app.use("/api/platforms", require("./routes/platformRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/quickLinks", require("./routes/quickLinksRoutes"));
app.use("/api/credential", require("./routes/credentialRoutes"));
app.use("/api/cookies", require("./routes/cookieRoutes"));
app.use("/api/draftPlatforms", require("./routes/draftPlatformRoutes"));
app.use("/api/tutorial", require("./routes/tutorialRoutes"))
app.use("/api/tokens", require("./routes/tokenRoutes"));
app.use("/api/copy-visibility", require("./routes/copyVisibilityRoutes"));

// Health check
app.get("/health", (_, res) => res.json({ ok: true }));

// Test route
app.get("/", (req, res) => {
    res.send("API is up and running 🚀");
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
});

// ----------------------
// Real-time Setup
// ----------------------

async function start() {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("MongoDB connected ✅");

    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_ORIGIN,
            credentials: true,
        },
    });

    // Make io accessible in routes if needed
    app.set("io", io);

    // Socket connection logs
    io.on("connection", (socket) => {
        console.log("⚡ User connected:", socket.id);
        socket.on("disconnect", () => {
            console.log("❌ User disconnected:", socket.id);
        });
    });

    // ✅ Watch collections
    watchCollections(io);

    server.listen(PORT, () => console.log(`🚀 Server running on :${PORT}`));
}
start();
