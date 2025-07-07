require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// PostgreSQL connection configuration
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "your_database_name",
  password: process.env.DB_PASSWORD || "your_password",
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to PostgreSQL database:", err);
  } else {
    console.log("Connected to PostgreSQL database successfully!");
    release();
  }
});

// GET all users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id");
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// GET specific user by ID
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// POST - Create a new user
app.post("/users", async (req, res) => {
  const { name, email, age } = req.body;

  // Basic validation
  if (!name || !email || !age) {
    return res.status(400).json({
      success: false,
      error: "Name, email, and age are required",
    });
  }

  if (age < 0 || age > 150) {
    return res.status(400).json({
      success: false,
      error: "Age must be between 0 and 150",
    });
  }

  try {
    const result = await pool.query(
      "INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *",
      [name, email, age]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: "User created successfully",
    });
  } catch (err) {
    console.error("Error creating user:", err);

    // Handle unique constraint violations (if email should be unique)
    if (err.code === "23505") {
      return res.status(409).json({
        success: false,
        error: "User with this email already exists",
      });
    }

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// PUT - Update a user
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

  // Basic validation
  if (!name || !email || !age) {
    return res.status(400).json({
      success: false,
      error: "Name, email, and age are required",
    });
  }

  if (age < 0 || age > 150) {
    return res.status(400).json({
      success: false,
      error: "Age must be between 0 and 150",
    });
  }

  try {
    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2, age = $3 WHERE id = $4 RETURNING *",
      [name, email, age, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: "User updated successfully",
    });
  } catch (err) {
    console.error("Error updating user:", err);

    if (err.code === "23505") {
      return res.status(409).json({
        success: false,
        error: "User with this email already exists",
      });
    }

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// DELETE - Delete a user
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await pool.end();
  process.exit(0);
});

module.exports = app;
