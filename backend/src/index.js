const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const clientRoutes = require("./routes/clients");
const planRoutes = require("./routes/plans");
const pppoeRoutes = require("./routes/pppoe");
const accountingRoutes = require("./routes/accounting");
const dashboardRoutes = require("./routes/dashboard");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/clients", clientRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/pppoe", pppoeRoutes);
app.use("/api/accounting", accountingRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`ISP Management API running on port ${PORT}`);
});
