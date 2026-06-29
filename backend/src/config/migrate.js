const pool = require("./database");

const schema = `
CREATE TABLE IF NOT EXISTS plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  download_speed INT NOT NULL COMMENT 'Mbps',
  upload_speed INT NOT NULL COMMENT 'Mbps',
  quota_gb INT NOT NULL COMMENT 'Monthly quota in GB',
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(200),
  phone VARCHAR(50),
  address VARCHAR(300),
  plan_id INT,
  status ENUM('active', 'suspended', 'cancelled') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (plan_id) REFERENCES plans(id)
);

CREATE TABLE IF NOT EXISTS pppoe_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_connected TIMESTAMP NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS accounting_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pppoe_user_id INT NOT NULL,
  session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  session_end TIMESTAMP NULL,
  bytes_in BIGINT DEFAULT 0,
  bytes_out BIGINT DEFAULT 0,
  duration_seconds INT DEFAULT 0,
  FOREIGN KEY (pppoe_user_id) REFERENCES pppoe_users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quota_usage (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  period_year INT NOT NULL,
  period_month INT NOT NULL,
  bytes_consumed BIGINT DEFAULT 0,
  quota_exceeded BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  UNIQUE KEY unique_period (client_id, period_year, period_month)
);

-- Seed data
INSERT IGNORE INTO plans (name, download_speed, upload_speed, quota_gb, price) VALUES
  ('Básico 50MB', 50, 25, 500, 15000.00),
  ('Estándar 100MB', 100, 50, 1000, 22000.00),
  ('Premium 300MB', 300, 150, 2000, 35000.00),
  ('Empresa 500MB', 500, 250, 5000, 65000.00);
`;

async function migrate() {
  try {
    const statements = schema.split(";").filter((s) => s.trim().length > 0);
    for (const statement of statements) {
      await pool.execute(statement);
    }
    console.log("Database migrated successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
